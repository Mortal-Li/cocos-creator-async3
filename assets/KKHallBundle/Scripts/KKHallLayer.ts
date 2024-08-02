/**
 * 
 * @author lee
 * @created 2024/6/19下午4:05:29
 */

import { _decorator, Component, Node, Event, Sprite, color } from 'cc';
import { LayerBase } from '../../framework/ui/LayerBase';
import { SpriteNumber } from '../../framework/widget/SpriteNumber';
import KKUtils from '../../KKCommonBundle/Scripts/KKUtils';
import KKGameData from '../../KKCommonBundle/Scripts/KKGameData';
import kk from '../../framework/kk';
import { KKLocalKey } from '../../KKCommonBundle/Scripts/KKGameConst';
import { KKHallPanelConf } from '../../Boot/Scripts/KKGameUIConf';
import { doOnceFirst } from '../../framework/tools/Decorators';
const { ccclass, property } = _decorator;

@ccclass('KKHallLayer')
export class KKHallLayer extends LayerBase {

    @property(Sprite)
    private gameSpr: Sprite = null;

    @property(Sprite)
    private testSpr: Sprite = null;

    @property(SpriteNumber)
    private sprNum: SpriteNumber = null;

    onLoad() {
        KKGameData.gem = kk.localMgr.getItemWithDefault(KKLocalKey.MyGems, 1000);
        this.sprNum.value = KKGameData.gem;
    }

    start() {
        this.switchPanel(1);
    }

    @doOnceFirst(0.8)
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

            case "test":
                this.switchPanel(1);
                break;

            case "game":
                this.switchPanel(2);
                break;
        }
    }
    
    async switchPanel(idx: number) {
        this.testSpr.color = color().fromHEX(idx == 1 ? "#26BCCA" : "#187780");
        this.gameSpr.color = color().fromHEX(idx == 2 ? "#26BCCA" : "#187780");

        let p = this.getObj("panel");
        p.destroyAllChildren();
        let pnl = await kk.uiMgr.createPanelAsync(idx == 1 ? KKHallPanelConf.Test : KKHallPanelConf.Game);
        pnl.parent = p;
    }
}


