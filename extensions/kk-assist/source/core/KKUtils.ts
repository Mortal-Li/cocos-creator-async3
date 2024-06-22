
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
        return KKUtils.genAssetsAsy(url, "db://internal/default_file_content/scene-2d");
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

    static genCompAsy(nodeUuid: string, compName: string) {
        return Editor.Message.request('scene', 'create-component', { 
            uuid: nodeUuid,
            component: compName
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
}