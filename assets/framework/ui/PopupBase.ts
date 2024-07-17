/**
 * 
 * @author Mortal-Li
 * @created Mon Apr 15 2024 15:16:08 GMT+0800 (中国标准时间)
 */

import { Node, UIOpacity, _decorator, tween, v3, EventTouch, UITransform, Widget } from 'cc';
import { UIBase } from './UIBase';
import kk from '../kk';
const { ccclass } = _decorator;

@ccclass('PopupBase')
export class PopupBase extends UIBase {

    /**
     * 关闭弹窗返回的数据
     */
    ret?: any;

    onDestroyCall: (value?: any) => void = () => {};

    onDestroy() {
        kk.uiMgr._autoRemovePopup(this.node.parent);
        this.onDestroyCall(this.ret);
        super.onDestroy();
    }

    /**
     * 关闭弹窗请调用此方法
     */
    close() {
        this.closeAnim();
    }

    /**
     * 打开弹窗的动画，如果不需要或另外实现则子类中覆盖
     */
    showAnim() {
        this.node.getComponent(Widget).updateAlignment();   //fix: scale cause widget failed
        this.node.setScale(0, 0, 1);
        tween(this.node)
            .to(0.2, { scale: v3(1, 1, 1) }, { easing: "backOut" })
            .start();
    }

    /**
     * 关闭弹窗的动画，如果不需要或另外实现则子类中覆盖并调用destroy
     */
    closeAnim() {
        tween(this.node).to(0.2, { scale: v3(0, 0, 1) }, { easing: "backIn" }).call(()=>{ this.node.destroy(); }).start();
    }

    /**
     * 设置黑色背景透明度，默认180
     */
    setDarkBgOpacity(opacity: number) {
        this.node.parent.getChildByName("dark").getComponent(UIOpacity).opacity = opacity;
    }

    /**
     * 点击非nds数组中的对象，则关闭弹窗，需手动调用开启;
     * 可以不传参数，表示使用第一个子节点来判断;
     * 其他触摸控件如Button、Toggle等会优先响应，不用加到数组
     */
    enableClickBlankToClose(nds?: Node[]) {
        if ((!nds || nds.length == 0) && this.node.children.length > 0) nds = [this.node.children[0]];

        this.node.on(Node.EventType.TOUCH_END, (evt: EventTouch) => {
            let startPos = evt.getUIStartLocation();
            let endPos = evt.getUILocation();
            let subPos = endPos.subtract(startPos);
            if (Math.abs(subPos.x) < 15 && Math.abs(subPos.y) < 15) {
                let needClose = true;
                for (let i = 0; i < nds.length; ++i) {
                    if (nds[i].getComponent(UITransform).getBoundingBoxToWorld().contains(startPos)) {
                        needClose = false;
                        break;
                    }
                }
                
                needClose && this.close();
            }
        }, this);
    }
    
}


