/**
 * 
 * @author lee
 * @created 2024/6/4下午5:56:18
 */

import { _decorator, Component, Node, Event, ProgressBar, tween, assetManager, Prefab } from 'cc';
import { LayerBase } from '../../framework/ui/LayerBase';
import kk from '../../framework/kk';
import { KKBundleConf, KKCommonWidgetConf, KKLayerConf } from '../../Boot/Scripts/KKGameUIConf';
import AsyncHelper from '../../framework/tools/AsyncHelper';
import { WIDGET_PATH } from '../../framework/ui/UIConfig';
const { ccclass, property } = _decorator;

@ccclass('KKLoadLayer')
export class KKLoadLayer extends LayerBase {

    @property(ProgressBar)
    private pb: ProgressBar = null;

    onLoad() {

    }

    async start() {
        await AsyncHelper.loadBundleAsync(KKBundleConf.Common);
        await AsyncHelper.preloadAsync(assetManager.getBundle(KKBundleConf.Common), WIDGET_PATH + KKCommonWidgetConf.Loading.name, Prefab);
        await AsyncHelper.tweenAsync(this.pb, tween().to(0.1, { progress: 0.5 }));
        await kk.uiMgr.preLoadLayerAsync(KKLayerConf.Hall);
        await AsyncHelper.tweenAsync(this.pb, tween().to(0.1, { progress: 1 }));
        kk.uiMgr.goLayerAsync(KKLayerConf.Hall);
    }
    
}


