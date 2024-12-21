/**
 * 一些异步方法
 * @author Mortal-Li
 * @created Mon Apr 15 2024 15:29:49 GMT+0800 (中国标准时间)
 */

import { Asset, AssetManager, Canvas, Component, Tween, assetManager, log, tween } from "cc";
import kk from "../kk";

export default class AsyncHelper {
    
    /**
     * 异步等待，
     * ```
     * //等待1秒 
     * await AsyncHelper.sleepAsync(1)
     * ```
     * @param t 等待时间，秒
     * @param target 可选，利用target的scheduleOnce方法实现等待，默认为UI根节点的画布组件
     */
    static sleepAsync(t: number, target?: Component) {
        return new Promise((resolve, reject) => {
            if (!target) target = kk.godNode.getComponent(Canvas);
            target.scheduleOnce(() => {
                resolve(null);
            }, t);
        });
    }

    /**
     * 异步Tween动画
     * ```
     * await AsyncHelper.tweenAsync(node, tween().to(1, { x: 100 }))
     * ```
     * @param target 动画执行目标
     * @param twn 非永久循环动画
     */
    static tweenAsync<T extends object>(target: T, twn: Tween<T>) {
        return new Promise((resolve) => {
            tween(target).then(twn).call(resolve).start();
        })
    }

    /**
     * 异步加载Bundle
     */
    static loadBundleAsync(bundleName: string) {
        return new Promise<AssetManager.Bundle>((resolve, reject) => {
            assetManager.loadBundle(bundleName, (error: Error, bundle: AssetManager.Bundle) => {
                log("load bundle", bundleName);
                error ? reject(error) : resolve(bundle);
            });
        });
    }

    /**
     * 异步预加载Bundle中指定的单个资源
     */
    static preloadAsync(bundle: AssetManager.Bundle, path: string, type: typeof Asset, onProgress?: (cur: number, total: number)=> void) {
        return new Promise<void>((resolve, reject) => {
            // 预加载的资源的不会出现在assetManager.assets中
            bundle.preload(path, type, (cur, total, itm) => {
                if (onProgress) onProgress(cur, total);
            }, (err, res) => {
                err ? reject(err) : resolve()
            });
        });
    }

    /**
     * 异步预加载Bundle中指定文件夹中的所有资源
     */
    static preloadDirAsync(bundle: AssetManager.Bundle, path: string, onProgress?: (cur: number, total: number)=> void) {
        return new Promise<void>((resolve, reject) => {
            bundle.preloadDir(path, (cur, total, itm) => {
                if (onProgress) onProgress(cur, total);
            }, (err, res) => {
                err ? reject(err) : resolve()
            });
        });
    }

    /**
     * 异步加载Bundle中指定的单个资源
     */
    static loadAsync<T extends Asset>(bundle: AssetManager.Bundle, path: string, type: typeof Asset, onProgress?: (cur: number, total: number)=> void) {
        return new Promise<T>((resolve, reject) => {
            bundle.load(path, type, (cur, total, item) => {
                if (onProgress) onProgress(cur, total);
            }, (err: Error, asset: T) => {
                err ? reject(err) : resolve(asset);
            });
        });
    }

    /**
     * 异步分帧执行，将原本一帧内耗时较长的逻辑，放到多帧执行
     * ```
     * AsyncHelper.execPerFrameAsync(this.genItem(total), 5);
     * 
     * *genItem(total: number) {
     *      for (let i = 0; i < total; ++i) {
     *          yield this.addOne(i + 1);
     *      }
     *  }
     * 
     * addOne(i) {
     *      // do some logic
     * }
     * ```
     * @param logicGen 逻辑生成器函数
     * @param t 每帧执行时间，单位毫秒ms
     * @param target 可选，利用target的scheduleOnce方法实现跳帧，默认为UI根节点的画布组件
     */
    static execPerFrameAsync(logicGen: Generator, t: number, target?: Component) {
        if (!target) target = kk.godNode.getComponent(Canvas);
        return new Promise<void>((resolve, reject) => {
			let exec = () => {
				let startTime = Date.now();
				for (let iter = logicGen.next(); ; iter = logicGen.next()) {
					if (!iter || iter.done) {
						resolve();
						return;
					}

					if (Date.now() - startTime > t) {
						target.scheduleOnce(() => {
							exec();
						});
						return;
					}
				}
			};
			exec();
		});
    }
    
}


