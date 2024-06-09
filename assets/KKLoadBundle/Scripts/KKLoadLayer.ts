/**
 * 
 * @author lee
 * @created 2024/6/4下午5:56:18
 */

import { _decorator, Component, Node, Event, ProgressBar } from 'cc';
import { LayerBase } from '../../framework/ui/LayerBase';
const { ccclass, property } = _decorator;

@ccclass('KKLoadLayer')
export class KKLoadLayer extends LayerBase {

    @property(ProgressBar)
    private pb: ProgressBar = null;

    onLoad() {

    }

    start() {

    }
    
}


