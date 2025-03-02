/**
 * 
 * @author lee
 * @created 2024/7/29上午11:09:43
 */

import { _decorator, Component, Node, Event } from 'cc';
import { UIBase } from '../../framework/ui/UIBase';
import kk from '../../framework/kk';
import KKUtils from '../../KKCommonBundle/Scripts/KKUtils';
import { KKHallPopupConf } from '../../Boot/Scripts/KKGameUIConf';
import DebugHelper from '../../framework/tools/DebugHelper';
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
                DebugHelper.switchDebugLogBtn();
                break;

            case "toast":
                KKUtils.showToast("Hello~");
                break;

            case "table":
                kk.uiMgr.showPopupAsync(KKHallPopupConf.TableView);
                break;

            case "http":
                kk.uiMgr.showPopupAsync(KKHallPopupConf.HttpTest);
                break;

            case "socket":
                kk.uiMgr.showPopupAsync(KKHallPopupConf.SocketTest);
                break;

            case "frame":
                kk.uiMgr.showPopupAsync(KKHallPopupConf.Framing);
                break;

            case "adapter":
                kk.uiMgr.showPopupAsync(KKHallPopupConf.AdapterTest);
                break;
        }
    }
    
}


