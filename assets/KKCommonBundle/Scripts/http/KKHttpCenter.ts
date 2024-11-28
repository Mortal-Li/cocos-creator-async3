/**
 * 
 * @author Mortal-Li
 * @created Thu Oct 24 2024 16:26:50 GMT+0800 (中国标准时间)
 */

import kk from "../../../framework/kk";
import KKUtils from "../KKUtils";

const DefaultBaseURL = "https://httpbin.org/";

/**
 * 请求失败时的处理方案
 */
enum HttpFailType {
    /**
     * 什么也不处理
     */
    Nothing = 0,
    /**
     * 用Toast提示错误
     */
    Toast,
    /**
     * 用弹窗提示错误，可手动重新请求
     */
    Popup
};

/**
 * 请求相关设置
 */
interface ReqOptionInterface {
    /**
     * 请求携带的数据，默认数据为空或自定义
     */
    body?: any;
    /**
     * 网络请求地址，默认DefaultBaseURL
     */
    baseUrl?: string;
    /**
     * 请求超时时间，默认8s
     */
    timeout?: number;
    /**
     * 默认值为空字符串''
     */
    method?: string;
    /**
     * 是否显示loading 默认true
     */
    loading?: boolean;
    /**
     * 请求失败时的处理方案, 默认FailType.Popup
     */
    failType?: HttpFailType
}

class KKHttpCenter {
    readonly FailType = HttpFailType;

    reqAsync(route: string, option?: ReqOptionInterface) {
        if (!option) option = {};

        const opt: ReqOptionInterface = {
            body: option.body,
            baseUrl: option.baseUrl ?? DefaultBaseURL,
            timeout: option.timeout ?? 8,
            method: option.method ?? '',
            loading: option.loading ?? true,
            failType: option.failType ?? HttpFailType.Popup
        };

        if (opt.loading) {
            KKUtils.showLoading(true);
        }
        return this._reqAsync(opt.baseUrl + route, opt);
    }

    private _reqAsync(url: string, opt: ReqOptionInterface) {
        return new Promise<any>((resolve, reject) => {
            kk.httpMgr.reqAsync(url, {
                body: opt.body,
                timeout: opt.timeout * 1000,
                method: opt.method
            }).then((recv: any) => {
                if (opt.loading) {
                    KKUtils.showLoading(false);
                }

                resolve(recv);
            }).catch((err?: any) => {
                if (opt.loading) {
                    KKUtils.showLoading(false);
                }

                if (opt.failType == HttpFailType.Nothing) {
                    reject(err);
                } else if (opt.failType == HttpFailType.Toast) {
                    KKUtils.showToast(err);
                    reject(err);
                } else if (opt.failType == HttpFailType.Popup) {
                    KKUtils.showCommonPopup({
                        title: "Whoops!",
                        desc: "Network Connection Error!Do you want to try again?",
                        btnTxt: "Retry"
                    }).then((isRetry) => {
                        if (isRetry) {
                            this._reqAsync(url, opt).then(resolve).catch(reject);
                        } else {
                            reject(err);
                        }
                    });
                }
            });
        });
    }
}

export const httpCenter = new KKHttpCenter();