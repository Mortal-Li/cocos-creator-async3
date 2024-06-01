
import { copyFileSync, copySync, existsSync, mkdirSync, outputJsonSync, readFileSync, readJsonSync, readdirSync, renameSync, statSync, writeFileSync } from "fs-extra";
import { extname, join } from "path";
import KKUtils from "./KKUtils";
import { hostname } from "os";

export default class KKCore {

    static async doInitProjAsy(pfx: string) {
        let fwPath = join(Editor.Project.path, "assets", "framework");
        if (existsSync(fwPath)) {
            Editor.Dialog.warn("The project has been initialized!", {
                buttons: ["OK"]
            });
        } else {
            let dstPath = join(Editor.Project.path, "assets");

            let srcPath = join(KKUtils.getPluginPath(), "template", "init");
            let files = readdirSync(srcPath);
            files.forEach((fn) => {
                copySync(join(srcPath, fn), join(dstPath, fn));
            });

            let confPath = join(dstPath, "Boot", "Scripts", "GameUIConf.ts");
            if (existsSync(confPath)) {
                renameSync(confPath, confPath.replace("GameUIConf", pfx + "GameUIConf"));
            } else {
                console.error("Cannot find the GameUIConf.ts");
                return;
            }

            await KKUtils.refreshResAsy("db://assets");

            await KKUtils.genSceneAsy("db://assets/Stage.scene");
            await KKUtils.openSceneAsy("db://assets/Stage.scene");
            let rootInfo = await KKUtils.getSceneRootNodeInfoAsy();
            //@ts-ignore
            let nodeUuid: string = rootInfo.children[0].uuid;
            await KKUtils.genCompAsy(nodeUuid, "Adapter");
            await KKUtils.genCompAsy(nodeUuid, "Stage");
            await KKUtils.saveSceneAsy();
        }
    }

    /////////////////////////////////////////////////////////////////////////////////////////////

    static getBundles() {
        let bundles: string[] = [];
        let assetPath = join(Editor.Project.path, "assets");
        readdirSync(assetPath).map(itemName => {
            let abPath = join(assetPath, itemName);
            if (statSync(abPath).isDirectory() && itemName != "resources") {
                let meta = readJsonSync(abPath + ".meta");
                if (meta.userData?.isBundle) {
                    bundles.push(itemName);
                }
            }
        });
        return bundles;
    }

    static async doCreateBundle(bundleName: string, priority: number) {
        let bundlePathUrl = "db://assets/" + bundleName;
        let bundlePath = await KKUtils.url2pathAsy(bundlePathUrl);

        if (existsSync(bundlePath)) {
            Editor.Dialog.warn(bundleName + " already exists", {
                buttons: ["OK"]
            });
            return false;
        } else {
            mkdirSync(bundlePath);
            await KKUtils.refreshResAsy(bundlePathUrl);
    
            let metaPath = bundlePath + '.meta';
            if (existsSync(metaPath)) {
                let meta = readJsonSync(metaPath);
                meta.userData.isBundle = true;
                meta.userData.priority = priority;
                outputJsonSync(metaPath, meta);
                await KKUtils.refreshResAsy(bundlePathUrl);

                mkdirSync(join(bundlePath, "Prefabs"));
                mkdirSync(join(bundlePath, "Scripts"));
                mkdirSync(join(bundlePath, "Textures"));
                await KKUtils.refreshResAsy(bundlePathUrl);
                console.log(bundleName + " created!");
                return true;
            } else {
                console.error('Can not find meta file!');
                return false;
            }
        }
    }

    static doCreateLayer(layerName: string, bundleName: string) {
        KKCore.genUIUnit("Layer", layerName, bundleName);
    }

    static doCreatePopup(popupName: string, bundleName: string) {
        KKCore.genUIUnit("Popup", popupName, bundleName);
    }

    static doCreatePanel(panelName: string, bundleName: string) {
        KKCore.genUIUnit("Panel", panelName, bundleName);
    }

    static doCreateWidget(widgetName: string, bundleName: string) {
        KKCore.genUIUnit("Widget", widgetName, bundleName);
    }

    static async genUIUnit(typeName: string, uiName: string, bundleName: string) {
        let bundleUrl = "db://assets/" + bundleName;
        
        let typeDirUrl = `${bundleUrl}/Prefabs/${typeName}`;
        let typeDirPath = await KKUtils.url2pathAsy(typeDirUrl);
        if (!existsSync(typeDirPath)) {
            mkdirSync(typeDirPath);
            await KKUtils.refreshResAsy(typeDirUrl);
        }
    
        let prefabUrl = `${typeDirUrl}/${uiName}.prefab`;
        let prefabPath = await KKUtils.url2pathAsy(prefabUrl);
        if (existsSync(prefabPath)) {
            Editor.Dialog.warn(uiName + " already exists", {
                buttons: ["OK"]
            });
        } else {
            let tsUrl = bundleUrl + "/Scripts/" + uiName + ".ts";
            let tsPath = await KKUtils.url2pathAsy(tsUrl);
            copyFileSync(join(KKUtils.getPluginPath(), "template", `Template${typeName}.ts`), tsPath);
            copyFileSync(join(KKUtils.getPluginPath(), "template", "TemplatePfb.prefab"), prefabPath);
    
            let tsStr = readFileSync(tsPath).toString();
            tsStr = tsStr.replace("@author", "@author " + hostname());
            tsStr = tsStr.replace("@created", "@created " + (new Date()).toLocaleString());
            writeFileSync(tsPath, tsStr.replace(new RegExp("NewClass", 'g'), uiName));
    
            await KKUtils.refreshResAsy(tsUrl);

            let tsUUID = await KKUtils.url2uuidAsy(tsUrl);
            let compressUuid = Editor.Utils.UUID.compressUUID(tsUUID, false);

            let prefabStr = readJsonSync(prefabPath);
            prefabStr[0]._name = uiName;
            prefabStr[1]._name = uiName;
            prefabStr[6].__type__ = compressUuid;
            prefabStr.forEach((one: any, i: number) => {
                if (one.fileId) {
                    one.fileId = Editor.Utils.UUID.generate(true);
                }
            });
            outputJsonSync(prefabPath, prefabStr);
            await KKUtils.refreshResAsy(prefabUrl);
            console.log(`${uiName} created!`);
        }
    }

    /////////////////////////////////////////////////////////////////////////////////////////////

    static getCodeCount() {
        let codeInfo = {
            code: 0,        //有效行数
            space: 0,       //空行数
            comment: 0,     //注释行数
            total: 0,       //总行数
        };

        let checkDir = (dirPath: string) => {
            let files = readdirSync(dirPath);
            files.forEach((fileName) => {
                let subPath = join(dirPath, fileName);
                let stat = statSync(subPath);

                if (stat.isDirectory()) {
                    checkDir(subPath);
                } else if (stat.isFile() && extname(fileName) == ".ts") {
                    let content = readFileSync(subPath, 'utf-8');
                    let lines = content.split('\n');
                    let inMultilineComment = false;
                    lines.forEach((line) => {
                        let trimLine = line.trim();

                        if (trimLine === "") {
                            codeInfo.space += 1;
                        } else if (trimLine.startsWith("//")) {
                            codeInfo.comment += 1;
                        } else if (trimLine.startsWith("/*")) {
                            codeInfo.comment += 1;
                            inMultilineComment = true;
                        } else if (trimLine.endsWith("*/")) {
                            codeInfo.comment += 1;
                            inMultilineComment = false;
                        } else if (inMultilineComment) {
                            codeInfo.comment += 1;
                        } else {
                            codeInfo.code += 1;
                        }
                    });
                }
            });
        };

        checkDir(join(Editor.Project.path, "assets"));
        codeInfo.total = codeInfo.code + codeInfo.space + codeInfo.comment;

        return codeInfo;
    }

    static getResCount() {
        let extInfo: {[key: string]: { num: number, size: number }} = {};
        
        let checkDir = (dirPath: string) => {
            let files = readdirSync(dirPath);
            files.forEach((fileName) => {
                let subPath = join(dirPath, fileName);
                let stat = statSync(subPath);

                if (stat.isDirectory()) {
                    checkDir(subPath);
                } else if (stat.isFile()) {
                    let ext = extname(fileName);
                    if (!ext) ext = "unknown";
                    if (extInfo[ext]) {
                        extInfo[ext].num += 1;
                        extInfo[ext].size += stat.size;
                    } else {
                        extInfo[ext] = {
                            num: 1,
                            size: stat.size
                        };
                    }
                }
            });
        };

        checkDir(join(Editor.Project.path, "assets"));

        return extInfo;
    }

}