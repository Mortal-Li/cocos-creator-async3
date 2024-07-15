import { readFileSync, writeFileSync } from "fs-extra";
import KKUtils from "./core/KKUtils";
import path from "path";
import packageJSON from '../package.json';

function getPropCode(typeName: string, propName: string) {
    return `
    @property(${typeName})
    private ${propName}: ${typeName} = null;`;
}

function getInputPropNameAsy(defaultName: string) {
    return Editor.Message.request(packageJSON.name, "get-input-name", defaultName);
}

export async function onNodeMenu(info: any): Promise<Editor.Menu.BaseMenuItem[]> {
    if (!info) return [];
    
    let nodeInfo = await KKUtils.getNodeInfoAsy(info.uuid);
    if (!nodeInfo.__prefab__) return [];
    let rootNodeUUid = nodeInfo.__prefab__.rootUuid;
    let rootInfo = await KKUtils.getNodeInfoAsy(rootNodeUUid);
    let scriptName = rootInfo.name.value;
    let scriptOrder = -1;
    let scriptUuid;
    for (let i = 0; i < rootInfo.__comps__.length; ++i) {
        if (rootInfo.__comps__[i].type == scriptName) {
            scriptOrder = i;
            scriptUuid = rootInfo.__comps__[i].cid;
            break;
        }
    }

    if (!scriptUuid) {
        console.log("Cant find root script");
        return [];
    }
    const deUuid = Editor.Utils.UUID.decompressUUID(scriptUuid);
    const scriptPath = await KKUtils.uuid2pathAsy(deUuid);

    let propName = info.name;
    let compMenus: Editor.Menu.BaseMenuItem[] = [];
    let comps = info.components;
    comps.forEach((one: any, i: number) => {
        compMenus.push({
            label: one.type,
            async click() {
                propName = await getInputPropNameAsy(propName);
                if (!propName) return;

                let propType = one.type as string;
                let propTypeName = propType;
                let importType = "";
                if (propType.startsWith("cc.")) {
                    propTypeName = propType.substring(3);
                    importType = propTypeName;
                } else if (propType.startsWith("sp.") || propType.startsWith("dragonBones.")) {
                    importType = propType.split('.')[0];
                }

                let tsStr = readFileSync(scriptPath, "utf-8");
                if (tsStr.includes(`private ${propName}: ${propTypeName}`)) {
                    console.warn(`${propName}: ${propTypeName} has bound!`);
                    return;
                }

                let matchRst = tsStr.match(/ extends .*?{/)
                if (!matchRst) {
                    console.log("reg match failed");
                    return;
                }
                let propCode = getPropCode(propTypeName, propName);
                tsStr = tsStr.replace(matchRst[0], matchRst[0] + '\n' + propCode);

                if (importType.length > 0) {
                    matchRst = tsStr.match(/import .*?} from 'cc';/);
                    if (matchRst && !matchRst[0].includes(importType)) {
                        tsStr = tsStr.replace(" } from 'cc'", `, ${importType} } from 'cc'`);
                    }
                } else {
                    if (!tsStr.includes(`import { ${propTypeName} }`)) {
                        matchRst = tsStr.match(/const { ccclass, .*?;/);
                        if (matchRst) {
                            let compInfo = await KKUtils.getCompInfoAsy(one.value) as any;
                            let compPath = await KKUtils.uuid2pathAsy(Editor.Utils.UUID.decompressUUID(compInfo.cid));
                            let rlPath = path.relative(path.dirname(scriptPath), compPath);
                            rlPath = rlPath.replace(/\.\w+$/, '').replace(/\\/g, '/');
                            tsStr = tsStr.replace(matchRst[0], `import { ${propTypeName} } from '${rlPath}';` + '\n' + matchRst[0]);
                        }
                    }
                }

                writeFileSync(scriptPath, tsStr, "utf-8");
                await KKUtils.refreshResAsy(deUuid);
                await KKUtils.sleepAsy(0.5);
                await KKUtils.setPropertyAsy(rootNodeUUid, scriptOrder, propName, propType, one.value);
                console.log(`绑定 ${propName}<=>${propTypeName} 成功`);
            }
        });
    });

    return [
        {
            label: "🪢快速绑定到脚本",
            submenu: [
                {
                    label: "节点",
                    async click() {
                        propName = await getInputPropNameAsy(propName);
                        if (!propName) return;
                        
                        let propCode = getPropCode("Node", propName);
                        let tsStr = readFileSync(scriptPath, "utf-8");
                        let matchRst = tsStr.match(/ extends .*?{/)
                        if (!matchRst) {
                            console.log("reg match failed");
                            return;
                        }
                        tsStr = tsStr.replace(matchRst[0], matchRst[0] + '\n' + propCode);
                        writeFileSync(scriptPath, tsStr, "utf-8");

                        await KKUtils.refreshResAsy(deUuid);
                        await KKUtils.sleepAsy(0.5);
                        await KKUtils.setPropertyAsy(rootNodeUUid, scriptOrder, propName, "cc.Node", info.uuid);
                        console.log(`绑定 ${propName}<=>cc.Node 成功`);
                    }
                },
                {
                    label: "组件",
                    submenu: compMenus
                }
            ]
        }
    ];
}