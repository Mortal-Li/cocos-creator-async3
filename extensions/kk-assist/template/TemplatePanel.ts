/**
 * 
 * @author
 * @created
 */

import { _decorator, Component, Node, Event } from 'cc';
import { UIBase } from '../../framework/ui/UIBase';
const { ccclass, property } = _decorator;

@ccclass('NewClass')
export class NewClass extends UIBase {

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


