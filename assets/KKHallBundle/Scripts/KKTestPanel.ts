/**
 * 
 * @author lee
 * @created 2024/7/29上午11:09:43
 */

import { _decorator, Component, Node, Event } from 'cc';
import { UIBase } from '../../framework/ui/UIBase';
import kk from '../../framework/kk';
const { ccclass, property } = _decorator;

@ccclass('KKTestPanel')
export class KKTestPanel extends UIBase {

    onLoad() {
        
    }

    start() {

    }

    onBtnClick(evt: Event, name: string): void {
        switch (name) {
            case "debug":
                kk.debugMgr.switchDebugLogBtn();
                break;

            case "toast":
                
                break;

            case "table":
                
                break;

            case "http":
                
                break;

            case "socket":
                
                break;

            case "frame":
                
                break;

            case "adapter":
                
                break;
        }
    }
    
}


