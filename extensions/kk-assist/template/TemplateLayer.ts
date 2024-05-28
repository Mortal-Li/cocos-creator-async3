/**
 * 
 * @author
 * @created
 */

import { _decorator, Component, Node, Event } from 'cc';
import { LayerBase } from '../../framework/ui/LayerBase';
const { ccclass, property } = _decorator;

@ccclass('NewClass')
export class NewClass extends LayerBase {

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


