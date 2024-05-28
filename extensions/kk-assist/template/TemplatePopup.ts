/**
 * 
 * @author
 * @created
 */

import { _decorator, Component, Node, Event } from 'cc';
import { PopupBase } from '../../framework/ui/PopupBase';
const { ccclass, property } = _decorator;

@ccclass('NewClass')
export class NewClass extends PopupBase {

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


