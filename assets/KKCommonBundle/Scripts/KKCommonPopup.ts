/**
 * 
 * @author lee
 * @created 2024/6/24上午11:01:24
 */

import { _decorator, Component, Node, Event } from 'cc';
import { PopupBase } from '../../framework/ui/PopupBase';
const { ccclass, property } = _decorator;

@ccclass('KKCommonPopup')
export class KKCommonPopup extends PopupBase {

    onLoad() {
        
    }

    start() {

    }

    onBtnClick(evt: Event, name: string): void {
        switch (name) {
            case "":
                
                break;
        }
    }
    
}


