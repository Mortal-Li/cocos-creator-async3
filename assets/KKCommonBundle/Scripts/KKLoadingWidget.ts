/**
 * 
 * @author lee
 * @created 2024/10/26下午5:24:51
 */

import { _decorator, Component, Node, Event, tween } from 'cc';
import { UIBase } from '../../framework/ui/UIBase';
const { ccclass, property } = _decorator;

@ccclass('KKLoadingWidget')
export class KKLoadingWidget extends UIBase {

    @property(Node)
    private loadNd: Node = null;

    onLoad() {
        this.loadNd.parent.active = false;
        this.scheduleOnce(() => {
            this.loadNd.parent.active = true;
            tween(this.loadNd).by(1, { angle: -360 }).repeatForever().start();
        }, 1);
    }
    
}


