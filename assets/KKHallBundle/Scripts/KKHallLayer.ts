/**
 * 
 * @author lee
 * @created 2024/6/19下午4:05:29
 */

import { _decorator, Component, Node, Event } from 'cc';
import { LayerBase } from '../../framework/ui/LayerBase';
import { SpriteNumber } from '../../framework/widget/SpriteNumber';
const { ccclass, property } = _decorator;

@ccclass('KKHallLayer')
export class KKHallLayer extends LayerBase {

    @property(SpriteNumber)
    private sprNum: SpriteNumber = null;

    onLoad() {
        this.sprNum.value = 1000;
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


