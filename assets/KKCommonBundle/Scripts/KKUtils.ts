/**
 * 
 * @author Mortal-Li
 * @created Tue Jul 16 2024 12:04:24 GMT+0800 (中国标准时间)
 */

import { Node, v3 } from "cc";
import { KKCommonPopupConf, KKCommonWidgetConf } from "../../Boot/Scripts/KKGameUIConf"
import kk from "../../framework/kk"


export default class KKUtils {

    static showCommonPopup(options: {
        desc: string,
        title?: string,
        btnTxt?: string,
        hideClose?: boolean,
        closeCall?: Function,
        btnCall?: Function
    }) {
        return kk.uiMgr.showPopupAsync(KKCommonPopupConf.Common, options);
    }

    static showToast(msg: string) {
        kk.uiMgr.createWidgetAsync(KKCommonWidgetConf.Toast, { msg: msg }).then((nd: Node) => {
            kk.godNode.children.forEach((nd, i) => {
                if (nd.name == KKCommonWidgetConf.Toast.name) nd.position = v3(nd.position.x, nd.position.y + 110, nd.position.z);
            });
            nd.parent = kk.godNode;
        });
    }
}


