/**
 * 
 * @author Mortal-Li
 * @created Mon Dec 02 2024 11:34:55 GMT+0800 (中国标准时间)
 */

import DebugHelper from "db://assets/framework/tools/DebugHelper";
import kk from "../../../framework/kk";
import { CMDID } from "./KKCMDID";

class KKSocketCenter {

    private tips = {
        showConnecting: (isShow: boolean) => {
            
        },
        showReconnecting: (isShow: boolean) => {
            
        },
        showRequesting: (isShow: boolean) => {
            
        }
    }

    async connect(url: string) {
        await kk.socketMgr.connectAsync({
            url: url,
            getHeartbeat: () => {
                DebugHelper.log(">>> heartbeat")
                return "";
            },
            parseNetData: (data: any) => {
                return {
                    cmd: CMDID.CMD_HELLO,
                    content: data
                }
            },
            tips: this.tips,
            manualReconnect: () => {
            
            }
        });
    }

    clear() {
        kk.socketMgr.close(true);
    }

    on(cmd: number, callback: (data: any) => void, target: any) {
        kk.socketMgr.on(cmd, callback, target);
    }

    off(cmd: number, callback: (data: any) => void, target: any) {
        kk.socketMgr.off(cmd, callback, target);
    }

    req(cmd: number, args?: any) {
        let content: string = "";

        switch (cmd) {
            case CMDID.CMD_HELLO:
                content = args;
                break;
        }
        DebugHelper.log("---> send ", cmd, content);
        return kk.socketMgr.reqAsync(cmd, JSON.stringify({
            cmd: cmd,
            data: content
        }));
    }
}

export const socketCenter = new KKSocketCenter();

