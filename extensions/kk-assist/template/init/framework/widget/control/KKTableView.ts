/**
 * KKTableView是对ScrollView的性能优化版
 * 将KKTableView.prefab拖拽到编辑器使用
 * @author Mortal-Li
 * @created 2024-09-19 17:04:00
 */

import { _decorator, Component, error, EventHandler, instantiate, Node, ScrollView, UITransform, Vec2, warn } from 'cc';
const { ccclass, property } = _decorator;

@ccclass
export default class KKTableView extends ScrollView {

    @property(Node)
    private cellNode: Node = null;

    @property({
        type: EventHandler,
        tooltip: "Data-UI update callback-(cell:Node, idx:number, custom:string)"
    })
    updateCell: EventHandler = new EventHandler();

    @property({
        tooltip: "spacing between cells"
    })
    private spacing: number = 0;

    private preOffset: Vec2 = null;
    private cellPool: Node[] = [];

    private headHideNum = 0;
    private tailHideNum = 0;
    private cellNum = 0;

    private cellLen = 0;

    onLoad() {
        let T = this;

        if (!T.vertical && !T.horizontal ||
            T.vertical && T.horizontal) {
            warn("TableView has wrong direction!");
            return;
        }

        T.cellNode.active = false;
        
        T.node.on(ScrollView.EventType.SCROLL_BEGAN, T.onScrollBegan, T);
        T.node.on(ScrollView.EventType.SCROLLING, T.onScrolling, T);
    }

    /**
     * 当数据准备好后，调用此方法刷新数据以更新UI
     * @param numOfCells 数据量
     */
    refreshData(numOfCells: number) {
        let T = this;

        if (numOfCells < 0) {
            error("wrong number, must >= 0!");
            return;
        }

        let preNum = T.cellNum;
        for (let i = 0; i < preNum; ++i) {
            T._removeCell(i);
        }

        T.cellNum = numOfCells;

        if (T.vertical) {
            T.cellLen = T.cellNode.getComponent(UITransform).height + T.spacing;
            T.content.getComponent(UITransform).height = T.cellLen * numOfCells;
        } else {
            T.cellLen = T.cellNode.getComponent(UITransform).width + T.spacing;
            T.content.getComponent(UITransform).width = T.cellLen * numOfCells;
        }

        let viewLen = T.vertical ? T.content.parent.getComponent(UITransform).height : T.content.parent.getComponent(UITransform).width;
        if (preNum == 0) {
            let len = Math.min(Math.ceil(viewLen / T.cellLen), numOfCells);
            
            T.headHideNum = 0;
            T.tailHideNum = numOfCells - len;
            for (let i = 0; i < len; ++i) {
                T._addNewCell(i);
            }

            if (T.vertical) super.scrollToTop();
            else super.scrollToLeft();
            T.preOffset = T.getScrollOffset();
        } else {
            T.stopAutoScroll();
            T._wrapOffset(T.preOffset);

            let dis = T.vertical ? T.preOffset.y : -T.preOffset.x;
            let num = Math.ceil((dis + viewLen) / T.cellLen);
            num = Math.min(num, numOfCells);
            T.tailHideNum = numOfCells - num;
            T.headHideNum = Math.floor(dis / T.cellLen);
            for (let i = T.headHideNum; i < num; ++i) {
                T._addNewCell(i);
            }
        }
    }

    //@override
    scrollToTop(timeInSecond?: number, attenuated?: boolean) {
        this.stopAutoScroll();
        super.scrollToTop(timeInSecond, attenuated);
        this._checkScroll(timeInSecond);
    }

    //@override
    scrollToBottom(timeInSecond?: number, attenuated?: boolean) {
        this.stopAutoScroll();
        super.scrollToBottom(timeInSecond, attenuated);
        this._checkScroll(timeInSecond);
    }

    //@override
    scrollToLeft(timeInSecond?: number, attenuated?: boolean) {
        this.stopAutoScroll();
        super.scrollToLeft(timeInSecond, attenuated);
        this._checkScroll(timeInSecond);
    }

    //@override
    scrollToRight(timeInSecond?: number, attenuated?: boolean) {
        this.stopAutoScroll();
        super.scrollToRight(timeInSecond, attenuated);
        this._checkScroll(timeInSecond);
    }

    _checkScroll(timeInSecond: number) {
        let T = this;
        if (!timeInSecond) {
            T.preOffset = T.getScrollOffset();
            T.refreshData(T.cellNum);
        }
    }

    /**
     * @override
     * 注意，这里的offset，不管是垂直方向还是水平方向，符号都是正(+)
     */
    scrollToOffset(offset: Vec2, timeInSecond?: number, attenuated?: boolean) {
        let T = this;
        T.stopAutoScroll();
        super.scrollToOffset(offset, timeInSecond, attenuated);
        this._checkScroll(timeInSecond);
    }

    _updateCell(cell: Node, idx: number) {
        let T = this;
        
        if (T.updateCell.target && T.updateCell.handler) {
            T.updateCell.emit([cell, idx]);
        }
    }

    _getCell() {
        let T = this;

        let cell: Node = null;
        if (T.cellPool.length > 0) {
            cell = T.cellPool.pop();
        } else {
            cell = instantiate(T.cellNode);
            cell.active = true;
        }
        cell.parent = T.content;
        return cell;
    }

    _removeCell(idx: number) {
        let T = this;

        let cell = T.content.getChildByName(String(idx));
        if (cell) {
            cell.removeFromParent();
            T.cellPool.push(cell);
        }
    }

    _setCellPosWithIdx(cell: Node, idx: number) {
        let T = this;

        let pos = cell.getPosition();
        if (T.vertical) pos.y = 0 - T.cellLen / 2 * (idx * 2 + 1) + T.spacing / 2;
        else pos.x = T.cellLen / 2 * (idx * 2 + 1) - T.spacing / 2;
        cell.setPosition(pos);
    }

    _checkCellWithIdx(idx: number) {
        let T = this;

        let cell = T.content.getChildByName(String(idx));
        if (!cell) {
            T._addNewCell(idx);
        }
    }

    _addNewCell(idx: number) {
        let T = this;
        let cell = T._getCell();
        cell.name = String(idx);
        T._updateCell(cell, idx);
        T._setCellPosWithIdx(cell, idx);
    }

    _wrapOffset(curOffset: Vec2) {
        let T = this;

        if (T.vertical) {
            if (curOffset.y < 0) {
                curOffset.y = 0;
            } else if (curOffset.y > T.getMaxScrollOffset().y) {
                curOffset.y = T.getMaxScrollOffset().y;
            }
        } else {
            if (curOffset.x > 0) {
                curOffset.x = 0;
            } else if (curOffset.x < -T.getMaxScrollOffset().x) {
                curOffset.x = -T.getMaxScrollOffset().x;
            }
        }
    }

    onScrollBegan(scv: ScrollView) {
        this.preOffset = scv.getScrollOffset();
    }

    onScrolling(scv: ScrollView) {
        let T = this;

        if (T.cellNum == 0) return;

        let curOffset = scv.getScrollOffset();
        T._wrapOffset(curOffset);

        if (T.vertical) {
            T._onScroll(curOffset.y - T.preOffset.y > 0, curOffset.y, T.content.parent.getComponent(UITransform).height);
        } else {
            T._onScroll(curOffset.x - T.preOffset.x < 0, -curOffset.x, T.content.parent.getComponent(UITransform).width);
        }

        T.preOffset = curOffset;
    }

    _onScroll(isPositive: boolean, dis: number, viewLen: number) {
        let T = this;

        let cellLen = T.cellLen;
        
        if (isPositive) {
            let headHideNum = Math.floor(dis / cellLen);
            if (headHideNum > T.headHideNum) {
                for (let i = T.headHideNum; i < headHideNum; ++i) {
                    T._removeCell(i);
                }
                T.headHideNum = headHideNum;
            }

            let nums = Math.ceil((dis + viewLen) / cellLen);
            for (let i = T.cellNum - T.tailHideNum; i < nums; ++i) {
                T._checkCellWithIdx(i);
            }
            T.tailHideNum = T.cellNum - nums;
        } else {
            let tailHideNum = T.cellNum - Math.ceil((dis + viewLen) / cellLen);
            if (tailHideNum > T.tailHideNum) {
                for (let i = T.tailHideNum; i < tailHideNum; ++i) {
                    T._removeCell(T.cellNum - i - 1);
                }
                T.tailHideNum = tailHideNum;
            }

            let nums = Math.floor(dis / cellLen);
            for (let i = T.headHideNum - 1; i >= nums; --i) {
                T._checkCellWithIdx(i);
            }
            T.headHideNum = nums;
        }
    }

}
