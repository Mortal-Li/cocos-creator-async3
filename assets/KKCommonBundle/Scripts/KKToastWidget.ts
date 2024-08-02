/**
 * 
 * @author lee
 * @created 2024/8/2下午3:23:38
 */

import { _decorator, Component, Node, Event, Label, tween, UIOpacity } from 'cc';
import { UIBase } from '../../framework/ui/UIBase';
const { ccclass, property } = _decorator;

@ccclass('KKToastWidget')
export class KKToastWidget extends UIBase {
    
    @property(UIOpacity)
    private ndOpc: UIOpacity = null;
    
    @property(Label)
    private lbl: Label = null;

    onLoad() {
        this.lbl.string = this.recvData.msg;
        tween(this.ndOpc).to(0.5, { opacity: 255 }).delay(2).to(0.5, { opacity: 0 }).call(() => {
            this.node.destroy();
        }).start();
    }
    
}


