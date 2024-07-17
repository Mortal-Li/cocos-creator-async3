/**
 * 
 * @author lee
 * @created 2024/6/24上午11:01:24
 */

import { _decorator, Component, Node, Event, Label } from 'cc';
import { PopupBase } from '../../framework/ui/PopupBase';
const { ccclass, property } = _decorator;

@ccclass('KKCommonPopup')
export class KKCommonPopup extends PopupBase {

    @property(Node)
    private closeNd: Node = null;

    @property(Label)
    private btnLbl: Label = null;

    @property(Label)
    private descLbl: Label = null;

    @property(Label)
    private titleLbl: Label = null;

    onLoad() {
        let d = this.recvData;
        this.titleLbl.string = d.title ?? "Tip";
        this.descLbl.string = d.desc;
        this.btnLbl.string = d.btnTxt ?? "OK";
        this.closeNd.active = !d.hideClose;

        this.enableClickBlankToClose();
    }

    onBtnClick(evt: Event, name: string): void {
        switch (name) {
            case "close":
                this.ret = false;
                if (this.recvData.closeCall) this.recvData.closeCall();
                break;

            case "btn":
                this.ret = true;
                if (this.recvData.btnCall) this.recvData.btnCall();
                break;
        }
        this.close();
    }
    
}


