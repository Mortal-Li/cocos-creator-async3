/**
 * 
 * @author Mortal-Li
 * @created Mon Apr 15 2024 12:27:36 GMT+0800 (中国标准时间)
 */

import { find, Node } from "cc";
import UIManager from "./manager/UIManager";


const kk = {
    uiMgr: new UIManager(),
    
    godNode: <Node> null,

    init() {
        kk.godNode = find("Canvas");
    }
};

export default kk;

