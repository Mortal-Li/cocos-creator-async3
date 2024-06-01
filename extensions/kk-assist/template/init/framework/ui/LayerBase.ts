/**
 * 
 * @author Mortal-Li
 * @created Mon Apr 15 2024 15:13:44 GMT+0800 (中国标准时间)
 */

import { _decorator } from 'cc';
import { UIBase } from './UIBase';
const { ccclass } = _decorator;

@ccclass('LayerBase')
export class LayerBase extends UIBase {

    /**
     * 当cacheMode为UICacheMode.Stay，并从其他Layer切回来时，
     * 会自动调用，以便做刷新操作
     */
    refresh() {}
    
}


