/**
 * 管理所有UI
 * @author Mortal-Li
 * @created Mon Apr 15 2024 15:18:34 GMT+0800 (中国标准时间)
 */

import { Prefab, assetManager, Node, BlockInputEvents, Sprite, instantiate, UIOpacity, UITransform, SpriteFrame } from "cc";
import { LayerBase } from "../ui/LayerBase";
import { IUIConfig, LAYER_PATH, PANEL_PATH, POPUP_PATH, UICacheMode, WIDGET_PATH } from "../ui/UIConfig";
import { PopupBase } from "../ui/PopupBase";
import { UIBase } from "../ui/UIBase";
import AsyncHelper from "../tools/AsyncHelper";
import CocosHelper from "../tools/CocosHelper";
import DebugHelper from "../tools/DebugHelper";


export default class UIManager {

    //////////////////////////////////////////// Layer ////////////////////////////////////////////
    private _curLayerConf: IUIConfig = null;
    private _root: Node = null;

    init() {
        this._root = CocosHelper.getRoot();
    }

    root() {
        return this._root;
    }

    getCurLayerConf() {
        return this._curLayerConf;
    }

    getCurLayer() {
        return this._root.getChildByName(this._curLayerConf.name);
    }
    
    /**
     * 切换Layer
     * @param newConf 要切换的Layer配置
     * @param data 传给Layer的数据，可选
     */
    async goLayerAsync(newConf: IUIConfig, data?: any) {
        let T = this;

        let preConf = T._curLayerConf;
        if (preConf && preConf.name === newConf.name) {
            T.resetCurLayerAsync(data);
            return ;
        }

        T._curLayerConf = newConf;

        if (newConf.cacheMode == UICacheMode.Stay) {
            let layer = this._root.getChildByName(newConf.name);
            if (layer) {
                layer.active = true;
                let scptName = newConf.script ? newConf.script : newConf.name;
                let scpt = layer.getComponent(scptName) as LayerBase;
                scpt.recvData = data;
                scpt.refresh();
                DebugHelper.log("show Layer", newConf.name);
                T._clearLayer(preConf);
                return ;
            }
        }

        let layer = await T._genUIBaseAsync(newConf, LAYER_PATH, data);
        layer.parent = this._root;
        DebugHelper.log("create Layer", newConf.name);

        T._clearLayer(preConf);
    }

    /**
     * 刷新、重置当前Layer
     * @param data 传给Layer的数据，可选
     */
    async resetCurLayerAsync(data?: any) {
        let T = this;

        let conf = T._curLayerConf;
        if (conf) {
            if (conf.cacheMode == UICacheMode.Stay) {
                let layer = this._root.getChildByName(conf.name);
                let scptName = conf.script ? conf.script : conf.name;
                let scpt = layer.getComponent(scptName) as LayerBase;
                scpt.recvData = data;
                scpt.refresh();
                DebugHelper.log("refresh Layer", conf.name);
            } else {
                let delLayer = this._root.getChildByName(conf.name);
                delLayer.name = "removed";

                let layer = await T._genUIBaseAsync(conf, LAYER_PATH, data);
                layer.parent = this._root;
                delLayer.destroy();
                
                DebugHelper.log("reset Layer", conf.name);
            }

        }

    }

    /**
     * 预加载指定的layer
     */
    async preLoadLayerAsync(conf: IUIConfig, onProgress?: (cur: number, total: number) => void) {
        let bundle = assetManager.getBundle(conf.bundle);
        if (!bundle) bundle = await AsyncHelper.loadBundleAsync(conf.bundle);
        await AsyncHelper.preloadAsync(bundle, LAYER_PATH + conf.name, Prefab, onProgress);
    }

    private _clearLayer(preConf: IUIConfig) {
        if (preConf) {
            let layer = this._root.getChildByName(preConf.name);
            if (preConf.cacheMode == UICacheMode.Stay) {
                layer.active = false;
                DebugHelper.log("hide Layer", preConf.name);
            } else {
                layer.destroy();
                DebugHelper.log("destroy Layer", preConf.name);
            }
        }
    }

    //////////////////////////////////////////// Popup ////////////////////////////////////////////

    private pureBanFrm: SpriteFrame = null;
    
    /**
     * 显示对应配置的弹窗，可返回弹窗界面中用户设置的数据
     * @param conf 要显示的弹窗配置
     * @param data 传给弹窗的数据，可选
     * @returns 当关闭弹窗时，可返回弹窗脚本中用户设置的任意数据
     */
    async showPopupAsync(conf: IUIConfig, data?: any) {
        let T = this;

        let nd = new Node(conf.name);
        T.getCurLayer().addChild(nd);
        nd.addComponent(BlockInputEvents);
        
        CocosHelper.addWidget(nd, { left: 0, right: 0, top: 0, bottom: 0 });

        let darkBg = new Node("dark");
        if (!T.pureBanFrm) {
            T.pureBanFrm = CocosHelper.genPureColorSpriteFrame();
            T.pureBanFrm.addRef();
        }
        darkBg.addComponent(Sprite).spriteFrame = T.pureBanFrm;
        darkBg.addComponent(UIOpacity).opacity = 180;
        darkBg.parent = nd;
        CocosHelper.addWidget(darkBg, { left: 0, right: 0, top: 0, bottom: 0 });

        let popup = await T._genUIBaseAsync(conf, POPUP_PATH, data);
        let scptName = conf.script ? conf.script : conf.name;
        let scpt = popup.getComponent(scptName) as PopupBase;
        popup.parent = nd;
        scpt.showAnim();
        DebugHelper.log("show Popup", conf.name);

        return new Promise<any>((resolve, reject) => {
            scpt.onDestroyCall = resolve;
        });
    }

    /**
     * 根据配置获取已展示的弹窗，没有则返回null
     */
    getPopup(popupConf: IUIConfig, layerConf: IUIConfig = null) {
        if (!layerConf) layerConf = this._curLayerConf;
        
        let layer = this._root.getChildByName(layerConf.name);
        if (layer) {
            return layer.getChildByName(popupConf.name);
        }

        return null;
    }

    /**
     * 关闭所有已展示的弹窗
     */
    closeAllPopup() {
        let layer = this._root.getChildByName(this._curLayerConf.name);
        if (layer) {
            layer.children.forEach((nd, i) => {
                if (nd.name.endsWith("Popup")) {
                    nd.destroy();
                }
            });
        }
    }

    _autoRemovePopup(p: Node) {
        p?.destroy();
        DebugHelper.log("close Popup", p.name);
    }

    //////////////////////////////////////////// Panel ////////////////////////////////////////////
    async createPanelAsync(conf: IUIConfig, data?: any) {
        return await this._genUIBaseAsync(conf, PANEL_PATH, data);
    }

    //////////////////////////////////////////// Widget ////////////////////////////////////////////
    async createWidgetAsync(conf: IUIConfig, data?: any) {
        return await this._genUIBaseAsync(conf, WIDGET_PATH, data);
    }

    //////////////////////////////////////////// Common //////////////////////////////////////////// 
    private async _genUIBaseAsync(conf: IUIConfig, prefixPath: string, data?: any) {
        let bundle = assetManager.getBundle(conf.bundle);
        if (!bundle) bundle = await AsyncHelper.loadBundleAsync(conf.bundle);

        let prefab = await AsyncHelper.loadAsync<Prefab>(bundle, prefixPath + conf.name, Prefab);
        let node = instantiate(prefab);
        let scptName = conf.script ? conf.script : conf.name;
        let scpt = node.getComponent(scptName) as UIBase;
        if (!scpt) scpt = node.addComponent(UIBase);
        scpt.recvData = data;

        if (conf.cacheMode == UICacheMode.Cache) {
            if (prefab.refCount == 0) prefab.addRef();
        } else {
            prefab.addRef();
            scpt.refAssets.push(prefab);
        }

        return node;
    }

    //////////////////////////////////////////// Other ////////////////////////////////////////////
    /**
     * 屏蔽UI触摸
     */
    banTouch() {
        let ban = this._root.getChildByName("_ban");
        if (!ban) {
            let node = new Node("_ban");
            node.addComponent(UITransform).setContentSize(this._root.getComponent(UITransform).contentSize);
            this._root.addChild(node);
            node.addComponent(BlockInputEvents);
        }
    }

    /**
     * 恢复UI触摸
     */
    unbanTouch() {
        let ban = this._root.getChildByName("_ban");
        if (ban) ban.destroy();
    }
}


