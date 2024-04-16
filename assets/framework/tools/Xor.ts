/**
 * 简单的异或加密
 * @author Mortal-Li
 * @created Tue Apr 16 2024 18:43:12 GMT+0800 (中国标准时间)
 */

export default class Xor {

    static xor(data: string, key: string): string {
        let base = 0;
        for (let i = key.length - 1; i >= 0; --i) {
            base += key.charCodeAt(i);
        }
        let ret = '';
        for (let i = data.length - 1; i >= 0; --i) {
            let x = data.charCodeAt(i) ^ base;
            ret += String.fromCharCode(x);
        }
        return ret;
    }
}

