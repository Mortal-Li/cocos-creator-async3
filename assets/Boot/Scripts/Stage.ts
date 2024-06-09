/**
 * 场景挂载脚本
 * @author Mortal-Li
 * @created Mon Apr 15 2024 12:17:18 GMT+0800 (中国标准时间)
 */

import { _decorator, Component, log, Node } from 'cc';
import kk from '../../framework/kk';
import { KKLayerConf } from './KKGameUIConf';
const { ccclass, property } = _decorator;

@ccclass('Stage')
export class Stage extends Component {

    onLoad() {
        
    }

    start() {
        kk.init();
        kk.uiMgr.goLayerAsync(KKLayerConf.Load);
    }
    
}

log("Welcome~ https://github.com/Mortal-Li/cocos-creator-async3");
