/**
 * 
 * @author Mortal-Li
 * @created Fri Apr 26 2024 14:23:13 GMT+0800 (中国标准时间)
 */

import { sys } from "cc";
import Xor from "../tools/Xor";

const Secret_Key = "any string";

export default class LocalManager {

    getItem(key: string, encrypt: boolean = false): any {
        let v = sys.localStorage.getItem(key);
        if (v === null || v === undefined) return null;
        if (encrypt) v = Xor.xor(v, Secret_Key);
        return JSON.parse(v);
    }

    getItemWithDefault(key: string, defaultValue: any, encrypt: boolean = false): any {
        let v = sys.localStorage.getItem(key);
        if (v === null || v === undefined) {
            this.setItem(key, defaultValue, encrypt);
            return defaultValue;
        };
        if (encrypt) v = Xor.xor(v, Secret_Key);
        return JSON.parse(v);
    }

    setItem(key: string, value: any, encrypt: boolean = false): void {
        let v = JSON.stringify(value);
        if (encrypt) v = Xor.xor(v, Secret_Key);
        sys.localStorage.setItem(key, v);
    }

    removeItem(key: string) {
        sys.localStorage.removeItem(key);
    }
}


