/**
 * 打包在原生平台测试
 * @author lee
 * @created 2025/2/26 11:43:42
 */

import { _decorator, Component, Node, Event, Label, view, screen, sys } from 'cc';
import { PopupBase } from '../../framework/ui/PopupBase';
const { ccclass, property } = _decorator;

@ccclass('KKAdapterTestPopup')
export class KKAdapterTestPopup extends PopupBase {

    @property(Label)
    private infoLbl: Label = null;

    private preIdx = 0;

    onLoad() {
        
    }

    start() {
        let ds = view.getDesignResolutionSize();
        let vs = view.getVisibleSize();
        let vps = view.getVisibleSizeInPixel();
        let sws = screen.windowSize;
        let sr = sys.getSafeAreaRect();
        
        let s = `design: ${ds.width} ${ds.height}`;
        s += '\n';
        s += `visible: ${vs.width} ${vs.height}`;
        s += '\n';
        s += `visible pixel: ${vps.width} ${vps.height}`;
        s += '\n';
        s += `screen winsize: ${sws.width} ${sws.height}`;
        s += '\n';
        s += `safearea w:${sr.width} h:${sr.height} x:${sr.x} y:${sr.y}`;
        this.infoLbl.string = s;
    }

    onBtnClick(evt: Event, name: string): void {
        switch (name) {
            case "close":
                this.close();
                break;

            case "switch":
                this.getObj("top" + this.preIdx).active = false;
                this.preIdx = (this.preIdx + 1) % 3;
                this.getObj("top" + this.preIdx).active = true;
                break;

            case "safe":
                this.getObj("safeNd").active = !this.getObj("safeNd").active;
                break;
        }
    }
    
    showAnim(): void {
        
    }

    closeAnim(): void {
        this.node.destroy();
    }
}


