/**
 * 
 * @author lee
 * @created 2024/12/3上午10:04:05
 */

import { _decorator, Component, Node, Event, ScrollView, instantiate, Label } from 'cc';
import { PopupBase } from '../../framework/ui/PopupBase';
import AsyncHelper from '../../framework/tools/AsyncHelper';
const { ccclass, property } = _decorator;

@ccclass('KKFramingPopup')
export class KKFramingPopup extends PopupBase {

    @property(ScrollView)
    private scv: ScrollView = null;

    private cpyObj: Node = null;

    onLoad() {
        this.cpyObj = this.getObj("box");
    }

    start() {

    }

    onBtnClick(evt: Event, name: string): void {
        switch (name) {
            case "normal":
                this.showNormal(600);
                break;

            case "frame":
                this.showFrame(600);
                break;

            case "clean":
                this.scv.content.destroyAllChildren();
                break;

            case "close":
                this.close();
                break;
        }
    }

    addOne(i: number) {
        let one = instantiate(this.cpyObj);
        one.active = true;
        one.parent = this.scv.content;
        one.getChildByName("txt").getComponent(Label).string = String(i);
    }

    showNormal(total: number) {
        this.scv.content.destroyAllChildren();
        for (let i = 0; i < total; ++i) {
            this.addOne(i + 1);
        }
    }

    showFrame(total: number) {
        this.scv.content.destroyAllChildren();
        AsyncHelper.execPerFrameAsync(this.genItem(total), 5);
    }

    *genItem(total: number) {
        for (let i = 0; i < total; ++i) {
            yield this.addOne(i + 1);
        }
    }
    
}


