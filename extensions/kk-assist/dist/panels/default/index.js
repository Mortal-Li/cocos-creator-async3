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
                        codeInfo: [],
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
                        KKCore_1.default.doInitProj(this.projPrefix);
                    },
                    async onCreateBundle() {
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
                        this.codeInfo = [
                            { name: "注释行数", num: info.comment },
                            { name: "空行数", num: info.space },
                            { name: "代码行数", num: info.code },
                            { name: "总行数", num: info.total },
                        ];
                        this.isCodeCounting = false;
                        Editor.Profile.setProject(package_json_1.default.name, "kk.codeCount", JSON.stringify(this.codeInfo), "project");
                    },
                    onResCount() {
                        if (this.isCodeCounting)
                            return;
                        this.isResCounting = true;
                        this.extInfo = KKCore_1.default.getResCount();
                        this.isResCounting = false;
                        Editor.Profile.setProject(package_json_1.default.name, "kk.resCount", JSON.stringify(this.extInfo), "project");
                    }
                },
                async beforeMount() {
                    this.allBundles = KKCore_1.default.getBundles();
                    let kkConf = await Editor.Profile.getProject(package_json_1.default.name, "kk", "project");
                    if (kkConf === null || kkConf === void 0 ? void 0 : kkConf.prefix)
                        this.projPrefix = kkConf.prefix;
                    if (kkConf === null || kkConf === void 0 ? void 0 : kkConf.codeCount)
                        this.codeInfo = JSON.parse(kkConf.codeCount);
                    if (kkConf === null || kkConf === void 0 ? void 0 : kkConf.resCount)
                        this.extInfo = JSON.parse(kkConf.resCount);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zb3VyY2UvcGFuZWxzL2RlZmF1bHQvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSx1Q0FBd0M7QUFDeEMsK0JBQTRCO0FBQzVCLDZCQUFxQztBQUNyQywrREFBdUM7QUFDdkMseUVBQWdEO0FBQ2hELE1BQU0sWUFBWSxHQUFHLElBQUksT0FBTyxFQUFZLENBQUM7QUFDN0M7OztHQUdHO0FBQ0gseUZBQXlGO0FBQ3pGLE1BQU0sQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUM7SUFDakMsU0FBUyxFQUFFO1FBQ1AsSUFBSSxLQUFLLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQy9CLElBQUksS0FBSyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNsQztJQUNELFFBQVEsRUFBRSxJQUFBLHVCQUFZLEVBQUMsSUFBQSxXQUFJLEVBQUMsU0FBUyxFQUFFLDZDQUE2QyxDQUFDLEVBQUUsT0FBTyxDQUFDO0lBQy9GLEtBQUssRUFBRSxJQUFBLHVCQUFZLEVBQUMsSUFBQSxXQUFJLEVBQUMsU0FBUyxFQUFFLHlDQUF5QyxDQUFDLEVBQUUsT0FBTyxDQUFDO0lBQ3hGLENBQUMsRUFBRTtRQUNDLEdBQUcsRUFBRSxNQUFNO0tBQ2Q7SUFDRCxPQUFPLEVBQUUsRUFFUjtJQUNELEtBQUs7UUFDRCxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7WUFDYixNQUFNLEdBQUcsR0FBRyxJQUFBLGVBQVMsRUFBQztnQkFDbEIsSUFBSTtvQkFDQSxPQUFPO3dCQUNILFVBQVUsRUFBRSxFQUFFO3dCQUNkLE1BQU0sRUFBRSxDQUFDO3dCQUNULFVBQVUsRUFBRSxFQUFFO3dCQUNkLGFBQWEsRUFBRSxFQUFFO3dCQUNqQixjQUFjLEVBQUUs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LE1BQU0sYUFBTixNQUFNLHVCQUFOLE1BQU0sQ0FBRSxRQUFRO3dCQUFFLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQ3JFLENBQUM7YUFDSixDQUFDLENBQUM7WUFDSCxHQUFHLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxlQUFlLEdBQUcsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDNUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3RCLFlBQVksQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ2hDLENBQUM7SUFDTCxDQUFDO0lBQ0QsV0FBVyxLQUFLLENBQUM7SUFDakIsS0FBSztRQUNELE1BQU0sR0FBRyxHQUFHLFlBQVksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbkMsSUFBSSxHQUFHLEVBQUUsQ0FBQztZQUNOLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNsQixDQUFDO0lBQ0wsQ0FBQztDQUNKLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHJlYWRGaWxlU3luYyB9IGZyb20gJ2ZzLWV4dHJhJztcclxuaW1wb3J0IHsgam9pbiB9IGZyb20gJ3BhdGgnO1xyXG5pbXBvcnQgeyBjcmVhdGVBcHAsIEFwcCB9IGZyb20gJ3Z1ZSc7XHJcbmltcG9ydCBLS0NvcmUgZnJvbSAnLi4vLi4vY29yZS9LS0NvcmUnO1xyXG5pbXBvcnQgcGFja2FnZUpTT04gZnJvbSAnLi4vLi4vLi4vcGFja2FnZS5qc29uJztcclxuY29uc3QgcGFuZWxEYXRhTWFwID0gbmV3IFdlYWtNYXA8YW55LCBBcHA+KCk7XHJcbi8qKlxyXG4gKiBAemgg5aaC5p6c5biM5pyb5YW85a65IDMuMyDkuYvliY3nmoTniYjmnKzlj6/ku6Xkvb/nlKjkuIvmlrnnmoTku6PnoIFcclxuICogQGVuIFlvdSBjYW4gYWRkIHRoZSBjb2RlIGJlbG93IGlmIHlvdSB3YW50IGNvbXBhdGliaWxpdHkgd2l0aCB2ZXJzaW9ucyBwcmlvciB0byAzLjNcclxuICovXHJcbi8vIEVkaXRvci5QYW5lbC5kZWZpbmUgPSBFZGl0b3IuUGFuZWwuZGVmaW5lIHx8IGZ1bmN0aW9uKG9wdGlvbnM6IGFueSkgeyByZXR1cm4gb3B0aW9ucyB9XHJcbm1vZHVsZS5leHBvcnRzID0gRWRpdG9yLlBhbmVsLmRlZmluZSh7XHJcbiAgICBsaXN0ZW5lcnM6IHtcclxuICAgICAgICBzaG93KCkgeyBjb25zb2xlLmxvZygnc2hvdycpOyB9LFxyXG4gICAgICAgIGhpZGUoKSB7IGNvbnNvbGUubG9nKCdoaWRlJyk7IH0sXHJcbiAgICB9LFxyXG4gICAgdGVtcGxhdGU6IHJlYWRGaWxlU3luYyhqb2luKF9fZGlybmFtZSwgJy4uLy4uLy4uL3N0YXRpYy90ZW1wbGF0ZS9kZWZhdWx0L2luZGV4Lmh0bWwnKSwgJ3V0Zi04JyksXHJcbiAgICBzdHlsZTogcmVhZEZpbGVTeW5jKGpvaW4oX19kaXJuYW1lLCAnLi4vLi4vLi4vc3RhdGljL3N0eWxlL2RlZmF1bHQvaW5kZXguY3NzJyksICd1dGYtOCcpLFxyXG4gICAgJDoge1xyXG4gICAgICAgIGFwcDogJyNhcHAnLFxyXG4gICAgfSxcclxuICAgIG1ldGhvZHM6IHtcclxuXHJcbiAgICB9LFxyXG4gICAgcmVhZHkoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuJC5hcHApIHtcclxuICAgICAgICAgICAgY29uc3QgYXBwID0gY3JlYXRlQXBwKHtcclxuICAgICAgICAgICAgICAgIGRhdGEoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWxsQnVuZGxlczogW10sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cklkeDogMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvalByZWZpeDogXCJcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3QnVuZGxlTmFtZTogXCJcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnVuZGxlUHJpb3JpdHk6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld0xheWVyTmFtZTogXCJcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnVuZGxlQ2hvaWNlMTogXCJcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3UG9wdXBOYW1lOiBcIlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBidW5kbGVDaG9pY2UyOiBcIlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdQYW5lbE5hbWU6IFwiXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1bmRsZUNob2ljZTM6IFwiXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld1dpZGdldE5hbWU6IFwiXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1bmRsZUNob2ljZTQ6IFwiXCIsXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpc0NvZGVDb3VudGluZzogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvZGVJbmZvOiBbXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXNSZXNDb3VudGluZzogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4dEluZm86IHt9XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBtZXRob2RzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgb25TZXRQcmVmaXgocHJlZml4OiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9qUHJlZml4ID0gcHJlZml4LnRyaW0oKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMucHJvalByZWZpeC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBFZGl0b3IuUHJvZmlsZS5zZXRQcm9qZWN0KHBhY2thZ2VKU09OLm5hbWUsIFwia2sucHJlZml4XCIsIHRoaXMucHJvalByZWZpeCwgXCJwcm9qZWN0XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgb25VbmxvY2tQcmVmaXgoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJvalByZWZpeCA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgb25Jbml0UHJvaigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgS0tDb3JlLmRvSW5pdFByb2oodGhpcy5wcm9qUHJlZml4KTtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgICAgICBhc3luYyBvbkNyZWF0ZUJ1bmRsZSgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXdCdW5kbGVOYW1lID0gdGhpcy5uZXdCdW5kbGVOYW1lLnRyaW0oKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMubmV3QnVuZGxlTmFtZS5sZW5ndGggPT0gMCkgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgYnVuZGxlTmFtZSA9IHRoaXMucHJvalByZWZpeCArIHRoaXMubmV3QnVuZGxlTmFtZSArIFwiQnVuZGxlXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBpc09LID0gYXdhaXQgS0tDb3JlLmRvQ3JlYXRlQnVuZGxlKGJ1bmRsZU5hbWUsIHRoaXMuYnVuZGxlUHJpb3JpdHkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXNPSykgdGhpcy5hbGxCdW5kbGVzLnB1c2goYnVuZGxlTmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgb25DcmVhdGVMYXllcigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXdMYXllck5hbWUgPSB0aGlzLm5ld0xheWVyTmFtZS50cmltKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLm5ld0xheWVyTmFtZS5sZW5ndGggPT0gMCkgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5idW5kbGVDaG9pY2UxLmxlbmd0aCA9PSAwKSByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEtLQ29yZS5kb0NyZWF0ZUxheWVyKHRoaXMucHJvalByZWZpeCArIHRoaXMubmV3TGF5ZXJOYW1lICsgXCJMYXllclwiLCB0aGlzLmJ1bmRsZUNob2ljZTEpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIG9uQ3JlYXRlUG9wdXAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubmV3UG9wdXBOYW1lID0gdGhpcy5uZXdQb3B1cE5hbWUudHJpbSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5uZXdQb3B1cE5hbWUubGVuZ3RoID09IDApIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuYnVuZGxlQ2hvaWNlMi5sZW5ndGggPT0gMCkgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBLS0NvcmUuZG9DcmVhdGVQb3B1cCh0aGlzLnByb2pQcmVmaXggKyB0aGlzLm5ld1BvcHVwTmFtZSArIFwiUG9wdXBcIiwgdGhpcy5idW5kbGVDaG9pY2UyKTtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgICAgICBvbkNyZWF0ZVBhbmVsKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5ld1BhbmVsTmFtZSA9IHRoaXMubmV3UGFuZWxOYW1lLnRyaW0oKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMubmV3UGFuZWxOYW1lLmxlbmd0aCA9PSAwKSByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmJ1bmRsZUNob2ljZTMubGVuZ3RoID09IDApIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgS0tDb3JlLmRvQ3JlYXRlUGFuZWwodGhpcy5wcm9qUHJlZml4ICsgdGhpcy5uZXdQYW5lbE5hbWUgKyBcIlBhbmVsXCIsIHRoaXMuYnVuZGxlQ2hvaWNlMyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgb25DcmVhdGVXaWRnZXQoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubmV3V2lkZ2V0TmFtZSA9IHRoaXMubmV3V2lkZ2V0TmFtZS50cmltKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLm5ld1dpZGdldE5hbWUubGVuZ3RoID09IDApIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuYnVuZGxlQ2hvaWNlNC5sZW5ndGggPT0gMCkgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBLS0NvcmUuZG9DcmVhdGVXaWRnZXQodGhpcy5wcm9qUHJlZml4ICsgdGhpcy5uZXdXaWRnZXROYW1lICsgXCJXaWRnZXRcIiwgdGhpcy5idW5kbGVDaG9pY2U0KTtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgICAgICBvbkNvZGVDb3VudCgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNSZXNDb3VudGluZykgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pc0NvZGVDb3VudGluZyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBpbmZvID0gS0tDb3JlLmdldENvZGVDb3VudCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvZGVJbmZvID0gW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBuYW1lOiBcIuazqOmHiuihjOaVsFwiLCBudW06IGluZm8uY29tbWVudCB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBuYW1lOiBcIuepuuihjOaVsFwiLCBudW06IGluZm8uc3BhY2UgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgbmFtZTogXCLku6PnoIHooYzmlbBcIiwgbnVtOiBpbmZvLmNvZGUgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgbmFtZTogXCLmgLvooYzmlbBcIiwgbnVtOiBpbmZvLnRvdGFsIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaXNDb2RlQ291bnRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgRWRpdG9yLlByb2ZpbGUuc2V0UHJvamVjdChwYWNrYWdlSlNPTi5uYW1lLCBcImtrLmNvZGVDb3VudFwiLCBKU09OLnN0cmluZ2lmeSh0aGlzLmNvZGVJbmZvKSwgXCJwcm9qZWN0XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIG9uUmVzQ291bnQoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzQ29kZUNvdW50aW5nKSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmlzUmVzQ291bnRpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmV4dEluZm8gPSBLS0NvcmUuZ2V0UmVzQ291bnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pc1Jlc0NvdW50aW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEVkaXRvci5Qcm9maWxlLnNldFByb2plY3QocGFja2FnZUpTT04ubmFtZSwgXCJray5yZXNDb3VudFwiLCBKU09OLnN0cmluZ2lmeSh0aGlzLmV4dEluZm8pLCBcInByb2plY3RcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGFzeW5jIGJlZm9yZU1vdW50KCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWxsQnVuZGxlcyA9IEtLQ29yZS5nZXRCdW5kbGVzKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGtrQ29uZiA9IGF3YWl0IEVkaXRvci5Qcm9maWxlLmdldFByb2plY3QocGFja2FnZUpTT04ubmFtZSwgXCJra1wiLCBcInByb2plY3RcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGtrQ29uZj8ucHJlZml4KSB0aGlzLnByb2pQcmVmaXggPSBra0NvbmYucHJlZml4O1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChra0NvbmY/LmNvZGVDb3VudCkgdGhpcy5jb2RlSW5mbyA9IEpTT04ucGFyc2Uoa2tDb25mLmNvZGVDb3VudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGtrQ29uZj8ucmVzQ291bnQpIHRoaXMuZXh0SW5mbyA9IEpTT04ucGFyc2Uoa2tDb25mLnJlc0NvdW50KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGFwcC5jb25maWcuY29tcGlsZXJPcHRpb25zLmlzQ3VzdG9tRWxlbWVudCA9ICh0YWcpID0+IHRhZy5zdGFydHNXaXRoKCd1aS0nKTtcclxuICAgICAgICAgICAgYXBwLm1vdW50KHRoaXMuJC5hcHApO1xyXG4gICAgICAgICAgICBwYW5lbERhdGFNYXAuc2V0KHRoaXMsIGFwcCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIGJlZm9yZUNsb3NlKCkgeyB9LFxyXG4gICAgY2xvc2UoKSB7XHJcbiAgICAgICAgY29uc3QgYXBwID0gcGFuZWxEYXRhTWFwLmdldCh0aGlzKTtcclxuICAgICAgICBpZiAoYXBwKSB7XHJcbiAgICAgICAgICAgIGFwcC51bm1vdW50KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxufSk7XHJcbiJdfQ==