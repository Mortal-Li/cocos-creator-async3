"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const vue_1 = require("vue");
const KKCore_1 = __importDefault(require("../../core/KKCore"));
const package_json_1 = __importDefault(require("../../../package.json"));
const KKUtils_1 = __importDefault(require("../../core/KKUtils"));
const panelDataMap = new WeakMap();
/**
 * @zh 如果希望兼容 3.3 之前的版本可以使用下方的代码
 * @en You can add the code below if you want compatibility with versions prior to 3.3
 */
// Editor.Panel.define = Editor.Panel.define || function(options: any) { return options }
module.exports = Editor.Panel.define({
    listeners: {
        show() { console.log('show'); },
        hide() { console.log('hide'); },
    },
    template: (0, fs_extra_1.readFileSync)((0, path_1.join)(__dirname, '../../../static/template/default/index.html'), 'utf-8'),
    style: (0, fs_extra_1.readFileSync)((0, path_1.join)(__dirname, '../../../static/style/default/index.css'), 'utf-8'),
    $: {
        app: '#app',
    },
    methods: {},
    ready() {
        if (this.$.app) {
            const app = (0, vue_1.createApp)({
                data() {
                    return {
                        allBundles: [],
                        curIdx: 0,
                        projPrefix: "",
                        uiConfPath: "",
                        isConfPathExist: false,
                        initing: false,
                        newBundleName: "",
                        bundlePriority: 1,
                        newLayerName: "",
                        bundleChoice1: "",
                        cacheMode1: 0,
                        newPopupName: "",
                        bundleChoice2: "",
                        cacheMode2: 0,
                        newPanelName: "",
                        bundleChoice3: "",
                        cacheMode3: 0,
                        newWidgetName: "",
                        bundleChoice4: "",
                        cacheMode4: 0,
                        isCodeCounting: false,
                        codeInfo: {},
                        isResCounting: false,
                        extInfo: {}
                    };
                },
                methods: {
                    onSetPrefix(prefix) {
                        this.projPrefix = prefix.trim();
                        if (this.projPrefix.length > 0) {
                            Editor.Profile.setProject(package_json_1.default.name, "kk.prefix", this.projPrefix, "project");
                        }
                    },
                    onUnlockPrefix() {
                        this.projPrefix = "";
                    },
                    async onInitProj() {
                        if (this.projPrefix.length == 0) {
                            Editor.Dialog.warn("请先设置前缀!", {
                                buttons: ["OK"]
                            });
                            return;
                        }
                        this.initing = true;
                        await KKCore_1.default.doInitProjAsy(this.projPrefix);
                        this.initing = false;
                        this.isConfPathExist = true;
                    },
                    async onCreateBundle() {
                        if (!this.isConfPathExist) {
                            Editor.Dialog.warn("UI配置文件不存在!", {
                                buttons: ["OK"]
                            });
                            return;
                        }
                        this.newBundleName = this.newBundleName.trim();
                        if (this.newBundleName.length == 0)
                            return;
                        let bundleName = this.projPrefix + this.newBundleName + "Bundle";
                        let isOK = await KKCore_1.default.doCreateBundle(bundleName, this.bundlePriority);
                        if (isOK)
                            this.allBundles.push(bundleName);
                    },
                    onCreateLayer() {
                        this.newLayerName = this.newLayerName.trim();
                        if (this.newLayerName.length == 0)
                            return;
                        if (this.bundleChoice1.length == 0)
                            return;
                        KKCore_1.default.doCreateLayer(this.projPrefix + this.newLayerName + "Layer", this.bundleChoice1, this.cacheMode1);
                    },
                    onCreatePopup() {
                        this.newPopupName = this.newPopupName.trim();
                        if (this.newPopupName.length == 0)
                            return;
                        if (this.bundleChoice2.length == 0)
                            return;
                        KKCore_1.default.doCreatePopup(this.projPrefix + this.newPopupName + "Popup", this.bundleChoice2, this.cacheMode2);
                    },
                    onCreatePanel() {
                        this.newPanelName = this.newPanelName.trim();
                        if (this.newPanelName.length == 0)
                            return;
                        if (this.bundleChoice3.length == 0)
                            return;
                        KKCore_1.default.doCreatePanel(this.projPrefix + this.newPanelName + "Panel", this.bundleChoice3, this.cacheMode3);
                    },
                    onCreateWidget() {
                        this.newWidgetName = this.newWidgetName.trim();
                        if (this.newWidgetName.length == 0)
                            return;
                        if (this.bundleChoice4.length == 0)
                            return;
                        KKCore_1.default.doCreateWidget(this.projPrefix + this.newWidgetName + "Widget", this.bundleChoice4, this.cacheMode4);
                    },
                    onCodeCount() {
                        if (this.isResCounting)
                            return;
                        this.isCodeCounting = true;
                        let info = KKCore_1.default.getCodeCount();
                        this.codeInfo = {
                            time: (new Date()).toLocaleString(),
                            result: [
                                { name: "注释行数", num: info.comment },
                                { name: "空行数", num: info.space },
                                { name: "代码行数", num: info.code },
                                { name: "总行数", num: info.total },
                            ]
                        };
                        this.isCodeCounting = false;
                        Editor.Profile.setProject(package_json_1.default.name, "kk.codeInfo", JSON.stringify(this.codeInfo), "project");
                    },
                    onResCount() {
                        if (this.isCodeCounting)
                            return;
                        this.isResCounting = true;
                        this.extInfo = {
                            time: (new Date()).toLocaleString(),
                            result: KKCore_1.default.getResCount()
                        };
                        this.isResCounting = false;
                        Editor.Profile.setProject(package_json_1.default.name, "kk.extInfo", JSON.stringify(this.extInfo), "project");
                    }
                },
                async beforeMount() {
                    this.allBundles = KKCore_1.default.getBundles();
                    let kkConf = await Editor.Profile.getProject(package_json_1.default.name, "kk", "project");
                    if (kkConf === null || kkConf === void 0 ? void 0 : kkConf.prefix) {
                        this.projPrefix = kkConf.prefix;
                        this.uiConfPath = `assets/Boot/Scripts/${kkConf.prefix}GameUIConf.ts`;
                    }
                    if (this.uiConfPath.length > 0) {
                        KKUtils_1.default.url2pathAsy("db://" + this.uiConfPath).then((p) => {
                            if ((0, fs_extra_1.existsSync)(p)) {
                                this.isConfPathExist = true;
                                KKCore_1.default.projPrefix = kkConf.prefix;
                            }
                        });
                    }
                    if (kkConf === null || kkConf === void 0 ? void 0 : kkConf.codeInfo)
                        this.codeInfo = JSON.parse(kkConf.codeInfo);
                    if (kkConf === null || kkConf === void 0 ? void 0 : kkConf.extInfo)
                        this.extInfo = JSON.parse(kkConf.extInfo);
                }
            });
            app.config.compilerOptions.isCustomElement = (tag) => tag.startsWith('ui-');
            app.mount(this.$.app);
            panelDataMap.set(this, app);
        }
    },
    beforeClose() { },
    close() {
        const app = panelDataMap.get(this);
        if (app) {
            app.unmount();
        }
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zb3VyY2UvcGFuZWxzL2RlZmF1bHQvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSx1Q0FBb0Q7QUFDcEQsK0JBQTRCO0FBQzVCLDZCQUFxQztBQUNyQywrREFBdUM7QUFDdkMseUVBQWdEO0FBQ2hELGlFQUF5QztBQUN6QyxNQUFNLFlBQVksR0FBRyxJQUFJLE9BQU8sRUFBWSxDQUFDO0FBQzdDOzs7R0FHRztBQUNILHlGQUF5RjtBQUN6RixNQUFNLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDO0lBQ2pDLFNBQVMsRUFBRTtRQUNQLElBQUksS0FBSyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMvQixJQUFJLEtBQUssT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDbEM7SUFDRCxRQUFRLEVBQUUsSUFBQSx1QkFBWSxFQUFDLElBQUEsV0FBSSxFQUFDLFNBQVMsRUFBRSw2Q0FBNkMsQ0FBQyxFQUFFLE9BQU8sQ0FBQztJQUMvRixLQUFLLEVBQUUsSUFBQSx1QkFBWSxFQUFDLElBQUEsV0FBSSxFQUFDLFNBQVMsRUFBRSx5Q0FBeUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQztJQUN4RixDQUFDLEVBQUU7UUFDQyxHQUFHLEVBQUUsTUFBTTtLQUNkO0lBQ0QsT0FBTyxFQUFFLEVBRVI7SUFDRCxLQUFLO1FBQ0QsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQ2IsTUFBTSxHQUFHLEdBQUcsSUFBQSxlQUFTLEVBQUM7Z0JBQ2xCLElBQUk7b0JBQ0EsT0FBTzt3QkFDSCxVQUFVLEVBQUUsRUFBRTt3QkFDZCxNQUFNLEVBQUUsQ0FBQzt3QkFDVCxVQUFVLEVBQUUsRUFBRTt3QkFDZCxVQUFVLEVBQUUsRUFBRTt3QkFD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O0NBQ0osQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZXhpc3RzU3luYywgcmVhZEZpbGVTeW5jIH0gZnJvbSAnZnMtZXh0cmEnO1xyXG5pbXBvcnQgeyBqb2luIH0gZnJvbSAncGF0aCc7XHJcbmltcG9ydCB7IGNyZWF0ZUFwcCwgQXBwIH0gZnJvbSAndnVlJztcclxuaW1wb3J0IEtLQ29yZSBmcm9tICcuLi8uLi9jb3JlL0tLQ29yZSc7XHJcbmltcG9ydCBwYWNrYWdlSlNPTiBmcm9tICcuLi8uLi8uLi9wYWNrYWdlLmpzb24nO1xyXG5pbXBvcnQgS0tVdGlscyBmcm9tICcuLi8uLi9jb3JlL0tLVXRpbHMnO1xyXG5jb25zdCBwYW5lbERhdGFNYXAgPSBuZXcgV2Vha01hcDxhbnksIEFwcD4oKTtcclxuLyoqXHJcbiAqIEB6aCDlpoLmnpzluIzmnJvlhbzlrrkgMy4zIOS5i+WJjeeahOeJiOacrOWPr+S7peS9v+eUqOS4i+aWueeahOS7o+eggVxyXG4gKiBAZW4gWW91IGNhbiBhZGQgdGhlIGNvZGUgYmVsb3cgaWYgeW91IHdhbnQgY29tcGF0aWJpbGl0eSB3aXRoIHZlcnNpb25zIHByaW9yIHRvIDMuM1xyXG4gKi9cclxuLy8gRWRpdG9yLlBhbmVsLmRlZmluZSA9IEVkaXRvci5QYW5lbC5kZWZpbmUgfHwgZnVuY3Rpb24ob3B0aW9uczogYW55KSB7IHJldHVybiBvcHRpb25zIH1cclxubW9kdWxlLmV4cG9ydHMgPSBFZGl0b3IuUGFuZWwuZGVmaW5lKHtcclxuICAgIGxpc3RlbmVyczoge1xyXG4gICAgICAgIHNob3coKSB7IGNvbnNvbGUubG9nKCdzaG93Jyk7IH0sXHJcbiAgICAgICAgaGlkZSgpIHsgY29uc29sZS5sb2coJ2hpZGUnKTsgfSxcclxuICAgIH0sXHJcbiAgICB0ZW1wbGF0ZTogcmVhZEZpbGVTeW5jKGpvaW4oX19kaXJuYW1lLCAnLi4vLi4vLi4vc3RhdGljL3RlbXBsYXRlL2RlZmF1bHQvaW5kZXguaHRtbCcpLCAndXRmLTgnKSxcclxuICAgIHN0eWxlOiByZWFkRmlsZVN5bmMoam9pbihfX2Rpcm5hbWUsICcuLi8uLi8uLi9zdGF0aWMvc3R5bGUvZGVmYXVsdC9pbmRleC5jc3MnKSwgJ3V0Zi04JyksXHJcbiAgICAkOiB7XHJcbiAgICAgICAgYXBwOiAnI2FwcCcsXHJcbiAgICB9LFxyXG4gICAgbWV0aG9kczoge1xyXG5cclxuICAgIH0sXHJcbiAgICByZWFkeSgpIHtcclxuICAgICAgICBpZiAodGhpcy4kLmFwcCkge1xyXG4gICAgICAgICAgICBjb25zdCBhcHAgPSBjcmVhdGVBcHAoe1xyXG4gICAgICAgICAgICAgICAgZGF0YSgpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhbGxCdW5kbGVzOiBbXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3VySWR4OiAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9qUHJlZml4OiBcIlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB1aUNvbmZQYXRoOiBcIlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpc0NvbmZQYXRoRXhpc3Q6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbml0aW5nOiBmYWxzZSxcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld0J1bmRsZU5hbWU6IFwiXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1bmRsZVByaW9yaXR5OiAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdMYXllck5hbWU6IFwiXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1bmRsZUNob2ljZTE6IFwiXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhY2hlTW9kZTE6IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld1BvcHVwTmFtZTogXCJcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnVuZGxlQ2hvaWNlMjogXCJcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FjaGVNb2RlMjogMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3UGFuZWxOYW1lOiBcIlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBidW5kbGVDaG9pY2UzOiBcIlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWNoZU1vZGUzOiAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdXaWRnZXROYW1lOiBcIlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBidW5kbGVDaG9pY2U0OiBcIlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWNoZU1vZGU0OiAwLFxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaXNDb2RlQ291bnRpbmc6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2RlSW5mbzoge30sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzUmVzQ291bnRpbmc6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBleHRJbmZvOiB7fVxyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgbWV0aG9kczoge1xyXG4gICAgICAgICAgICAgICAgICAgIG9uU2V0UHJlZml4KHByZWZpeDogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJvalByZWZpeCA9IHByZWZpeC50cmltKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnByb2pQcmVmaXgubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgRWRpdG9yLlByb2ZpbGUuc2V0UHJvamVjdChwYWNrYWdlSlNPTi5uYW1lLCBcImtrLnByZWZpeFwiLCB0aGlzLnByb2pQcmVmaXgsIFwicHJvamVjdFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIG9uVW5sb2NrUHJlZml4KCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2pQcmVmaXggPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGFzeW5jIG9uSW5pdFByb2ooKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnByb2pQcmVmaXgubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEVkaXRvci5EaWFsb2cud2FybihcIuivt+WFiOiuvue9ruWJjee8gCFcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbnM6IFtcIk9LXCJdXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmluaXRpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCBLS0NvcmUuZG9Jbml0UHJvakFzeSh0aGlzLnByb2pQcmVmaXgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmluaXRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pc0NvbmZQYXRoRXhpc3QgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGFzeW5jIG9uQ3JlYXRlQnVuZGxlKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuaXNDb25mUGF0aEV4aXN0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBFZGl0b3IuRGlhbG9nLndhcm4oXCJVSemFjee9ruaWh+S7tuS4jeWtmOWcqCFcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbnM6IFtcIk9LXCJdXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXdCdW5kbGVOYW1lID0gdGhpcy5uZXdCdW5kbGVOYW1lLnRyaW0oKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMubmV3QnVuZGxlTmFtZS5sZW5ndGggPT0gMCkgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgYnVuZGxlTmFtZSA9IHRoaXMucHJvalByZWZpeCArIHRoaXMubmV3QnVuZGxlTmFtZSArIFwiQnVuZGxlXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBpc09LID0gYXdhaXQgS0tDb3JlLmRvQ3JlYXRlQnVuZGxlKGJ1bmRsZU5hbWUsIHRoaXMuYnVuZGxlUHJpb3JpdHkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXNPSykgdGhpcy5hbGxCdW5kbGVzLnB1c2goYnVuZGxlTmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgb25DcmVhdGVMYXllcigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXdMYXllck5hbWUgPSB0aGlzLm5ld0xheWVyTmFtZS50cmltKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLm5ld0xheWVyTmFtZS5sZW5ndGggPT0gMCkgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5idW5kbGVDaG9pY2UxLmxlbmd0aCA9PSAwKSByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEtLQ29yZS5kb0NyZWF0ZUxheWVyKHRoaXMucHJvalByZWZpeCArIHRoaXMubmV3TGF5ZXJOYW1lICsgXCJMYXllclwiLCB0aGlzLmJ1bmRsZUNob2ljZTEsIHRoaXMuY2FjaGVNb2RlMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgb25DcmVhdGVQb3B1cCgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXdQb3B1cE5hbWUgPSB0aGlzLm5ld1BvcHVwTmFtZS50cmltKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLm5ld1BvcHVwTmFtZS5sZW5ndGggPT0gMCkgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5idW5kbGVDaG9pY2UyLmxlbmd0aCA9PSAwKSByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEtLQ29yZS5kb0NyZWF0ZVBvcHVwKHRoaXMucHJvalByZWZpeCArIHRoaXMubmV3UG9wdXBOYW1lICsgXCJQb3B1cFwiLCB0aGlzLmJ1bmRsZUNob2ljZTIsIHRoaXMuY2FjaGVNb2RlMik7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgb25DcmVhdGVQYW5lbCgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXdQYW5lbE5hbWUgPSB0aGlzLm5ld1BhbmVsTmFtZS50cmltKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLm5ld1BhbmVsTmFtZS5sZW5ndGggPT0gMCkgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5idW5kbGVDaG9pY2UzLmxlbmd0aCA9PSAwKSByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEtLQ29yZS5kb0NyZWF0ZVBhbmVsKHRoaXMucHJvalByZWZpeCArIHRoaXMubmV3UGFuZWxOYW1lICsgXCJQYW5lbFwiLCB0aGlzLmJ1bmRsZUNob2ljZTMsIHRoaXMuY2FjaGVNb2RlMyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgb25DcmVhdGVXaWRnZXQoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubmV3V2lkZ2V0TmFtZSA9IHRoaXMubmV3V2lkZ2V0TmFtZS50cmltKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLm5ld1dpZGdldE5hbWUubGVuZ3RoID09IDApIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuYnVuZGxlQ2hvaWNlNC5sZW5ndGggPT0gMCkgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBLS0NvcmUuZG9DcmVhdGVXaWRnZXQodGhpcy5wcm9qUHJlZml4ICsgdGhpcy5uZXdXaWRnZXROYW1lICsgXCJXaWRnZXRcIiwgdGhpcy5idW5kbGVDaG9pY2U0LCB0aGlzLmNhY2hlTW9kZTQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIG9uQ29kZUNvdW50KCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5pc1Jlc0NvdW50aW5nKSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmlzQ29kZUNvdW50aW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGluZm8gPSBLS0NvcmUuZ2V0Q29kZUNvdW50KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29kZUluZm8gPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aW1lOiAobmV3IERhdGUoKSkudG9Mb2NhbGVTdHJpbmcoKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdDogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgbmFtZTogXCLms6jph4rooYzmlbBcIiwgbnVtOiBpbmZvLmNvbW1lbnQgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IG5hbWU6IFwi56m66KGM5pWwXCIsIG51bTogaW5mby5zcGFjZSB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgbmFtZTogXCLku6PnoIHooYzmlbBcIiwgbnVtOiBpbmZvLmNvZGUgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IG5hbWU6IFwi5oC76KGM5pWwXCIsIG51bTogaW5mby50b3RhbCB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmlzQ29kZUNvdW50aW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEVkaXRvci5Qcm9maWxlLnNldFByb2plY3QocGFja2FnZUpTT04ubmFtZSwgXCJray5jb2RlSW5mb1wiLCBKU09OLnN0cmluZ2lmeSh0aGlzLmNvZGVJbmZvKSwgXCJwcm9qZWN0XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIG9uUmVzQ291bnQoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzQ29kZUNvdW50aW5nKSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmlzUmVzQ291bnRpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmV4dEluZm8gPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aW1lOiAobmV3IERhdGUoKSkudG9Mb2NhbGVTdHJpbmcoKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdDogS0tDb3JlLmdldFJlc0NvdW50KClcclxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pc1Jlc0NvdW50aW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEVkaXRvci5Qcm9maWxlLnNldFByb2plY3QocGFja2FnZUpTT04ubmFtZSwgXCJray5leHRJbmZvXCIsIEpTT04uc3RyaW5naWZ5KHRoaXMuZXh0SW5mbyksIFwicHJvamVjdFwiKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgYXN5bmMgYmVmb3JlTW91bnQoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hbGxCdW5kbGVzID0gS0tDb3JlLmdldEJ1bmRsZXMoKTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQga2tDb25mID0gYXdhaXQgRWRpdG9yLlByb2ZpbGUuZ2V0UHJvamVjdChwYWNrYWdlSlNPTi5uYW1lLCBcImtrXCIsIFwicHJvamVjdFwiKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoa2tDb25mPy5wcmVmaXgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9qUHJlZml4ID0ga2tDb25mLnByZWZpeDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy51aUNvbmZQYXRoID0gYGFzc2V0cy9Cb290L1NjcmlwdHMvJHtra0NvbmYucHJlZml4fUdhbWVVSUNvbmYudHNgO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMudWlDb25mUGF0aC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEtLVXRpbHMudXJsMnBhdGhBc3koXCJkYjovL1wiICsgdGhpcy51aUNvbmZQYXRoKS50aGVuKChwKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXhpc3RzU3luYyhwKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaXNDb25mUGF0aEV4aXN0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBLS0NvcmUucHJvalByZWZpeCA9IGtrQ29uZi5wcmVmaXg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGtrQ29uZj8uY29kZUluZm8pIHRoaXMuY29kZUluZm8gPSBKU09OLnBhcnNlKGtrQ29uZi5jb2RlSW5mbyk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGtrQ29uZj8uZXh0SW5mbykgdGhpcy5leHRJbmZvID0gSlNPTi5wYXJzZShra0NvbmYuZXh0SW5mbyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBhcHAuY29uZmlnLmNvbXBpbGVyT3B0aW9ucy5pc0N1c3RvbUVsZW1lbnQgPSAodGFnKSA9PiB0YWcuc3RhcnRzV2l0aCgndWktJyk7XHJcbiAgICAgICAgICAgIGFwcC5tb3VudCh0aGlzLiQuYXBwKTtcclxuICAgICAgICAgICAgcGFuZWxEYXRhTWFwLnNldCh0aGlzLCBhcHApO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBiZWZvcmVDbG9zZSgpIHsgfSxcclxuICAgIGNsb3NlKCkge1xyXG4gICAgICAgIGNvbnN0IGFwcCA9IHBhbmVsRGF0YU1hcC5nZXQodGhpcyk7XHJcbiAgICAgICAgaWYgKGFwcCkge1xyXG4gICAgICAgICAgICBhcHAudW5tb3VudCgpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbn0pO1xyXG4iXX0=