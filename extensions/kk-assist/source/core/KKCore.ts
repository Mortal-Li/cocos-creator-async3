
import { copyFileSync, copySync, existsSync, mkdirSync, outputJsonSync, readFileSync, readJsonSync, readdirSync, renameSync, statSync, writeFileSync } from "fs-extra";
import { extname, join } from "path";
import KKUtils from "./KKUtils";
import { hostname } from "os";

export default class KKCore {

    static projPrefix: string = "";

    static async doInitProjAsy(pfx: string) {
        let fwPath = join(Editor.Project.path, "assets", "framework");
        if (existsSync(fwPath)) {
            Editor.Dialog.warn("The project has been initialized!", {
                buttons: ["OK"]
            });
        } else {
            console.log("Start initializing ...");
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
            KKCore.projPrefix = pfx;

            //只是对资源的刷新，如果添加了新代码，代码有个编译时间不包含在内
            //programming:compiled 编译完毕的广播事件
            await KKUtils.refreshResAsy("db://assets");
            //等待代码编译完毕
            await KKUtils.checkFramework();

            await KKUtils.genSceneAsy("db://assets/Boot/Stage.scene");
            await KKUtils.openSceneAsy("db://assets/Boot/Stage.scene");
            let rootInfo = await KKUtils.getSceneRootNodeInfoAsy();
            //@ts-ignore
            let nodeUuid: string = rootInfo.children[0].uuid;
            let uuid1 = await KKUtils.url2uuidAsy("db://assets/framework/widget/Adapter.ts");
            await KKUtils.genCompAsy(nodeUuid, Editor.Utils.UUID.compressUUID(uuid1, false));
            let uuid2 = await KKUtils.url2uuidAsy("db://assets/Boot/Scripts/Stage.ts");
            await KKUtils.genCompAsy(nodeUuid, Editor.Utils.UUID.compressUUID(uuid2, false));
            await KKUtils.saveSceneAsy();

            console.log("Initialization complete.");
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

                let confUrl = KKUtils.getConfUrl(KKCore.projPrefix);
                let confPath = await KKUtils.url2pathAsy(confUrl);
                let confStr = readFileSync(confPath, 'utf-8');
                if (confStr.indexOf("@bundle") == -1) {
                    confStr += `\nexport const ${KKCore.projPrefix}BundleConf = {\n\t//@bundle\n};`;
                }
                confStr = confStr.replace("//@bundle", `${KKUtils.removePfxAndSfx(bundleName, KKCore.projPrefix, "Bundle")}: "${bundleName}",\n\t//@bundle`);
                writeFileSync(confPath, confStr);
                await KKUtils.refreshResAsy(confUrl);

                console.log(bundleName + " created!");
                return true;
            } else {
                console.error('Can not find meta file!');
                return false;
            }
        }
    }

    static async doCreateLayer(layerName: string, bundleName: string, cacheMode: number) {
        let isOK = await KKCore.genUIUnit("Layer", layerName, bundleName);
        if (isOK) {
            let bdl = KKUtils.removePfxAndSfx(bundleName, KKCore.projPrefix, "Bundle");
            let tag = "@layer";
            let caches = cacheMode != 0 ? (cacheMode == 1 ? "\n\t\tcacheMode: UICacheMode.Cache" : "\n\t\tcacheMode: UICacheMode.Stay") : "";
            await KKCore.genUIConf("Layer", layerName, bdl, tag, caches);
        }
    }

    static async doCreatePopup(popupName: string, bundleName: string, cacheMode: number) {
        let isOK = await KKCore.genUIUnit("Popup", popupName, bundleName);
        if (isOK) {
            let bdl = KKUtils.removePfxAndSfx(bundleName, KKCore.projPrefix, "Bundle");
            let tag = `@${bdl.toLowerCase()}_popup`;
            let caches = cacheMode == 0 ? "" : "\n\t\tcacheMode: UICacheMode.Cache";
            await KKCore.genUIConf("Popup", popupName, bdl, tag, caches);
        }
    }

    static async doCreatePanel(panelName: string, bundleName: string, cacheMode: number) {
        let isOK = await KKCore.genUIUnit("Panel", panelName, bundleName);
        if (isOK) {
            let bdl = KKUtils.removePfxAndSfx(bundleName, KKCore.projPrefix, "Bundle");
            let tag = `@${bdl.toLowerCase()}_Panel`;
            let caches = cacheMode == 0 ? "" : "\n\t\tcacheMode: UICacheMode.Cache";
            await KKCore.genUIConf("Panel", panelName, bdl, tag, caches);
        }
    }

    static async doCreateWidget(widgetName: string, bundleName: string, cacheMode: number) {
        let isOK = await KKCore.genUIUnit("Widget", widgetName, bundleName);
        if (isOK) {
            let bdl = KKUtils.removePfxAndSfx(bundleName, KKCore.projPrefix, "Bundle");
            let tag = `@${bdl.toLowerCase()}_Widget`;
            let caches = cacheMode == 0 ? "" : "\n\t\tcacheMode: UICacheMode.Cache";
            await KKCore.genUIConf("Widget", widgetName, bdl, tag, caches);
        }
    }

    static async genUIConf(typeName: string, uiName: string, bdl: string, tag: string, cacheContent: string) {
        let confUrl = KKUtils.getConfUrl(KKCore.projPrefix);
        let confPath = await KKUtils.url2pathAsy(confUrl);
        let confStr = readFileSync(confPath, 'utf-8');
        if (confStr.indexOf(tag) == -1) {
            confStr += `\nexport const ${KKCore.projPrefix + (typeName == "Layer" ? "" : bdl)}${typeName}Conf = {\n\t//${tag}\n};\n`;
        }

        confStr = confStr.replace("//" + tag, `${KKUtils.removePfxAndSfx(uiName, KKCore.projPrefix, typeName)}: <IUIConfig> {
        bundle: ${KKCore.projPrefix}BundleConf.${bdl},
        name: "${uiName}",${cacheContent}
    },

    //${tag}`);

        writeFileSync(confPath, confStr);
        await KKUtils.refreshResAsy(confUrl);
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
            return false;
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
            return true;
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