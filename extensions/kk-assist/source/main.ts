import { BrowserWindow, ipcMain } from 'electron';
// @ts-ignore
import packageJSON from '../package.json';
import { join } from 'path';
/**
 * @en 
 * @zh 为扩展的主进程的注册方法
 */
export const methods: { [key: string]: (...any: any) => any } = {
    openPanel() {
        Editor.Panel.open(packageJSON.name);
    },

    getBindNameInput(propName: string) {
        return new Promise<string>((resolve, reject) => {
            let win = new BrowserWindow({
                width: 520,
                height: 80,
                frame: false,
                resizable: false,
                fullscreenable: false,
                skipTaskbar: true,
                alwaysOnTop: true,
                transparent: true,
                opacity: 0.95,
                backgroundColor: '#00000000',
                hasShadow: false,
                show: false,
                webPreferences: {
                    nodeIntegration: true,
                    contextIsolation: false,
                },
            });

            function cancelByEsc(event: any, input: any) {
                if (input.key === 'Escape') cancelInput();
            }
    
            function cancelInput() {
                win.off('blur', cancelInput);
                win.webContents.off('before-input-event', cancelByEsc);
                win.close();
                win.destroy();
                ipcMain.removeAllListeners("get-input-result");
                resolve("");
            }

            // 就绪后展示
            win.once('ready-to-show', () => win.show());
            // 失焦后关闭
            win.once('blur', cancelInput);
            // 监听ESC按键
            win.webContents.once('before-input-event', cancelByEsc);
    
            const fp = join(__dirname, '../static/input/index.html');
            win.loadURL(`file://${fp}?prop=${propName}`);

            ipcMain.once("get-input-result", (event, inputName) => {
                win.close();
                win.destroy();
                resolve(inputName);
            });
        });
    }
};

/**
 * @en Hooks triggered after extension loading is complete
 * @zh 扩展加载完成后触发的钩子
 */
export function load() { }

/**
 * @en Hooks triggered after extension uninstallation is complete
 * @zh 扩展卸载完成后触发的钩子
 */
export function unload() { }
