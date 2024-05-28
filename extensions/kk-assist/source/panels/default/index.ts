import { readFileSync } from 'fs-extra';
import { join } from 'path';
import { createApp, App } from 'vue';
import KKCore from '../../core/KKCore';
import packageJSON from '../../../package.json';
const panelDataMap = new WeakMap<any, App>();
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
    template: readFileSync(join(__dirname, '../../../static/template/default/index.html'), 'utf-8'),
    style: readFileSync(join(__dirname, '../../../static/style/default/index.css'), 'utf-8'),
    $: {
        app: '#app',
    },
    methods: {

    },
    ready() {
        if (this.$.app) {
            const app = createApp({
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
                    onSetPrefix(prefix: string) {
                        this.projPrefix = prefix.trim();
                        if (this.projPrefix.length > 0) {
                            Editor.Profile.setProject(packageJSON.name, "kk.prefix", this.projPrefix, "project");
                        }
                    },

                    onUnlockPrefix() {
                        this.projPrefix = "";
                    },

                    onInitProj() {
                        KKCore.doInitProj(this.projPrefix);
                    },

                    async onCreateBundle() {
                        this.newBundleName = this.newBundleName.trim();
                        if (this.newBundleName.length == 0) return;
                        let bundleName = this.projPrefix + this.newBundleName + "Bundle";
                        let isOK = await KKCore.doCreateBundle(bundleName, this.bundlePriority);
                        if (isOK) this.allBundles.push(bundleName);
                    },

                    onCreateLayer() {
                        this.newLayerName = this.newLayerName.trim();
                        if (this.newLayerName.length == 0) return;
                        if (this.bundleChoice1.length == 0) return;
                        KKCore.doCreateLayer(this.projPrefix + this.newLayerName + "Layer", this.bundleChoice1);
                    },

                    onCreatePopup() {
                        this.newPopupName = this.newPopupName.trim();
                        if (this.newPopupName.length == 0) return;
                        if (this.bundleChoice2.length == 0) return;
                        KKCore.doCreatePopup(this.projPrefix + this.newPopupName + "Popup", this.bundleChoice2);
                    },

                    onCreatePanel() {
                        this.newPanelName = this.newPanelName.trim();
                        if (this.newPanelName.length == 0) return;
                        if (this.bundleChoice3.length == 0) return;
                        KKCore.doCreatePanel(this.projPrefix + this.newPanelName + "Panel", this.bundleChoice3);
                    },

                    onCreateWidget() {
                        this.newWidgetName = this.newWidgetName.trim();
                        if (this.newWidgetName.length == 0) return;
                        if (this.bundleChoice4.length == 0) return;
                        KKCore.doCreateWidget(this.projPrefix + this.newWidgetName + "Widget", this.bundleChoice4);
                    },

                    onCodeCount() {
                        if (this.isResCounting) return;

                        this.isCodeCounting = true;
                        let info = KKCore.getCodeCount();
                        this.codeInfo = [
                            { name: "注释行数", num: info.comment },
                            { name: "空行数", num: info.space },
                            { name: "代码行数", num: info.code },
                            { name: "总行数", num: info.total },
                        ];
                        this.isCodeCounting = false;
                        Editor.Profile.setProject(packageJSON.name, "kk.codeCount", JSON.stringify(this.codeInfo), "project");
                    },

                    onResCount() {
                        if (this.isCodeCounting) return;

                        this.isResCounting = true;
                        this.extInfo = KKCore.getResCount();
                        this.isResCounting = false;
                        Editor.Profile.setProject(packageJSON.name, "kk.resCount", JSON.stringify(this.extInfo), "project");
                    }
                },
                async beforeMount() {
                    this.allBundles = KKCore.getBundles();
                    let kkConf = await Editor.Profile.getProject(packageJSON.name, "kk", "project");
                    if (kkConf?.prefix) this.projPrefix = kkConf.prefix;
                    if (kkConf?.codeCount) this.codeInfo = JSON.parse(kkConf.codeCount);
                    if (kkConf?.resCount) this.extInfo = JSON.parse(kkConf.resCount);
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