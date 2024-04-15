/**
 * UI基类
 * @author Mortal-Li
 * @created Mon Apr 15 2024 14:58:02 GMT+0800 (中国标准时间)
 */

import { _decorator, Asset, Component, Event, Node, warn } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UIBase')
export class UIBase extends Component {

    /**
     * 动态加载的资源
     */
    refAssets: Asset[] = [];

    /**
     * 传递进来的数据
     */
    recvData?: any;

    /**
     * 按钮点击监听
     */
    onBtnClick(evt: Event, name: string) {
        
    }

    onDestroy() {
        this.refAssets.forEach((ast, i)=>{
            ast.decRef();
        });
        this.refAssets = null;
    }

    /**
     * 在UI树下检索对应的节点或组件
     * ```
     * this.getObj("bg.txt");
     * this.getObj("bg.btn.txt", Label);
     * this.getObj(nodeName, "icon.name", Label)
     * ```
     * @param pathStr "node1name.node2name.node3name"
     * @param parentNode 从哪个节点开始检索，默认根节点
     * @param type 组件类型，可选
     */
    getObj<T = Node>(pathStr: string, type?: {prototype: T}) : T;
    getObj<T = Node>(parentNode: Node, pathStr: string, type?: {prototype: T}) : T;
    getObj(param1: any, param2?: any, param3?: any) : any {
        let p: Node;
        let pathStr: string;
        let typ: any;
        if (typeof(param1) === "string") {
            p = this.node;
            pathStr = param1;
            typ = param2;
        } else {
            p = param1;
            pathStr = param2;
            typ = param3;
        }

        let strs = pathStr.split('.');
        for (let i = 0; i < strs.length; ++i) {
            p = p.getChildByName(strs[i]);
            if (!p) {
                if (strs.length > 1) warn("Child is NULL!", strs[i]);
                return null;
            }
        }

        if (typ) return p.getComponent(typ);
        else return p;
    }
    
}


