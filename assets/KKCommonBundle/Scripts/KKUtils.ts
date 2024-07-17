/**
 * 
 * @author Mortal-Li
 * @created Tue Jul 16 2024 12:04:24 GMT+0800 (中国标准时间)
 */

import { KKCommonPopupConf } from "../../Boot/Scripts/KKGameUIConf"
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

}


