/**
 * 通过限制节点的宽或高来限制节点的显示大小
 * @author Mortal-Li
 * @created Tue Apr 16 2024 21:28:37 GMT+0800 (中国标准时间)
 */

import { _decorator, CCBoolean, CCInteger, Component, Node, UITransform } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('NodeSizeLimit')
export class NodeSizeLimit extends Component {

    @property(CCInteger)
    len: number = 9999;

    @property(CCBoolean)
    isWidth: boolean = true;

    onLoad () {
        this.node.on(Node.EventType.SIZE_CHANGED, this.onResize, this);
        this.onResize();
    }

    onResize () {
        let tsm = this.node.getComponent(UITransform);
        let curLen = this.isWidth ? tsm.width : tsm.height;
        if (curLen > this.len) {
            let s = this.len / curLen;
            this.node.setScale(s, s, s);
        } else {
            this.node.setScale(1, 1, 1);
        }
    }
    
}


