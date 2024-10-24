/**
 * 
 * @author lee
 * @created 2024/8/14下午12:06:59
 */

import { _decorator, Component, Node, Event, Label, color } from 'cc';
import { PopupBase } from '../../framework/ui/PopupBase';
import KKTableView from '../../framework/widget/control/KKTableView';
const { ccclass, property } = _decorator;

@ccclass('KKTableViewPopup')
export class KKTableViewPopup extends PopupBase {

    @property(KKTableView)
    vtcTV: KKTableView = null;

    @property(KKTableView)
    hrzTV: KKTableView = null;

    numOfVtc: number = 20;
    numOfHrz: number = 12;

    onLoad() {
        
    }

    start() {
        let T = this;

        T.vtcTV.refreshData(T.numOfVtc);
        T.hrzTV.refreshData(T.numOfHrz);
    }

    onBtnClick(evt: Event, name: string): void {
        switch (name) {
            case "close":
                this.close();
                break;
        }
    }
    
    vtcUpdateCell(cell: Node, idx: number, customData: string) {
        let lbl = cell.getChildByName("ord").getComponent(Label);
        lbl.string = 'NO.' + (idx + 1);
        lbl.color = color().fromHEX(idx % 2 == 0 ? "#ffffff" : "#ff6000");
    }

    hrzUpdateCell(cell: Node, idx: number, customData: string) {
        let lbl = cell.getChildByName("ord").getComponent(Label);
        lbl.string = '' + (idx + 1);
        lbl.color = color().fromHEX(idx % 2 == 0 ? "#ffffff" : "#ff6000");
    }

    showAnim(): void {
        
    }
}


