/**
 * 
 * @author lee
 * @created 2024/10/26下午4:29:00
 */

import { _decorator, Component, Node, Event, Label } from 'cc';
import { PopupBase } from '../../framework/ui/PopupBase';
import { httpCenter } from '../../KKCommonBundle/Scripts/http/KKHttpCenter';
import { HttpRoute } from '../../KKCommonBundle/Scripts/http/KKHttpRoute';
const { ccclass, property } = _decorator;

@ccclass('KKHttpTestPopup')
export class KKHttpTestPopup extends PopupBase {

    @property(Label)
    private descLbl: Label = null;

    onLoad() {
        
    }

    start() {
        
    }

    onBtnClick(evt: Event, name: string): void {
        switch (name) {
            case "req1":
                httpCenter.reqAsync(HttpRoute.Get).then((d) => {
                    this.descLbl.string = "Success:\n" + JSON.stringify(d);
                });
                break;

            case "req2":
                httpCenter.reqAsync(HttpRoute.Post, {
                    body: {
                        userId: 10001,
                        email: 'xxx@xxx.com'
                    }
                }).then((d) => {
                    this.descLbl.string = "Success:\n" + JSON.stringify(d.form);
                });
                break;

            case "close":
                this.close();
                break;
        }
    }
    
}


