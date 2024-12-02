/**
 * 
 * @author lee
 * @created 2024/12/2上午11:09:26
 */

import { _decorator, Component, Node, Event, EditBox, Label, UITransform } from 'cc';
import { PopupBase } from '../../framework/ui/PopupBase';
import { socketCenter } from '../../KKCommonBundle/Scripts/socket/KKSocketCenter';
import { CMDID } from '../../KKCommonBundle/Scripts/socket/KKCMDID';
import CocosHelper from '../../framework/tools/CocosHelper';
const { ccclass, property } = _decorator;

@ccclass('KKSocketTestPopup')
export class KKSocketTestPopup extends PopupBase {

    @property(Node)
    private loNd: Node = null;

    @property(EditBox)
    private eb2: EditBox = null;

    @property(EditBox)
    private eb1: EditBox = null;

    onLoad() {
        
    }

    start() {

    }

    async onBtnClick(evt: Event, name: string) {
        switch (name) {
            case "close":
                socketCenter.clear();
                this.close();
                break;

            case "conn":
                if (this.eb1.string.length > 0) {console.log(this.eb1.string);
                    await socketCenter.connect(this.eb1.string);
                    let nd = new Node();
                    CocosHelper.addLabel(nd, {
                        string: "Connected!",
                        horizontalAlign: Label.HorizontalAlign.LEFT,
                        overflow: Label.Overflow.RESIZE_HEIGHT
                    });
                    nd.getComponent(UITransform).width = 680;
                    nd.parent = this.loNd;
                }
                break;

            case "send":
                if (this.eb2.string.length > 0) {
                    let ret = await socketCenter.req(CMDID.CMD_HELLO, this.eb2.string);
                    let nd = new Node();
                    CocosHelper.addLabel(nd, {
                        string: "response: " + ret,
                        horizontalAlign: Label.HorizontalAlign.LEFT,
                        overflow: Label.Overflow.RESIZE_HEIGHT
                    });
                    nd.getComponent(UITransform).width = 680;
                    nd.parent = this.loNd;
                }
                break;
        }
    }
    
}


