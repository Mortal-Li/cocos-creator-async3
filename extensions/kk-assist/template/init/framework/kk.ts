/**
 * https://github.com/Mortal-Li/cocos-creator-async3
 * @author Mortal-Li
 * @created Mon Apr 15 2024 12:27:36 GMT+0800 (中国标准时间)
 */

import UIManager from "./manager/UIManager";
import LocalManager from "./manager/LocalManager";
import SoundManager from "./manager/SoundManager";
import EventManager from "./manager/EventManager";
import HttpManager from "./manager/HttpManager";
import SocketManager from "./manager/socket/SocketManager";

const kk = {
    uiMgr: new UIManager(),
    localMgr: new LocalManager(),
    soundMgr: new SoundManager(),
    eventMgr: new EventManager(),
    
    httpMgr: new HttpManager(),
    socketMgr: new SocketManager(),

    init() {
        kk.uiMgr.init();
    }
};

export default kk;

