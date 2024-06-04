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
                        isWhichCreating: -1,
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
                        if (this.isWhichCreating >= 0)
                            return;
                        if (!this.isConfPathExist) {
                            Editor.Dialog.warn("UI配置文件不存在!", {
                                buttons: ["OK"]
                            });
                            return;
                        }
                        this.newBundleName = this.newBundleName.trim();
                        if (this.newBundleName.length == 0)
                            return;
                        this.isWhichCreating = 0;
                        let bundleName = this.projPrefix + this.newBundleName + "Bundle";
                        let isOK = await KKCore_1.default.doCreateBundle(bundleName, this.bundlePriority);
                        if (isOK)
                            this.allBundles.push(bundleName);
                        this.isWhichCreating = -1;
                    },
                    onCreateLayer() {
                        if (this.isWhichCreating >= 0)
                            return;
                        this.newLayerName = this.newLayerName.trim();
                        if (this.newLayerName.length == 0)
                            return;
                        if (this.bundleChoice1.length == 0)
                            return;
                        this.isWhichCreating = 1;
                        KKCore_1.default.doCreateLayer(this.projPrefix + this.newLayerName + "Layer", this.bundleChoice1, this.cacheMode1).then(() => {
                            this.isWhichCreating = -1;
                        });
                    },
                    onCreatePopup() {
                        if (this.isWhichCreating >= 0)
                            return;
                        this.newPopupName = this.newPopupName.trim();
                        if (this.newPopupName.length == 0)
                            return;
                        if (this.bundleChoice2.length == 0)
                            return;
                        this.isWhichCreating = 2;
                        KKCore_1.default.doCreatePopup(this.projPrefix + this.newPopupName + "Popup", this.bundleChoice2, this.cacheMode2).then(() => {
                            this.isWhichCreating = -1;
                        });
                    },
                    onCreatePanel() {
                        this.newPanelName = this.newPanelName.trim();
                        if (this.newPanelName.length == 0)
                            return;
                        if (this.bundleChoice3.length == 0)
                            return;
                        this.isWhichCreating = 3;
                        KKCore_1.default.doCreatePanel(this.projPrefix + this.newPanelName + "Panel", this.bundleChoice3, this.cacheMode3).then(() => {
                            this.isWhichCreating = -1;
                        });
                    },
                    onCreateWidget() {
                        this.newWidgetName = this.newWidgetName.trim();
                        if (this.newWidgetName.length == 0)
                            return;
                        if (this.bundleChoice4.length == 0)
                            return;
                        this.isWhichCreating = 4;
                        KKCore_1.default.doCreateWidget(this.projPrefix + this.newWidgetName + "Widget", this.bundleChoice4, this.cacheMode4).then(() => {
                            this.isWhichCreating = -1;
                        });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zb3VyY2UvcGFuZWxzL2RlZmF1bHQvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSx1Q0FBb0Q7QUFDcEQsK0JBQTRCO0FBQzVCLDZCQUFxQztBQUNyQywrREFBdUM7QUFDdkMseUVBQWdEO0FBQ2hELGlFQUF5QztBQUN6QyxNQUFNLFlBQVksR0FBRyxJQUFJLE9BQU8sRUFBWSxDQUFDO0FBQzdDOzs7R0FHRztBQUNILHlGQUF5RjtBQUN6RixNQUFNLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDO0lBQ2pDLFNBQVMsRUFBRTtRQUNQLElBQUksS0FBSyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMvQixJQUFJLEtBQUssT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDbEM7SUFDRCxRQUFRLEVBQUUsSUFBQSx1QkFBWSxFQUFDLElBQUEsV0FBSSxFQUFDLFNBQVMsRUFBRSw2Q0FBNkMsQ0FBQyxFQUFFLE9BQU8sQ0FBQztJQUMvRixLQUFLLEVBQUUsSUFBQSx1QkFBWSxFQUFDLElBQUEsV0FBSSxFQUFDLFNBQVMsRUFBRSx5Q0FBeUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQztJQUN4RixDQUFDLEVBQUU7UUFDQyxHQUFHLEVBQUUsTUFBTTtLQUNkO0lBQ0QsT0FBTyxFQUFFLEVBRVI7SUFDRCxLQUFLO1FBQ0QsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQ2IsTUFBTSxHQUFHLEdBQUcsSUFBQSxlQUFTLEVBQUM7Z0JBQ2xCLElBQUk7b0JBQ0EsT0FBTzt3QkFDSCxVQUFVLEVBQUUsRUFBRTt3QkFDZCxNQUFNLEVBQUUsQ0FBQzt3QkFDVCxVQUFVLEVBQUUsRUFBRTt3QkFDZCxVQUFVLEVBQUUsRUFBRTt3QkFD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RyxNQUFNLENBQUMsTUFBTSxDQUFDOzRCQUN0QyxDQUFDO3dCQUNMLENBQUMsQ0FBQyxDQUFDO29CQUNQLENBQUM7b0JBRUQsSUFBSSxNQUFNLGFBQU4sTUFBTSx1QkFBTixNQUFNLENBQUUsUUFBUTt3QkFBRSxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUNsRSxJQUFJLE1BQU0sYUFBTixNQUFNLHVCQUFOLE1BQU0sQ0FBRSxPQUFPO3dCQUFFLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQ25FLENBQUM7YUFDSixDQUFDLENBQUM7WUFDSCxHQUFHLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxlQUFlLEdBQUcsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDNUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3RCLFlBQVksQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ2hDLENBQUM7SUFDTCxDQUFDO0lBQ0QsV0FBVyxLQUFLLENBQUM7SUFDakIsS0FBSztRQUNELE1BQU0sR0FBRyxHQUFHLFlBQVksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbkMsSUFBSSxHQUFHLEVBQUUsQ0FBQztZQUNOLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNsQixDQUFDO0lBQ0wsQ0FBQztDQUNKLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGV4aXN0c1N5bmMsIHJlYWRGaWxlU3luYyB9IGZyb20gJ2ZzLWV4dHJhJztcclxuaW1wb3J0IHsgam9pbiB9IGZyb20gJ3BhdGgnO1xyXG5pbXBvcnQgeyBjcmVhdGVBcHAsIEFwcCB9IGZyb20gJ3Z1ZSc7XHJcbmltcG9ydCBLS0NvcmUgZnJvbSAnLi4vLi4vY29yZS9LS0NvcmUnO1xyXG5pbXBvcnQgcGFja2FnZUpTT04gZnJvbSAnLi4vLi4vLi4vcGFja2FnZS5qc29uJztcclxuaW1wb3J0IEtLVXRpbHMgZnJvbSAnLi4vLi4vY29yZS9LS1V0aWxzJztcclxuY29uc3QgcGFuZWxEYXRhTWFwID0gbmV3IFdlYWtNYXA8YW55LCBBcHA+KCk7XHJcbi8qKlxyXG4gKiBAemgg5aaC5p6c5biM5pyb5YW85a65IDMuMyDkuYvliY3nmoTniYjmnKzlj6/ku6Xkvb/nlKjkuIvmlrnnmoTku6PnoIFcclxuICogQGVuIFlvdSBjYW4gYWRkIHRoZSBjb2RlIGJlbG93IGlmIHlvdSB3YW50IGNvbXBhdGliaWxpdHkgd2l0aCB2ZXJzaW9ucyBwcmlvciB0byAzLjNcclxuICovXHJcbi8vIEVkaXRvci5QYW5lbC5kZWZpbmUgPSBFZGl0b3IuUGFuZWwuZGVmaW5lIHx8IGZ1bmN0aW9uKG9wdGlvbnM6IGFueSkgeyByZXR1cm4gb3B0aW9ucyB9XHJcbm1vZHVsZS5leHBvcnRzID0gRWRpdG9yLlBhbmVsLmRlZmluZSh7XHJcbiAgICBsaXN0ZW5lcnM6IHtcclxuICAgICAgICBzaG93KCkgeyBjb25zb2xlLmxvZygnc2hvdycpOyB9LFxyXG4gICAgICAgIGhpZGUoKSB7IGNvbnNvbGUubG9nKCdoaWRlJyk7IH0sXHJcbiAgICB9LFxyXG4gICAgdGVtcGxhdGU6IHJlYWRGaWxlU3luYyhqb2luKF9fZGlybmFtZSwgJy4uLy4uLy4uL3N0YXRpYy90ZW1wbGF0ZS9kZWZhdWx0L2luZGV4Lmh0bWwnKSwgJ3V0Zi04JyksXHJcbiAgICBzdHlsZTogcmVhZEZpbGVTeW5jKGpvaW4oX19kaXJuYW1lLCAnLi4vLi4vLi4vc3RhdGljL3N0eWxlL2RlZmF1bHQvaW5kZXguY3NzJyksICd1dGYtOCcpLFxyXG4gICAgJDoge1xyXG4gICAgICAgIGFwcDogJyNhcHAnLFxyXG4gICAgfSxcclxuICAgIG1ldGhvZHM6IHtcclxuXHJcbiAgICB9LFxyXG4gICAgcmVhZHkoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuJC5hcHApIHtcclxuICAgICAgICAgICAgY29uc3QgYXBwID0gY3JlYXRlQXBwKHtcclxuICAgICAgICAgICAgICAgIGRhdGEoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWxsQnVuZGxlczogW10sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cklkeDogMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvalByZWZpeDogXCJcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgdWlDb25mUGF0aDogXCJcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXNDb25mUGF0aEV4aXN0OiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW5pdGluZzogZmFsc2UsXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpc1doaWNoQ3JlYXRpbmc6IC0xLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdCdW5kbGVOYW1lOiBcIlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBidW5kbGVQcmlvcml0eTogMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3TGF5ZXJOYW1lOiBcIlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBidW5kbGVDaG9pY2UxOiBcIlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWNoZU1vZGUxOiAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdQb3B1cE5hbWU6IFwiXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1bmRsZUNob2ljZTI6IFwiXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhY2hlTW9kZTI6IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld1BhbmVsTmFtZTogXCJcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnVuZGxlQ2hvaWNlMzogXCJcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FjaGVNb2RlMzogMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3V2lkZ2V0TmFtZTogXCJcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnVuZGxlQ2hvaWNlNDogXCJcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FjaGVNb2RlNDogMCxcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzQ29kZUNvdW50aW5nOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29kZUluZm86IHt9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpc1Jlc0NvdW50aW5nOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXh0SW5mbzoge31cclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIG1ldGhvZHM6IHtcclxuICAgICAgICAgICAgICAgICAgICBvblNldFByZWZpeChwcmVmaXg6IHN0cmluZykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2pQcmVmaXggPSBwcmVmaXgudHJpbSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5wcm9qUHJlZml4Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEVkaXRvci5Qcm9maWxlLnNldFByb2plY3QocGFja2FnZUpTT04ubmFtZSwgXCJray5wcmVmaXhcIiwgdGhpcy5wcm9qUHJlZml4LCBcInByb2plY3RcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgICAgICBvblVubG9ja1ByZWZpeCgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9qUHJlZml4ID0gXCJcIjtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgICAgICBhc3luYyBvbkluaXRQcm9qKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5wcm9qUHJlZml4Lmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBFZGl0b3IuRGlhbG9nLndhcm4oXCLor7flhYjorr7nva7liY3nvIAhXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBidXR0b25zOiBbXCJPS1wiXVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbml0aW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgS0tDb3JlLmRvSW5pdFByb2pBc3kodGhpcy5wcm9qUHJlZml4KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbml0aW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaXNDb25mUGF0aEV4aXN0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgICAgICBhc3luYyBvbkNyZWF0ZUJ1bmRsZSgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNXaGljaENyZWF0aW5nID49IDApIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLmlzQ29uZlBhdGhFeGlzdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgRWRpdG9yLkRpYWxvZy53YXJuKFwiVUnphY3nva7mlofku7bkuI3lrZjlnKghXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBidXR0b25zOiBbXCJPS1wiXVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubmV3QnVuZGxlTmFtZSA9IHRoaXMubmV3QnVuZGxlTmFtZS50cmltKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLm5ld0J1bmRsZU5hbWUubGVuZ3RoID09IDApIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pc1doaWNoQ3JlYXRpbmcgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgYnVuZGxlTmFtZSA9IHRoaXMucHJvalByZWZpeCArIHRoaXMubmV3QnVuZGxlTmFtZSArIFwiQnVuZGxlXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBpc09LID0gYXdhaXQgS0tDb3JlLmRvQ3JlYXRlQnVuZGxlKGJ1bmRsZU5hbWUsIHRoaXMuYnVuZGxlUHJpb3JpdHkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXNPSykgdGhpcy5hbGxCdW5kbGVzLnB1c2goYnVuZGxlTmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaXNXaGljaENyZWF0aW5nID0gLTE7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgb25DcmVhdGVMYXllcigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNXaGljaENyZWF0aW5nID49IDApIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXdMYXllck5hbWUgPSB0aGlzLm5ld0xheWVyTmFtZS50cmltKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLm5ld0xheWVyTmFtZS5sZW5ndGggPT0gMCkgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5idW5kbGVDaG9pY2UxLmxlbmd0aCA9PSAwKSByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaXNXaGljaENyZWF0aW5nID0gMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgS0tDb3JlLmRvQ3JlYXRlTGF5ZXIodGhpcy5wcm9qUHJlZml4ICsgdGhpcy5uZXdMYXllck5hbWUgKyBcIkxheWVyXCIsIHRoaXMuYnVuZGxlQ2hvaWNlMSwgdGhpcy5jYWNoZU1vZGUxKS50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaXNXaGljaENyZWF0aW5nID0gLTE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIG9uQ3JlYXRlUG9wdXAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzV2hpY2hDcmVhdGluZyA+PSAwKSByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubmV3UG9wdXBOYW1lID0gdGhpcy5uZXdQb3B1cE5hbWUudHJpbSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5uZXdQb3B1cE5hbWUubGVuZ3RoID09IDApIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuYnVuZGxlQ2hvaWNlMi5sZW5ndGggPT0gMCkgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmlzV2hpY2hDcmVhdGluZyA9IDI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEtLQ29yZS5kb0NyZWF0ZVBvcHVwKHRoaXMucHJvalByZWZpeCArIHRoaXMubmV3UG9wdXBOYW1lICsgXCJQb3B1cFwiLCB0aGlzLmJ1bmRsZUNob2ljZTIsIHRoaXMuY2FjaGVNb2RlMikudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmlzV2hpY2hDcmVhdGluZyA9IC0xO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgICAgICBvbkNyZWF0ZVBhbmVsKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5ld1BhbmVsTmFtZSA9IHRoaXMubmV3UGFuZWxOYW1lLnRyaW0oKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMubmV3UGFuZWxOYW1lLmxlbmd0aCA9PSAwKSByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmJ1bmRsZUNob2ljZTMubGVuZ3RoID09IDApIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pc1doaWNoQ3JlYXRpbmcgPSAzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBLS0NvcmUuZG9DcmVhdGVQYW5lbCh0aGlzLnByb2pQcmVmaXggKyB0aGlzLm5ld1BhbmVsTmFtZSArIFwiUGFuZWxcIiwgdGhpcy5idW5kbGVDaG9pY2UzLCB0aGlzLmNhY2hlTW9kZTMpLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pc1doaWNoQ3JlYXRpbmcgPSAtMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgb25DcmVhdGVXaWRnZXQoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubmV3V2lkZ2V0TmFtZSA9IHRoaXMubmV3V2lkZ2V0TmFtZS50cmltKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLm5ld1dpZGdldE5hbWUubGVuZ3RoID09IDApIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuYnVuZGxlQ2hvaWNlNC5sZW5ndGggPT0gMCkgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmlzV2hpY2hDcmVhdGluZyA9IDQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEtLQ29yZS5kb0NyZWF0ZVdpZGdldCh0aGlzLnByb2pQcmVmaXggKyB0aGlzLm5ld1dpZGdldE5hbWUgKyBcIldpZGdldFwiLCB0aGlzLmJ1bmRsZUNob2ljZTQsIHRoaXMuY2FjaGVNb2RlNCkudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmlzV2hpY2hDcmVhdGluZyA9IC0xO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgICAgICBvbkNvZGVDb3VudCgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNSZXNDb3VudGluZykgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pc0NvZGVDb3VudGluZyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBpbmZvID0gS0tDb3JlLmdldENvZGVDb3VudCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvZGVJbmZvID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGltZTogKG5ldyBEYXRlKCkpLnRvTG9jYWxlU3RyaW5nKCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQ6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IG5hbWU6IFwi5rOo6YeK6KGM5pWwXCIsIG51bTogaW5mby5jb21tZW50IH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBuYW1lOiBcIuepuuihjOaVsFwiLCBudW06IGluZm8uc3BhY2UgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IG5hbWU6IFwi5Luj56CB6KGM5pWwXCIsIG51bTogaW5mby5jb2RlIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBuYW1lOiBcIuaAu+ihjOaVsFwiLCBudW06IGluZm8udG90YWwgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pc0NvZGVDb3VudGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBFZGl0b3IuUHJvZmlsZS5zZXRQcm9qZWN0KHBhY2thZ2VKU09OLm5hbWUsIFwia2suY29kZUluZm9cIiwgSlNPTi5zdHJpbmdpZnkodGhpcy5jb2RlSW5mbyksIFwicHJvamVjdFwiKTtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgICAgICBvblJlc0NvdW50KCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5pc0NvZGVDb3VudGluZykgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pc1Jlc0NvdW50aW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5leHRJbmZvID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGltZTogKG5ldyBEYXRlKCkpLnRvTG9jYWxlU3RyaW5nKCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQ6IEtLQ29yZS5nZXRSZXNDb3VudCgpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaXNSZXNDb3VudGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBFZGl0b3IuUHJvZmlsZS5zZXRQcm9qZWN0KHBhY2thZ2VKU09OLm5hbWUsIFwia2suZXh0SW5mb1wiLCBKU09OLnN0cmluZ2lmeSh0aGlzLmV4dEluZm8pLCBcInByb2plY3RcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGFzeW5jIGJlZm9yZU1vdW50KCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWxsQnVuZGxlcyA9IEtLQ29yZS5nZXRCdW5kbGVzKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGtrQ29uZiA9IGF3YWl0IEVkaXRvci5Qcm9maWxlLmdldFByb2plY3QocGFja2FnZUpTT04ubmFtZSwgXCJra1wiLCBcInByb2plY3RcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGtrQ29uZj8ucHJlZml4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJvalByZWZpeCA9IGtrQ29uZi5wcmVmaXg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudWlDb25mUGF0aCA9IGBhc3NldHMvQm9vdC9TY3JpcHRzLyR7a2tDb25mLnByZWZpeH1HYW1lVUlDb25mLnRzYDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnVpQ29uZlBhdGgubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBLS1V0aWxzLnVybDJwYXRoQXN5KFwiZGI6Ly9cIiArIHRoaXMudWlDb25mUGF0aCkudGhlbigocCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGV4aXN0c1N5bmMocCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmlzQ29uZlBhdGhFeGlzdCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgS0tDb3JlLnByb2pQcmVmaXggPSBra0NvbmYucHJlZml4O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChra0NvbmY/LmNvZGVJbmZvKSB0aGlzLmNvZGVJbmZvID0gSlNPTi5wYXJzZShra0NvbmYuY29kZUluZm8pO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChra0NvbmY/LmV4dEluZm8pIHRoaXMuZXh0SW5mbyA9IEpTT04ucGFyc2Uoa2tDb25mLmV4dEluZm8pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgYXBwLmNvbmZpZy5jb21waWxlck9wdGlvbnMuaXNDdXN0b21FbGVtZW50ID0gKHRhZykgPT4gdGFnLnN0YXJ0c1dpdGgoJ3VpLScpO1xyXG4gICAgICAgICAgICBhcHAubW91bnQodGhpcy4kLmFwcCk7XHJcbiAgICAgICAgICAgIHBhbmVsRGF0YU1hcC5zZXQodGhpcywgYXBwKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgYmVmb3JlQ2xvc2UoKSB7IH0sXHJcbiAgICBjbG9zZSgpIHtcclxuICAgICAgICBjb25zdCBhcHAgPSBwYW5lbERhdGFNYXAuZ2V0KHRoaXMpO1xyXG4gICAgICAgIGlmIChhcHApIHtcclxuICAgICAgICAgICAgYXBwLnVubW91bnQoKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG59KTtcclxuIl19