/**
 * 
 * @author lee
 * @created 2024/6/19下午4:05:29
 */

import { _decorator, Component, Node, Event } from 'cc';
import { LayerBase } from '../../framework/ui/LayerBase';
import { SpriteNumber } from '../../framework/widget/SpriteNumber';
import KKUtils from '../../KKCommonBundle/Scripts/KKUtils';
import KKGameData from '../../KKCommonBundle/Scripts/KKGameData';
import kk from '../../framework/kk';
import { KKLocalKey } from '../../KKCommonBundle/Scripts/KKGameConst';
const { ccclass, property } = _decorator;

@ccclass('KKHallLayer')
export class KKHallLayer extends LayerBase {

    @property(SpriteNumber)
    private sprNum: SpriteNumber = null;

    onLoad() {
        KKGameData.gem = kk.localMgr.getItemWithDefault(KKLocalKey.MyGems, 1000);
        this.sprNum.value = KKGameData.gem;
    }

    start() {

    }

    onBtnClick(evt: Event, name: string): void {
        switch (name) {
            case "add":
                KKUtils.showCommonPopup({
                    desc: "Add 100 Gems",
                    btnCall: () => {
                        KKGameData.gem += 100;
                        kk.localMgr.setItem(KKLocalKey.MyGems, KKGameData.gem);
                        this.sprNum.value = KKGameData.gem;
                    }
                });
                break;
        }
    }
    
}


