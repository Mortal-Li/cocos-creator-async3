/**
 * 异形屏幕适配，挂载在需要适配的节点上
 * @author Mortal-Li
 * @created Tue Apr 16 2024 22:52:16 GMT+0800 (中国标准时间)
 */

import { _decorator, Component, Enum, sys, UITransform, view, warn, Widget } from 'cc';
const { ccclass, property } = _decorator;

const AdapterMode = Enum({
    Align: 0,
    Fill: 1
});

@ccclass('SafeWidgetAdapter')
export class SafeWidgetAdapter extends Component {

    @property({
        tooltip: "是否适配顶部安全区域"
    })
    top: boolean = false;

    @property({
        tooltip: "是否适配底部安全区域"
    })
    bottom: boolean = false;

    @property({
        tooltip: "是否适配左边安全区域"
    })
    left: boolean = false;

    @property({
        tooltip: "是否适配右边安全区域"
    })
    right: boolean = false;

    @property({
        type: AdapterMode,
        tooltip: "适配模式: Align表示对齐边缘模式，支持同时多方向；Fill表示拉伸模式，只支持单方向"
    })
    mode = AdapterMode.Align;

    private originValue = {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        width: 0,
        height: 0,
    };
    private wgt: Widget = null;
 
    onLoad() {
        let T = this;

        let wgt = T.node.getComponent(Widget);
        if (!wgt) {
            warn("There is no cc.Widget.");
            return;
        }
        T.wgt = wgt;

        T.originValue.top = wgt.top;
        T.originValue.bottom = wgt.bottom;
        T.originValue.left = wgt.left;
        T.originValue.right = wgt.right;

        T.refresh = T.refresh.bind(T);
        T.refresh();
    }

    onEnable() {
        window.addEventListener("orientationchange", this.refresh);
    }

    onDisable() {
        window.removeEventListener("orientationchange", this.refresh);
    }

    refresh() {
        let T = this;

        let wgt = T.wgt;
        if (!wgt) return;

        let safeArea = sys.getSafeAreaRect();
        let visible = view.getVisibleSize();
        let top = visible.height - safeArea.height - safeArea.y;
        let bottom = safeArea.y;
        let left = safeArea.x;
        let right = visible.width - safeArea.width - safeArea.x;

        if (T.mode == AdapterMode.Align) {
            if (wgt.isAlignTop && T.top) T.wgt.top = T.originValue.top + top;
            if (wgt.isAlignBottom && T.bottom) T.wgt.bottom = T.originValue.bottom + bottom;
            if (wgt.isAlignLeft && T.left) T.wgt.left = T.originValue.left + left;
            if (wgt.isAlignRight && T.right) T.wgt.right = T.originValue.right + right;
        } else {
            let tsm = T.node.getComponent(UITransform);
            if (!T.originValue.width) {
                T.originValue.width = tsm.width;
                T.originValue.height = tsm.height;
            }
            
            if (wgt.isAlignTop && T.top) {
                tsm.width = T.originValue.height + top;
                T.wgt.updateAlignment();
                T.wgt.top = T.originValue.top;
            } else if (wgt.isAlignBottom && T.bottom) {
                tsm.height = T.originValue.height + bottom;
                T.wgt.updateAlignment();
                T.wgt.bottom = T.originValue.bottom;
            } else if (wgt.isAlignLeft && T.left) {
                tsm.width = T.originValue.width + left;
                T.wgt.updateAlignment();
                T.wgt.left = T.originValue.left;
            } else if (wgt.isAlignRight && T.right) {
                tsm.width = T.originValue.width + right;
                T.wgt.updateAlignment();
                T.wgt.right = T.originValue.right;
            }
        }
        
    }

}


