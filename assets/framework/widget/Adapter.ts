/**
 * 
 * @author Mortal-Li
 * @created Mon Apr 15 2024 14:15:57 GMT+0800 (中国标准时间)
 */

import { _decorator, Component, Node, ResolutionPolicy, screen, view } from 'cc';
const { ccclass } = _decorator;

@ccclass('Adapter')
export class Adapter extends Component {

    onLoad() {
        this.node.on(Node.EventType.SIZE_CHANGED, this.onResize, this);
        this.onResize();
    }

    onDestroy() {
        this.node.off(Node.EventType.SIZE_CHANGED, this.onResize, this);
    }

    onResize() {
        let drs = view.getDesignResolutionSize();
        let fs = screen.windowSize;

        if (fs.height / fs.width < drs.height / drs.width) {
            view.setDesignResolutionSize(drs.height * fs.width / fs.height, drs.height, ResolutionPolicy.FIXED_HEIGHT);
        } else {
            view.setDesignResolutionSize(drs.width, drs.width * fs.height / fs.width, ResolutionPolicy.FIXED_WIDTH);
        }
    }
    
}


