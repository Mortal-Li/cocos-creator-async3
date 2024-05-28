
import { join } from 'path';
import packageJSON from '../../package.json';

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

    static url2pathAsy(url: string) {
        return new Promise<string>((resolve, reject) => {
            Editor.Message.request('asset-db', 'query-path', url)
            .then((str) => {
                resolve(str ? str : "");
            })
            .catch(reject);
        });
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
    static refreshResAsy(url: string) {
        return Editor.Message.request('asset-db', 'refresh-asset', url);
    }
}