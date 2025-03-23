
import { join } from 'path';
import packageJSON from '../../package.json';
import { readFileSync } from 'fs-extra';

export default class KKUtils {
    static sleepAsy(t: number) {
        return new Promise<void>((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, t * 1000);
        });
    }

    static biggerThanVer(ver: string) {
        let tgtVers = ver.split('.');
        let curVers = Editor.App.version.split('.');

        for (let i = 0; i < curVers.length; ++i) {
            if (Number(curVers[i]) > Number(tgtVers[i])) {
                return true;
            }
        }

        return false;
    }

    static getPluginPath() {
        return join(Editor.Project.path, "extensions", packageJSON.name);
    }

    static getConfUrl(pfx: string) {
        return `db://assets/Boot/Scripts/${pfx}GameUIConf.ts`;
    }

    static removePfxAndSfx(s: string, pfx: string, sfx: string) {
        return s.substring(pfx.length, s.length - sfx.length);
    }

    static url2pathAsy(url: string) {
        return new Promise<string>((resolve, reject) => {
            Editor.Message.request('asset-db', 'query-path', url)
            .then((str) => {
                resolve(str ? str : "");
            })
            .catch(reject);
        });
    }

    static uuid2pathAsy(uuid: string) {
        return KKUtils.url2pathAsy(uuid);
    }

    static url2uuidAsy(url: string) {
        return new Promise<string>((resolve, reject) => {
            Editor.Message.request('asset-db', 'query-uuid', url)
            .then((str) => {
                resolve(str ? str : "");
            })
            .catch(reject);
        });
    }

    /**
     * 如果有嵌套资源，子资源要在后面更新，否则编辑器不显示，需要手动刷新
     */
    static refreshResAsy(urlOrUuid: string) {
        return Editor.Message.request('asset-db', 'refresh-asset', urlOrUuid);
    }

    static genSceneAsy(url: string) {
        let astUrl = '';
        if (KKUtils.biggerThanVer("3.8.2")) astUrl = 'db://internal/default_file_content/scene/scene-2d.scene';
        else astUrl = 'db://internal/default_file_content/scene-2d';

        return KKUtils.genAssetsAsy(url, astUrl);
    }

    static async genAssetsAsy(targetUrl: string, templateUrl: string) {
        let url = await Editor.Message.request('asset-db', 'generate-available-url', targetUrl);
        let templatePath = await KKUtils.url2pathAsy(templateUrl);
        let infoContent = readFileSync(templatePath).toString();

        await Editor.Message.request('asset-db', 'create-asset', url, infoContent, {});
        console.log(`gen ${targetUrl} successfully`);
    }

    static async openSceneAsy(url: string) {
        let uuid = await KKUtils.url2uuidAsy(url);
        await Editor.Message.request('scene', 'open-scene', uuid);
    }

    static saveSceneAsy() {
        return Editor.Message.request('scene', 'save-scene');
    }

    static genCompAsy(nodeUuid: string, compUuid: string) {
        return Editor.Message.request('scene', 'create-component', { 
            uuid: nodeUuid,
            component: compUuid
        });
    }

    static getSceneRootNodeInfoAsy() {
        return Editor.Message.request('scene', 'query-node-tree');
    }

    static getNodeInfoAsy(nodeUuid: string) {
        return Editor.Message.request('scene', 'query-node', nodeUuid);
    }

    static getCompInfoAsy(compUuid: string) {
        return Editor.Message.request('scene', 'query-component', compUuid);
    }

    static setPropertyAsy(scriptNodeUuid: string, scriptOrder: number, propName: string, propType: string, propUUid: string) {
        return Editor.Message.request('scene', 'set-property', {
            uuid: scriptNodeUuid,
            path: `__comps__.${scriptOrder}.${propName}`,
            dump: {
                type: propType,
                value: {
                    uuid: propUUid,
                },
            },
        });
    }

    static checkFramework() {
        let _check = (rsv: Function) => {
            Editor.Message.request('scene', 'query-classes', {
                extends: "cc.Component"
            }).then((infos) => {
                let isOK = false;
                for (let l = infos.length - 1; l >= 0; --l) {
                    if (infos[l].name == 'Adapter') {
                        isOK = true;
                        break;
                    }
                }
                if (isOK) {
                    rsv();
                } else {
                    setTimeout(() => { _check(rsv); }, 300);
                }
            });
        };

        return new Promise<void>((resolve, reject) => {
            _check(resolve);
        });
    }
}