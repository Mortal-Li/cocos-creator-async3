"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unload = exports.load = exports.methods = void 0;
const electron_1 = require("electron");
// @ts-ignore
const package_json_1 = __importDefault(require("../package.json"));
const path_1 = require("path");
/**
 * @en
 * @zh 为扩展的主进程的注册方法
 */
exports.methods = {
    openPanel() {
        Editor.Panel.open(package_json_1.default.name);
    },
    getBindNameInput(propName) {
        return new Promise((resolve, reject) => {
            let win = new electron_1.BrowserWindow({
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
            function cancelByEsc(event, input) {
                if (input.key === 'Escape')
                    cancelInput();
            }
            function cancelInput() {
                win.off('blur', cancelInput);
                win.webContents.off('before-input-event', cancelByEsc);
                win.close();
                win.destroy();
                electron_1.ipcMain.removeAllListeners("get-input-result");
                resolve("");
            }
            // 就绪后展示
            win.once('ready-to-show', () => win.show());
            // 失焦后关闭
            win.once('blur', cancelInput);
            // 监听ESC按键
            win.webContents.once('before-input-event', cancelByEsc);
            const fp = (0, path_1.join)(__dirname, '../static/input/index.html');
            win.loadURL(`file://${fp}?prop=${propName}`);
            electron_1.ipcMain.once("get-input-result", (event, inputName) => {
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
function load() { }
exports.load = load;
/**
 * @en Hooks triggered after extension uninstallation is complete
 * @zh 扩展卸载完成后触发的钩子
 */
function unload() { }
exports.unload = unload;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NvdXJjZS9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHVDQUFrRDtBQUNsRCxhQUFhO0FBQ2IsbUVBQTBDO0FBQzFDLCtCQUE0QjtBQUM1Qjs7O0dBR0c7QUFDVSxRQUFBLE9BQU8sR0FBNEM7SUFDNUQsU0FBUztRQUNMLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLHNCQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDeEMsQ0FBQztJQUVELGdCQUFnQixDQUFDLFFBQWdCO1FBQzdCLE9BQU8sSUFBSSxPQUFPLENBQVMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7WUFDM0MsSUFBSSxHQUFHLEdBQUcsSUFBSSx3QkFBYSxDQUFDO2dCQUN4QixLQUFLLEVBQUUsR0FBRztnQkFDVixNQUFNLEVBQUUsRUFBRTtnQkFDVixLQUFLLEVBQUUsS0FBSztnQkFDWixTQUFTLEVBQUUsS0FBSztnQkFDaEIsY0FBYyxFQUFFLEtBQUs7Z0JBQ3JCLFdBQVcsRUFBRSxJQUFJO2dCQUNqQixXQUFXLEVBQUUsSUFBSTtnQkFDakIsV0FBVyxFQUFFLElBQUk7Z0JBQ2pCLE9BQU8sRUFBRSxJQUFJO2dCQUNiLGVBQWUsRUFBRSxXQUFXO2dCQUM1QixTQUFTLEVBQUUsS0FBSztnQkFDaEIsSUFBSSxFQUFFLEtBQUs7Z0JBQ1gsY0FBYyxFQUFFO29CQUNaLGVBQWUsRUFBRSxJQUFJO29CQUNyQixnQkFBZ0IsRUFBRSxLQUFLO2lCQUMxQjthQUNKLENBQUMsQ0FBQztZQUVILFNBQVMsV0FBVyxDQUFDLEtBQVUsRUFBRSxLQUFVO2dCQUN2QyxJQUFJLEtBQUssQ0FBQyxHQUFHLEtBQUssUUFBUTtvQkFBRSxXQUFXLEVBQUUsQ0FBQztZQUM5QyxDQUFDO1lBRUQsU0FBUyxXQUFXO2dCQUNoQixHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxXQUFXLENBQUMsQ0FBQztnQkFDN0IsR0FBRyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsb0JBQW9CLEVBQUUsV0FBVyxDQUFDLENBQUM7Z0JBQ3ZELEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztnQkFDWixHQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7Z0JBQ2Qsa0JBQU8sQ0FBQyxrQkFBa0IsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO2dCQUMvQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDaEIsQ0FBQztZQUVELFFBQVE7WUFDUixHQUFHLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztZQUM1QyxRQUFRO1lBQ1IsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsV0FBVyxDQUFDLENBQUM7WUFDOUIsVUFBVTtZQUNWLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLG9CQUFvQixFQUFFLFdBQVcsQ0FBQyxDQUFDO1lBRXhELE1BQU0sRUFBRSxHQUFHLElBQUEsV0FBSSxFQUFDLFNBQVMsRUFBRSw0QkFBNEIsQ0FBQyxDQUFDO1lBQ3pELEdBQUcsQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLFNBQVMsUUFBUSxFQUFFLENBQUMsQ0FBQztZQUU3QyxrQkFBTyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUUsRUFBRTtnQkFDbEQsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUNaLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztnQkFDZCxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDdkIsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7Q0FDSixDQUFDO0FBRUY7OztHQUdHO0FBQ0gsU0FBZ0IsSUFBSSxLQUFLLENBQUM7QUFBMUIsb0JBQTBCO0FBRTFCOzs7R0FHRztBQUNILFNBQWdCLE1BQU0sS0FBSyxDQUFDO0FBQTVCLHdCQUE0QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEJyb3dzZXJXaW5kb3csIGlwY01haW4gfSBmcm9tICdlbGVjdHJvbic7XHJcbi8vIEB0cy1pZ25vcmVcclxuaW1wb3J0IHBhY2thZ2VKU09OIGZyb20gJy4uL3BhY2thZ2UuanNvbic7XHJcbmltcG9ydCB7IGpvaW4gfSBmcm9tICdwYXRoJztcclxuLyoqXHJcbiAqIEBlbiBcclxuICogQHpoIOS4uuaJqeWxleeahOS4u+i/m+eoi+eahOazqOWGjOaWueazlVxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IG1ldGhvZHM6IHsgW2tleTogc3RyaW5nXTogKC4uLmFueTogYW55KSA9PiBhbnkgfSA9IHtcclxuICAgIG9wZW5QYW5lbCgpIHtcclxuICAgICAgICBFZGl0b3IuUGFuZWwub3BlbihwYWNrYWdlSlNPTi5uYW1lKTtcclxuICAgIH0sXHJcblxyXG4gICAgZ2V0QmluZE5hbWVJbnB1dChwcm9wTmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPHN0cmluZz4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgd2luID0gbmV3IEJyb3dzZXJXaW5kb3coe1xyXG4gICAgICAgICAgICAgICAgd2lkdGg6IDUyMCxcclxuICAgICAgICAgICAgICAgIGhlaWdodDogODAsXHJcbiAgICAgICAgICAgICAgICBmcmFtZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICByZXNpemFibGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgZnVsbHNjcmVlbmFibGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgc2tpcFRhc2tiYXI6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBhbHdheXNPblRvcDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHRyYW5zcGFyZW50OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgb3BhY2l0eTogMC45NSxcclxuICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogJyMwMDAwMDAwMCcsXHJcbiAgICAgICAgICAgICAgICBoYXNTaGFkb3c6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgc2hvdzogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICB3ZWJQcmVmZXJlbmNlczoge1xyXG4gICAgICAgICAgICAgICAgICAgIG5vZGVJbnRlZ3JhdGlvbjogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBjb250ZXh0SXNvbGF0aW9uOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gY2FuY2VsQnlFc2MoZXZlbnQ6IGFueSwgaW5wdXQ6IGFueSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGlucHV0LmtleSA9PT0gJ0VzY2FwZScpIGNhbmNlbElucHV0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgIFxyXG4gICAgICAgICAgICBmdW5jdGlvbiBjYW5jZWxJbnB1dCgpIHtcclxuICAgICAgICAgICAgICAgIHdpbi5vZmYoJ2JsdXInLCBjYW5jZWxJbnB1dCk7XHJcbiAgICAgICAgICAgICAgICB3aW4ud2ViQ29udGVudHMub2ZmKCdiZWZvcmUtaW5wdXQtZXZlbnQnLCBjYW5jZWxCeUVzYyk7XHJcbiAgICAgICAgICAgICAgICB3aW4uY2xvc2UoKTtcclxuICAgICAgICAgICAgICAgIHdpbi5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgICAgICBpcGNNYWluLnJlbW92ZUFsbExpc3RlbmVycyhcImdldC1pbnB1dC1yZXN1bHRcIik7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKFwiXCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyDlsLHnu6rlkI7lsZXnpLpcclxuICAgICAgICAgICAgd2luLm9uY2UoJ3JlYWR5LXRvLXNob3cnLCAoKSA9PiB3aW4uc2hvdygpKTtcclxuICAgICAgICAgICAgLy8g5aSx54Sm5ZCO5YWz6ZetXHJcbiAgICAgICAgICAgIHdpbi5vbmNlKCdibHVyJywgY2FuY2VsSW5wdXQpO1xyXG4gICAgICAgICAgICAvLyDnm5HlkKxFU0PmjInplK5cclxuICAgICAgICAgICAgd2luLndlYkNvbnRlbnRzLm9uY2UoJ2JlZm9yZS1pbnB1dC1ldmVudCcsIGNhbmNlbEJ5RXNjKTtcclxuICAgIFxyXG4gICAgICAgICAgICBjb25zdCBmcCA9IGpvaW4oX19kaXJuYW1lLCAnLi4vc3RhdGljL2lucHV0L2luZGV4Lmh0bWwnKTtcclxuICAgICAgICAgICAgd2luLmxvYWRVUkwoYGZpbGU6Ly8ke2ZwfT9wcm9wPSR7cHJvcE5hbWV9YCk7XHJcblxyXG4gICAgICAgICAgICBpcGNNYWluLm9uY2UoXCJnZXQtaW5wdXQtcmVzdWx0XCIsIChldmVudCwgaW5wdXROYW1lKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB3aW4uY2xvc2UoKTtcclxuICAgICAgICAgICAgICAgIHdpbi5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKGlucHV0TmFtZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBlbiBIb29rcyB0cmlnZ2VyZWQgYWZ0ZXIgZXh0ZW5zaW9uIGxvYWRpbmcgaXMgY29tcGxldGVcclxuICogQHpoIOaJqeWxleWKoOi9veWujOaIkOWQjuinpuWPkeeahOmSqeWtkFxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGxvYWQoKSB7IH1cclxuXHJcbi8qKlxyXG4gKiBAZW4gSG9va3MgdHJpZ2dlcmVkIGFmdGVyIGV4dGVuc2lvbiB1bmluc3RhbGxhdGlvbiBpcyBjb21wbGV0ZVxyXG4gKiBAemgg5omp5bGV5Y246L295a6M5oiQ5ZCO6Kem5Y+R55qE6ZKp5a2QXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gdW5sb2FkKCkgeyB9XHJcbiJdfQ==