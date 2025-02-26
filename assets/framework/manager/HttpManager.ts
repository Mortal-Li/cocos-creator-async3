/**
 * 
 * @author Mortal-Li
 * @created Sat Apr 27 2024 14:32:13 GMT+0800 (中国标准时间)
 */

import DebugHelper from "../tools/DebugHelper";

/**
 * Http请求相关设置
 */
interface HttpOptionInterface {
    /**
     * 请求携带的数据
     */
    body?: any;
    /**
     * 超时时间 毫秒 8000(default) 
     */
    timeout?: number;
    /**
     * 默认值取决于body，body为空则是GET，否则POST
     */
    method?: string;
    /**
     * 响应类型: json(default), text, arraybuffer, blob, document
     */
    responseType?: 'json' | 'text' | 'arraybuffer' | 'blob' | 'document';
    /**
     * setRequestHeader中Content-Type的值， 默认 application/x-www-form-urlencoded
     */
    contentType?: string;
}

export default class HttpManager {

    reqAsync(url: string, option: HttpOptionInterface = {}) {
        return new Promise<any>((resolve, reject) => {
            this._request({
                url : url,
                timeout: option.timeout || 8000,
                responseType: option.responseType || 'json',
                contentType: option.contentType || 'application/x-www-form-urlencoded',
                method: option.method || (option.body ? 'POST' : 'GET'),
                body: option.body
            }, resolve, reject);
        });
    }

    private _request(params, resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.timeout = params.timeout;
        xhr.responseType = params.responseType;
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    DebugHelper.log({ url: params.url, body: params.body, recv: xhr.response });
                    resolve(xhr.response);
                } else {
                    reject('Please Check Network! ' + xhr.status);
                }
            }
        }
        xhr.ontimeout = () => {
            reject('Time Out');
        };
        xhr.onabort = () => {
            reject('Network Abort');
        };
        xhr.onerror = () => {
            reject('Network Error');
        };
        xhr.open(params.method, params.url, true);

        let sendData = null;
        if (params.body) {
            xhr.setRequestHeader('Content-Type', params.contentType);

            if (params.contentType == 'application/x-www-form-urlencoded') {
                let formData = [];
                for (let key in params.body) {
                    formData.push(''.concat(key, '=', params.body[key]));
                }
                sendData = formData.join('&');
            } else if (params.contentType == 'application/json') {
                sendData = JSON.stringify(params.body);
            } else {
                sendData = params.body;
            }
        }

        xhr.send(sendData);
    }
}
