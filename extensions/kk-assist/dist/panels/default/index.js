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
                    onInitProj() {
                        if (this.projPrefix.length == 0) {
                            Editor.Dialog.warn("请先设置前缀!", {
                                buttons: ["OK"]
                            });
                            return;
                        }
                        KKCore_1.default.doInitProj(this.projPrefix);
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
                    if (kkConf === null || kkConf === void 0 ? void 0 : kkConf.prefix)
                        this.projPrefix = kkConf.prefix;
                    if (kkConf === null || kkConf === void 0 ? void 0 : kkConf.uiConfPath)
                        this.uiConfPath = kkConf.uiConfPath;
                    else if (kkConf === null || kkConf === void 0 ? void 0 : kkConf.prefix)
                        this.uiConfPath = `assets/Boot/Scripts/${kkConf.prefix}GameUIConf.ts`;
                    if (this.uiConfPath.length > 0) {
                        KKUtils_1.default.url2pathAsy("db://" + this.uiConfPath).then((p) => {
                            this.isConfPathExist = (0, fs_extra_1.existsSync)(p);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zb3VyY2UvcGFuZWxzL2RlZmF1bHQvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSx1Q0FBb0Q7QUFDcEQsK0JBQTRCO0FBQzVCLDZCQUFxQztBQUNyQywrREFBdUM7QUFDdkMseUVBQWdEO0FBQ2hELGlFQUF5QztBQUN6QyxNQUFNLFlBQVksR0FBRyxJQUFJLE9BQU8sRUFBWSxDQUFDO0FBQzdDOzs7R0FHRztBQUNILHlGQUF5RjtBQUN6RixNQUFNLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDO0lBQ2pDLFNBQVMsRUFBRTtRQUNQLElBQUksS0FBSyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMvQixJQUFJLEtBQUssT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDbEM7SUFDRCxRQUFRLEVBQUUsSUFBQSx1QkFBWSxFQUFDLElBQUEsV0FBSSxFQUFDLFNBQVMsRUFBRSw2Q0FBNkMsQ0FBQyxFQUFFLE9BQU8sQ0FBQztJQUMvRixLQUFLLEVBQUUsSUFBQSx1QkFBWSxFQUFDLElBQUEsV0FBSSxFQUFDLFNBQVMsRUFBRSx5Q0FBeUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQztJQUN4RixDQUFDLEVBQUU7UUFDQyxHQUFHLEVBQUUsTUFBTTtLQUNkO0lBQ0QsT0FBTyxFQUFFLEVBRVI7SUFDRCxLQUFLO1FBQ0QsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQ2IsTUFBTSxHQUFHLEdBQUcsSUFBQSxlQUFTLEVBQUM7Z0JBQ2xCLElBQUk7b0JBQ0EsT0FBTzt3QkFDSCxVQUFVLEVBQUUsRUFBRTt3QkFDZCxNQUFNLEVBQUUsQ0FBQzt3QkFDVCxVQUFVLEVBQUUsRUFBRTt3QkFDZCxVQUFVLEVBQUUsRUFBRTt3QkFD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LElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLENBQUM7d0JBQzdDLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLElBQUksQ0FBQzs0QkFBRSxPQUFPO3dCQUMxQyxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxJQUFJLENBQUM7NEJBQUUsT0FBTzt3QkFDM0MsZ0JBQU0sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsWUFBWSxHQUFHLE9BQU8sRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7b0JBQzVGLENBQUM7b0JBRUQsYUFBYTt3QkFDVCxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLENBQUM7d0JBQzdDLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLElBQUksQ0FBQzs0QkFBRSxPQUFPO3dCQUMxQyxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxJQUFJLENBQUM7NEJBQUUsT0FBTzt3QkFDM0MsZ0JBQU0sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsWUFBWSxHQUFHLE9BQU8sRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7b0JBQzVGLENBQUM7b0JBRUQsY0FBYzt3QkFDVixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLENBQUM7d0JBQy9DLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLElBQUksQ0FBQzs0QkFBRSxPQUFPO3dCQUMzQyxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxJQUFJLENBQUM7NEJBQUUsT0FBTzt3QkFDM0MsZ0JBQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsYUFBYSxHQUFHLFFBQVEsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7b0JBQy9GLENBQUM7b0JBRUQsV0FBVzt3QkFDUCxJQUFJLElBQUks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UUFBUTt3QkFBRSxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUNsRSxJQUFJLE1BQU0sYUFBTixNQUFNLHVCQUFOLE1BQU0sQ0FBRSxPQUFPO3dCQUFFLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQ25FLENBQUM7YUFDSixDQUFDLENBQUM7WUFDSCxHQUFHLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxlQUFlLEdBQUcsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDNUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3RCLFlBQVksQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ2hDLENBQUM7SUFDTCxDQUFDO0lBQ0QsV0FBVyxLQUFLLENBQUM7SUFDakIsS0FBSztRQUNELE1BQU0sR0FBRyxHQUFHLFlBQVksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbkMsSUFBSSxHQUFHLEVBQUUsQ0FBQztZQUNOLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNsQixDQUFDO0lBQ0wsQ0FBQztDQUNKLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGV4aXN0c1N5bmMsIHJlYWRGaWxlU3luYyB9IGZyb20gJ2ZzLWV4dHJhJztcclxuaW1wb3J0IHsgam9pbiB9IGZyb20gJ3BhdGgnO1xyXG5pbXBvcnQgeyBjcmVhdGVBcHAsIEFwcCB9IGZyb20gJ3Z1ZSc7XHJcbmltcG9ydCBLS0NvcmUgZnJvbSAnLi4vLi4vY29yZS9LS0NvcmUnO1xyXG5pbXBvcnQgcGFja2FnZUpTT04gZnJvbSAnLi4vLi4vLi4vcGFja2FnZS5qc29uJztcclxuaW1wb3J0IEtLVXRpbHMgZnJvbSAnLi4vLi4vY29yZS9LS1V0aWxzJztcclxuY29uc3QgcGFuZWxEYXRhTWFwID0gbmV3IFdlYWtNYXA8YW55LCBBcHA+KCk7XHJcbi8qKlxyXG4gKiBAemgg5aaC5p6c5biM5pyb5YW85a65IDMuMyDkuYvliY3nmoTniYjmnKzlj6/ku6Xkvb/nlKjkuIvmlrnnmoTku6PnoIFcclxuICogQGVuIFlvdSBjYW4gYWRkIHRoZSBjb2RlIGJlbG93IGlmIHlvdSB3YW50IGNvbXBhdGliaWxpdHkgd2l0aCB2ZXJzaW9ucyBwcmlvciB0byAzLjNcclxuICovXHJcbi8vIEVkaXRvci5QYW5lbC5kZWZpbmUgPSBFZGl0b3IuUGFuZWwuZGVmaW5lIHx8IGZ1bmN0aW9uKG9wdGlvbnM6IGFueSkgeyByZXR1cm4gb3B0aW9ucyB9XHJcbm1vZHVsZS5leHBvcnRzID0gRWRpdG9yLlBhbmVsLmRlZmluZSh7XHJcbiAgICBsaXN0ZW5lcnM6IHtcclxuICAgICAgICBzaG93KCkgeyBjb25zb2xlLmxvZygnc2hvdycpOyB9LFxyXG4gICAgICAgIGhpZGUoKSB7IGNvbnNvbGUubG9nKCdoaWRlJyk7IH0sXHJcbiAgICB9LFxyXG4gICAgdGVtcGxhdGU6IHJlYWRGaWxlU3luYyhqb2luKF9fZGlybmFtZSwgJy4uLy4uLy4uL3N0YXRpYy90ZW1wbGF0ZS9kZWZhdWx0L2luZGV4Lmh0bWwnKSwgJ3V0Zi04JyksXHJcbiAgICBzdHlsZTogcmVhZEZpbGVTeW5jKGpvaW4oX19kaXJuYW1lLCAnLi4vLi4vLi4vc3RhdGljL3N0eWxlL2RlZmF1bHQvaW5kZXguY3NzJyksICd1dGYtOCcpLFxyXG4gICAgJDoge1xyXG4gICAgICAgIGFwcDogJyNhcHAnLFxyXG4gICAgfSxcclxuICAgIG1ldGhvZHM6IHtcclxuXHJcbiAgICB9LFxyXG4gICAgcmVhZHkoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuJC5hcHApIHtcclxuICAgICAgICAgICAgY29uc3QgYXBwID0gY3JlYXRlQXBwKHtcclxuICAgICAgICAgICAgICAgIGRhdGEoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWxsQnVuZGxlczogW10sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cklkeDogMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvalByZWZpeDogXCJcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgdWlDb25mUGF0aDogXCJcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXNDb25mUGF0aEV4aXN0OiBmYWxzZSxcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld0J1bmRsZU5hbWU6IFwiXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1bmRsZVByaW9yaXR5OiAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdMYXllck5hbWU6IFwiXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1bmRsZUNob2ljZTE6IFwiXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld1BvcHVwTmFtZTogXCJcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnVuZGxlQ2hvaWNlMjogXCJcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3UGFuZWxOYW1lOiBcIlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBidW5kbGVDaG9pY2UzOiBcIlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdXaWRnZXROYW1lOiBcIlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBidW5kbGVDaG9pY2U0OiBcIlwiLFxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaXNDb2RlQ291bnRpbmc6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2RlSW5mbzoge30sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzUmVzQ291bnRpbmc6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBleHRJbmZvOiB7fVxyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgbWV0aG9kczoge1xyXG4gICAgICAgICAgICAgICAgICAgIG9uU2V0UHJlZml4KHByZWZpeDogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJvalByZWZpeCA9IHByZWZpeC50cmltKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnByb2pQcmVmaXgubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgRWRpdG9yLlByb2ZpbGUuc2V0UHJvamVjdChwYWNrYWdlSlNPTi5uYW1lLCBcImtrLnByZWZpeFwiLCB0aGlzLnByb2pQcmVmaXgsIFwicHJvamVjdFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIG9uVW5sb2NrUHJlZml4KCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2pQcmVmaXggPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIG9uSW5pdFByb2ooKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnByb2pQcmVmaXgubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEVkaXRvci5EaWFsb2cud2FybihcIuivt+WFiOiuvue9ruWJjee8gCFcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbnM6IFtcIk9LXCJdXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBLS0NvcmUuZG9Jbml0UHJvaih0aGlzLnByb2pQcmVmaXgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGFzeW5jIG9uQ3JlYXRlQnVuZGxlKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuaXNDb25mUGF0aEV4aXN0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBFZGl0b3IuRGlhbG9nLndhcm4oXCJVSemFjee9ruaWh+S7tuS4jeWtmOWcqCFcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbnM6IFtcIk9LXCJdXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXdCdW5kbGVOYW1lID0gdGhpcy5uZXdCdW5kbGVOYW1lLnRyaW0oKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMubmV3QnVuZGxlTmFtZS5sZW5ndGggPT0gMCkgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgYnVuZGxlTmFtZSA9IHRoaXMucHJvalByZWZpeCArIHRoaXMubmV3QnVuZGxlTmFtZSArIFwiQnVuZGxlXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBpc09LID0gYXdhaXQgS0tDb3JlLmRvQ3JlYXRlQnVuZGxlKGJ1bmRsZU5hbWUsIHRoaXMuYnVuZGxlUHJpb3JpdHkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXNPSykgdGhpcy5hbGxCdW5kbGVzLnB1c2goYnVuZGxlTmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgb25DcmVhdGVMYXllcigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXdMYXllck5hbWUgPSB0aGlzLm5ld0xheWVyTmFtZS50cmltKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLm5ld0xheWVyTmFtZS5sZW5ndGggPT0gMCkgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5idW5kbGVDaG9pY2UxLmxlbmd0aCA9PSAwKSByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEtLQ29yZS5kb0NyZWF0ZUxheWVyKHRoaXMucHJvalByZWZpeCArIHRoaXMubmV3TGF5ZXJOYW1lICsgXCJMYXllclwiLCB0aGlzLmJ1bmRsZUNob2ljZTEpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIG9uQ3JlYXRlUG9wdXAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubmV3UG9wdXBOYW1lID0gdGhpcy5uZXdQb3B1cE5hbWUudHJpbSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5uZXdQb3B1cE5hbWUubGVuZ3RoID09IDApIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuYnVuZGxlQ2hvaWNlMi5sZW5ndGggPT0gMCkgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBLS0NvcmUuZG9DcmVhdGVQb3B1cCh0aGlzLnByb2pQcmVmaXggKyB0aGlzLm5ld1BvcHVwTmFtZSArIFwiUG9wdXBcIiwgdGhpcy5idW5kbGVDaG9pY2UyKTtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgICAgICBvbkNyZWF0ZVBhbmVsKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5ld1BhbmVsTmFtZSA9IHRoaXMubmV3UGFuZWxOYW1lLnRyaW0oKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMubmV3UGFuZWxOYW1lLmxlbmd0aCA9PSAwKSByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmJ1bmRsZUNob2ljZTMubGVuZ3RoID09IDApIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgS0tDb3JlLmRvQ3JlYXRlUGFuZWwodGhpcy5wcm9qUHJlZml4ICsgdGhpcy5uZXdQYW5lbE5hbWUgKyBcIlBhbmVsXCIsIHRoaXMuYnVuZGxlQ2hvaWNlMyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgb25DcmVhdGVXaWRnZXQoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubmV3V2lkZ2V0TmFtZSA9IHRoaXMubmV3V2lkZ2V0TmFtZS50cmltKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLm5ld1dpZGdldE5hbWUubGVuZ3RoID09IDApIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuYnVuZGxlQ2hvaWNlNC5sZW5ndGggPT0gMCkgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBLS0NvcmUuZG9DcmVhdGVXaWRnZXQodGhpcy5wcm9qUHJlZml4ICsgdGhpcy5uZXdXaWRnZXROYW1lICsgXCJXaWRnZXRcIiwgdGhpcy5idW5kbGVDaG9pY2U0KTtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgICAgICBvbkNvZGVDb3VudCgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNSZXNDb3VudGluZykgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pc0NvZGVDb3VudGluZyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBpbmZvID0gS0tDb3JlLmdldENvZGVDb3VudCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvZGVJbmZvID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGltZTogKG5ldyBEYXRlKCkpLnRvTG9jYWxlU3RyaW5nKCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQ6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IG5hbWU6IFwi5rOo6YeK6KGM5pWwXCIsIG51bTogaW5mby5jb21tZW50IH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBuYW1lOiBcIuepuuihjOaVsFwiLCBudW06IGluZm8uc3BhY2UgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IG5hbWU6IFwi5Luj56CB6KGM5pWwXCIsIG51bTogaW5mby5jb2RlIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBuYW1lOiBcIuaAu+ihjOaVsFwiLCBudW06IGluZm8udG90YWwgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pc0NvZGVDb3VudGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBFZGl0b3IuUHJvZmlsZS5zZXRQcm9qZWN0KHBhY2thZ2VKU09OLm5hbWUsIFwia2suY29kZUluZm9cIiwgSlNPTi5zdHJpbmdpZnkodGhpcy5jb2RlSW5mbyksIFwicHJvamVjdFwiKTtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgICAgICBvblJlc0NvdW50KCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5pc0NvZGVDb3VudGluZykgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pc1Jlc0NvdW50aW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5leHRJbmZvID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGltZTogKG5ldyBEYXRlKCkpLnRvTG9jYWxlU3RyaW5nKCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQ6IEtLQ29yZS5nZXRSZXNDb3VudCgpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaXNSZXNDb3VudGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBFZGl0b3IuUHJvZmlsZS5zZXRQcm9qZWN0KHBhY2thZ2VKU09OLm5hbWUsIFwia2suZXh0SW5mb1wiLCBKU09OLnN0cmluZ2lmeSh0aGlzLmV4dEluZm8pLCBcInByb2plY3RcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGFzeW5jIGJlZm9yZU1vdW50KCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWxsQnVuZGxlcyA9IEtLQ29yZS5nZXRCdW5kbGVzKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGtrQ29uZiA9IGF3YWl0IEVkaXRvci5Qcm9maWxlLmdldFByb2plY3QocGFja2FnZUpTT04ubmFtZSwgXCJra1wiLCBcInByb2plY3RcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGtrQ29uZj8ucHJlZml4KSB0aGlzLnByb2pQcmVmaXggPSBra0NvbmYucHJlZml4O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoa2tDb25mPy51aUNvbmZQYXRoKSB0aGlzLnVpQ29uZlBhdGggPSBra0NvbmYudWlDb25mUGF0aDtcclxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChra0NvbmY/LnByZWZpeCkgdGhpcy51aUNvbmZQYXRoID0gYGFzc2V0cy9Cb290L1NjcmlwdHMvJHtra0NvbmYucHJlZml4fUdhbWVVSUNvbmYudHNgO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnVpQ29uZlBhdGgubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBLS1V0aWxzLnVybDJwYXRoQXN5KFwiZGI6Ly9cIiArIHRoaXMudWlDb25mUGF0aCkudGhlbigocCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pc0NvbmZQYXRoRXhpc3QgPSBleGlzdHNTeW5jKHApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChra0NvbmY/LmNvZGVJbmZvKSB0aGlzLmNvZGVJbmZvID0gSlNPTi5wYXJzZShra0NvbmYuY29kZUluZm8pO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChra0NvbmY/LmV4dEluZm8pIHRoaXMuZXh0SW5mbyA9IEpTT04ucGFyc2Uoa2tDb25mLmV4dEluZm8pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgYXBwLmNvbmZpZy5jb21waWxlck9wdGlvbnMuaXNDdXN0b21FbGVtZW50ID0gKHRhZykgPT4gdGFnLnN0YXJ0c1dpdGgoJ3VpLScpO1xyXG4gICAgICAgICAgICBhcHAubW91bnQodGhpcy4kLmFwcCk7XHJcbiAgICAgICAgICAgIHBhbmVsRGF0YU1hcC5zZXQodGhpcywgYXBwKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgYmVmb3JlQ2xvc2UoKSB7IH0sXHJcbiAgICBjbG9zZSgpIHtcclxuICAgICAgICBjb25zdCBhcHAgPSBwYW5lbERhdGFNYXAuZ2V0KHRoaXMpO1xyXG4gICAgICAgIGlmIChhcHApIHtcclxuICAgICAgICAgICAgYXBwLnVubW91bnQoKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG59KTtcclxuIl19