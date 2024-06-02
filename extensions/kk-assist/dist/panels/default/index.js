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
                        newPopupName: "",
                        bundleChoice2: "",
                        newPanelName: "",
                        bundleChoice3: "",
                        newWidgetName: "",
                        bundleChoice4: "",
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
                        KKCore_1.default.doCreateLayer(this.projPrefix + this.newLayerName + "Layer", this.bundleChoice1);
                    },
                    onCreatePopup() {
                        this.newPopupName = this.newPopupName.trim();
                        if (this.newPopupName.length == 0)
                            return;
                        if (this.bundleChoice2.length == 0)
                            return;
                        KKCore_1.default.doCreatePopup(this.projPrefix + this.newPopupName + "Popup", this.bundleChoice2);
                    },
                    onCreatePanel() {
                        this.newPanelName = this.newPanelName.trim();
                        if (this.newPanelName.length == 0)
                            return;
                        if (this.bundleChoice3.length == 0)
                            return;
                        KKCore_1.default.doCreatePanel(this.projPrefix + this.newPanelName + "Panel", this.bundleChoice3);
                    },
                    onCreateWidget() {
                        this.newWidgetName = this.newWidgetName.trim();
                        if (this.newWidgetName.length == 0)
                            return;
                        if (this.bundleChoice4.length == 0)
                            return;
                        KKCore_1.default.doCreateWidget(this.projPrefix + this.newWidgetName + "Widget", this.bundleChoice4);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zb3VyY2UvcGFuZWxzL2RlZmF1bHQvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSx1Q0FBb0Q7QUFDcEQsK0JBQTRCO0FBQzVCLDZCQUFxQztBQUNyQywrREFBdUM7QUFDdkMseUVBQWdEO0FBQ2hELGlFQUF5QztBQUN6QyxNQUFNLFlBQVksR0FBRyxJQUFJLE9BQU8sRUFBWSxDQUFDO0FBQzdDOzs7R0FHRztBQUNILHlGQUF5RjtBQUN6RixNQUFNLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDO0lBQ2pDLFNBQVMsRUFBRTtRQUNQLElBQUksS0FBSyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMvQixJQUFJLEtBQUssT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDbEM7SUFDRCxRQUFRLEVBQUUsSUFBQSx1QkFBWSxFQUFDLElBQUEsV0FBSSxFQUFDLFNBQVMsRUFBRSw2Q0FBNkMsQ0FBQyxFQUFFLE9BQU8sQ0FBQztJQUMvRixLQUFLLEVBQUUsSUFBQSx1QkFBWSxFQUFDLElBQUEsV0FBSSxFQUFDLFNBQVMsRUFBRSx5Q0FBeUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQztJQUN4RixDQUFDLEVBQUU7UUFDQyxHQUFHLEVBQUUsTUFBTTtLQUNkO0lBQ0QsT0FBTyxFQUFFLEVBRVI7SUFDRCxLQUFLO1FBQ0QsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQ2IsTUFBTSxHQUFHLEdBQUcsSUFBQSxlQUFTLEVBQUM7Z0JBQ2xCLElBQUk7b0JBQ0EsT0FBTzt3QkFDSCxVQUFVLEVBQUUsRUFBRTt3QkFDZCxNQUFNLEVBQUUsQ0FBQzt3QkFDVCxVQUFVLEVBQUUsRUFBRTt3QkFDZCxVQUFVLEVBQUUsRUFBRTt3QkFD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M0MsZ0JBQU0sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsWUFBWSxHQUFHLE9BQU8sRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7b0JBQzVGLENBQUM7b0JBRUQsYUFBYTt3QkFDVCxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLENBQUM7d0JBQzdDLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLElBQUksQ0FBQzs0QkFBRSxPQUFPO3dCQUMxQyxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxJQUFJLENBQUM7NEJBQUUsT0FBTzt3QkFDM0MsZ0JBQU0sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsWUFBWSxHQUFHLE9BQU8sRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7b0JBQzVGLENBQUM7b0JBRUQsYUFBYTt3QkFDVCxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLENBQUM7d0JBQzdDLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLElBQUksQ0FBQzs0QkFBRSxPQUFPO3dCQUMxQyxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxJQUFJLENBQUM7NEJBQUUsT0FBTzt3QkFDM0MsZ0JBQU0sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsWUFBWSxHQUFHLE9BQU8sRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7b0JBQzVGLENBQUM7b0JBRUQsY0FBYzt3QkFDVixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLENBQUM7d0JBQy9DLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLElBQUksQ0FBQzs0QkFBRSxPQUFPO3dCQUMzQyxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxJQUFJLENBQUM7NEJBQUUs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QVUsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDOzRCQUN0QyxDQUFDO3dCQUNMLENBQUMsQ0FBQyxDQUFDO29CQUNQLENBQUM7b0JBRUQsSUFBSSxNQUFNLGFBQU4sTUFBTSx1QkFBTixNQUFNLENBQUUsUUFBUTt3QkFBRSxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUNsRSxJQUFJLE1BQU0sYUFBTixNQUFNLHVCQUFOLE1BQU0sQ0FBRSxPQUFPO3dCQUFFLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQ25FLENBQUM7YUFDSixDQUFDLENBQUM7WUFDSCxHQUFHLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxlQUFlLEdBQUcsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDNUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3RCLFlBQVksQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ2hDLENBQUM7SUFDTCxDQUFDO0lBQ0QsV0FBVyxLQUFLLENBQUM7SUFDakIsS0FBSztRQUNELE1BQU0sR0FBRyxHQUFHLFlBQVksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbkMsSUFBSSxHQUFHLEVBQUUsQ0FBQztZQUNOLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNsQixDQUFDO0lBQ0wsQ0FBQztDQUNKLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGV4aXN0c1N5bmMsIHJlYWRGaWxlU3luYyB9IGZyb20gJ2ZzLWV4dHJhJztcclxuaW1wb3J0IHsgam9pbiB9IGZyb20gJ3BhdGgnO1xyXG5pbXBvcnQgeyBjcmVhdGVBcHAsIEFwcCB9IGZyb20gJ3Z1ZSc7XHJcbmltcG9ydCBLS0NvcmUgZnJvbSAnLi4vLi4vY29yZS9LS0NvcmUnO1xyXG5pbXBvcnQgcGFja2FnZUpTT04gZnJvbSAnLi4vLi4vLi4vcGFja2FnZS5qc29uJztcclxuaW1wb3J0IEtLVXRpbHMgZnJvbSAnLi4vLi4vY29yZS9LS1V0aWxzJztcclxuY29uc3QgcGFuZWxEYXRhTWFwID0gbmV3IFdlYWtNYXA8YW55LCBBcHA+KCk7XHJcbi8qKlxyXG4gKiBAemgg5aaC5p6c5biM5pyb5YW85a65IDMuMyDkuYvliY3nmoTniYjmnKzlj6/ku6Xkvb/nlKjkuIvmlrnnmoTku6PnoIFcclxuICogQGVuIFlvdSBjYW4gYWRkIHRoZSBjb2RlIGJlbG93IGlmIHlvdSB3YW50IGNvbXBhdGliaWxpdHkgd2l0aCB2ZXJzaW9ucyBwcmlvciB0byAzLjNcclxuICovXHJcbi8vIEVkaXRvci5QYW5lbC5kZWZpbmUgPSBFZGl0b3IuUGFuZWwuZGVmaW5lIHx8IGZ1bmN0aW9uKG9wdGlvbnM6IGFueSkgeyByZXR1cm4gb3B0aW9ucyB9XHJcbm1vZHVsZS5leHBvcnRzID0gRWRpdG9yLlBhbmVsLmRlZmluZSh7XHJcbiAgICBsaXN0ZW5lcnM6IHtcclxuICAgICAgICBzaG93KCkgeyBjb25zb2xlLmxvZygnc2hvdycpOyB9LFxyXG4gICAgICAgIGhpZGUoKSB7IGNvbnNvbGUubG9nKCdoaWRlJyk7IH0sXHJcbiAgICB9LFxyXG4gICAgdGVtcGxhdGU6IHJlYWRGaWxlU3luYyhqb2luKF9fZGlybmFtZSwgJy4uLy4uLy4uL3N0YXRpYy90ZW1wbGF0ZS9kZWZhdWx0L2luZGV4Lmh0bWwnKSwgJ3V0Zi04JyksXHJcbiAgICBzdHlsZTogcmVhZEZpbGVTeW5jKGpvaW4oX19kaXJuYW1lLCAnLi4vLi4vLi4vc3RhdGljL3N0eWxlL2RlZmF1bHQvaW5kZXguY3NzJyksICd1dGYtOCcpLFxyXG4gICAgJDoge1xyXG4gICAgICAgIGFwcDogJyNhcHAnLFxyXG4gICAgfSxcclxuICAgIG1ldGhvZHM6IHtcclxuXHJcbiAgICB9LFxyXG4gICAgcmVhZHkoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuJC5hcHApIHtcclxuICAgICAgICAgICAgY29uc3QgYXBwID0gY3JlYXRlQXBwKHtcclxuICAgICAgICAgICAgICAgIGRhdGEoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWxsQnVuZGxlczogW10sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cklkeDogMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvalByZWZpeDogXCJcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgdWlDb25mUGF0aDogXCJcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXNDb25mUGF0aEV4aXN0OiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW5pdGluZzogZmFsc2UsXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdCdW5kbGVOYW1lOiBcIlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBidW5kbGVQcmlvcml0eTogMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3TGF5ZXJOYW1lOiBcIlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBidW5kbGVDaG9pY2UxOiBcIlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdQb3B1cE5hbWU6IFwiXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1bmRsZUNob2ljZTI6IFwiXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld1BhbmVsTmFtZTogXCJcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnVuZGxlQ2hvaWNlMzogXCJcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3V2lkZ2V0TmFtZTogXCJcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnVuZGxlQ2hvaWNlNDogXCJcIixcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzQ29kZUNvdW50aW5nOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29kZUluZm86IHt9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpc1Jlc0NvdW50aW5nOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXh0SW5mbzoge31cclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIG1ldGhvZHM6IHtcclxuICAgICAgICAgICAgICAgICAgICBvblNldFByZWZpeChwcmVmaXg6IHN0cmluZykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2pQcmVmaXggPSBwcmVmaXgudHJpbSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5wcm9qUHJlZml4Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEVkaXRvci5Qcm9maWxlLnNldFByb2plY3QocGFja2FnZUpTT04ubmFtZSwgXCJray5wcmVmaXhcIiwgdGhpcy5wcm9qUHJlZml4LCBcInByb2plY3RcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgICAgICBvblVubG9ja1ByZWZpeCgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9qUHJlZml4ID0gXCJcIjtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgICAgICBhc3luYyBvbkluaXRQcm9qKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5wcm9qUHJlZml4Lmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBFZGl0b3IuRGlhbG9nLndhcm4oXCLor7flhYjorr7nva7liY3nvIAhXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBidXR0b25zOiBbXCJPS1wiXVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbml0aW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgS0tDb3JlLmRvSW5pdFByb2pBc3kodGhpcy5wcm9qUHJlZml4KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbml0aW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaXNDb25mUGF0aEV4aXN0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgICAgICBhc3luYyBvbkNyZWF0ZUJ1bmRsZSgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLmlzQ29uZlBhdGhFeGlzdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgRWRpdG9yLkRpYWxvZy53YXJuKFwiVUnphY3nva7mlofku7bkuI3lrZjlnKghXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBidXR0b25zOiBbXCJPS1wiXVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubmV3QnVuZGxlTmFtZSA9IHRoaXMubmV3QnVuZGxlTmFtZS50cmltKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLm5ld0J1bmRsZU5hbWUubGVuZ3RoID09IDApIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGJ1bmRsZU5hbWUgPSB0aGlzLnByb2pQcmVmaXggKyB0aGlzLm5ld0J1bmRsZU5hbWUgKyBcIkJ1bmRsZVwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgaXNPSyA9IGF3YWl0IEtLQ29yZS5kb0NyZWF0ZUJ1bmRsZShidW5kbGVOYW1lLCB0aGlzLmJ1bmRsZVByaW9yaXR5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlzT0spIHRoaXMuYWxsQnVuZGxlcy5wdXNoKGJ1bmRsZU5hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIG9uQ3JlYXRlTGF5ZXIoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubmV3TGF5ZXJOYW1lID0gdGhpcy5uZXdMYXllck5hbWUudHJpbSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5uZXdMYXllck5hbWUubGVuZ3RoID09IDApIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuYnVuZGxlQ2hvaWNlMS5sZW5ndGggPT0gMCkgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBLS0NvcmUuZG9DcmVhdGVMYXllcih0aGlzLnByb2pQcmVmaXggKyB0aGlzLm5ld0xheWVyTmFtZSArIFwiTGF5ZXJcIiwgdGhpcy5idW5kbGVDaG9pY2UxKTtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgICAgICBvbkNyZWF0ZVBvcHVwKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5ld1BvcHVwTmFtZSA9IHRoaXMubmV3UG9wdXBOYW1lLnRyaW0oKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMubmV3UG9wdXBOYW1lLmxlbmd0aCA9PSAwKSByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmJ1bmRsZUNob2ljZTIubGVuZ3RoID09IDApIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgS0tDb3JlLmRvQ3JlYXRlUG9wdXAodGhpcy5wcm9qUHJlZml4ICsgdGhpcy5uZXdQb3B1cE5hbWUgKyBcIlBvcHVwXCIsIHRoaXMuYnVuZGxlQ2hvaWNlMik7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgb25DcmVhdGVQYW5lbCgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXdQYW5lbE5hbWUgPSB0aGlzLm5ld1BhbmVsTmFtZS50cmltKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLm5ld1BhbmVsTmFtZS5sZW5ndGggPT0gMCkgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5idW5kbGVDaG9pY2UzLmxlbmd0aCA9PSAwKSByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEtLQ29yZS5kb0NyZWF0ZVBhbmVsKHRoaXMucHJvalByZWZpeCArIHRoaXMubmV3UGFuZWxOYW1lICsgXCJQYW5lbFwiLCB0aGlzLmJ1bmRsZUNob2ljZTMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIG9uQ3JlYXRlV2lkZ2V0KCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5ld1dpZGdldE5hbWUgPSB0aGlzLm5ld1dpZGdldE5hbWUudHJpbSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5uZXdXaWRnZXROYW1lLmxlbmd0aCA9PSAwKSByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmJ1bmRsZUNob2ljZTQubGVuZ3RoID09IDApIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgS0tDb3JlLmRvQ3JlYXRlV2lkZ2V0KHRoaXMucHJvalByZWZpeCArIHRoaXMubmV3V2lkZ2V0TmFtZSArIFwiV2lkZ2V0XCIsIHRoaXMuYnVuZGxlQ2hvaWNlNCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgb25Db2RlQ291bnQoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzUmVzQ291bnRpbmcpIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaXNDb2RlQ291bnRpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgaW5mbyA9IEtLQ29yZS5nZXRDb2RlQ291bnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb2RlSW5mbyA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpbWU6IChuZXcgRGF0ZSgpKS50b0xvY2FsZVN0cmluZygpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0OiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBuYW1lOiBcIuazqOmHiuihjOaVsFwiLCBudW06IGluZm8uY29tbWVudCB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgbmFtZTogXCLnqbrooYzmlbBcIiwgbnVtOiBpbmZvLnNwYWNlIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBuYW1lOiBcIuS7o+eggeihjOaVsFwiLCBudW06IGluZm8uY29kZSB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgbmFtZTogXCLmgLvooYzmlbBcIiwgbnVtOiBpbmZvLnRvdGFsIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaXNDb2RlQ291bnRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgRWRpdG9yLlByb2ZpbGUuc2V0UHJvamVjdChwYWNrYWdlSlNPTi5uYW1lLCBcImtrLmNvZGVJbmZvXCIsIEpTT04uc3RyaW5naWZ5KHRoaXMuY29kZUluZm8pLCBcInByb2plY3RcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgb25SZXNDb3VudCgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNDb2RlQ291bnRpbmcpIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaXNSZXNDb3VudGluZyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZXh0SW5mbyA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpbWU6IChuZXcgRGF0ZSgpKS50b0xvY2FsZVN0cmluZygpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0OiBLS0NvcmUuZ2V0UmVzQ291bnQoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmlzUmVzQ291bnRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgRWRpdG9yLlByb2ZpbGUuc2V0UHJvamVjdChwYWNrYWdlSlNPTi5uYW1lLCBcImtrLmV4dEluZm9cIiwgSlNPTi5zdHJpbmdpZnkodGhpcy5leHRJbmZvKSwgXCJwcm9qZWN0XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBhc3luYyBiZWZvcmVNb3VudCgpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFsbEJ1bmRsZXMgPSBLS0NvcmUuZ2V0QnVuZGxlcygpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBra0NvbmYgPSBhd2FpdCBFZGl0b3IuUHJvZmlsZS5nZXRQcm9qZWN0KHBhY2thZ2VKU09OLm5hbWUsIFwia2tcIiwgXCJwcm9qZWN0XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChra0NvbmY/LnByZWZpeCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2pQcmVmaXggPSBra0NvbmYucHJlZml4O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVpQ29uZlBhdGggPSBgYXNzZXRzL0Jvb3QvU2NyaXB0cy8ke2trQ29uZi5wcmVmaXh9R2FtZVVJQ29uZi50c2A7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy51aUNvbmZQYXRoLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgS0tVdGlscy51cmwycGF0aEFzeShcImRiOi8vXCIgKyB0aGlzLnVpQ29uZlBhdGgpLnRoZW4oKHApID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChleGlzdHNTeW5jKHApKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pc0NvbmZQYXRoRXhpc3QgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEtLQ29yZS5wcm9qUHJlZml4ID0ga2tDb25mLnByZWZpeDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoa2tDb25mPy5jb2RlSW5mbykgdGhpcy5jb2RlSW5mbyA9IEpTT04ucGFyc2Uoa2tDb25mLmNvZGVJbmZvKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoa2tDb25mPy5leHRJbmZvKSB0aGlzLmV4dEluZm8gPSBKU09OLnBhcnNlKGtrQ29uZi5leHRJbmZvKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGFwcC5jb25maWcuY29tcGlsZXJPcHRpb25zLmlzQ3VzdG9tRWxlbWVudCA9ICh0YWcpID0+IHRhZy5zdGFydHNXaXRoKCd1aS0nKTtcclxuICAgICAgICAgICAgYXBwLm1vdW50KHRoaXMuJC5hcHApO1xyXG4gICAgICAgICAgICBwYW5lbERhdGFNYXAuc2V0KHRoaXMsIGFwcCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIGJlZm9yZUNsb3NlKCkgeyB9LFxyXG4gICAgY2xvc2UoKSB7XHJcbiAgICAgICAgY29uc3QgYXBwID0gcGFuZWxEYXRhTWFwLmdldCh0aGlzKTtcclxuICAgICAgICBpZiAoYXBwKSB7XHJcbiAgICAgICAgICAgIGFwcC51bm1vdW50KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxufSk7XHJcbiJdfQ==