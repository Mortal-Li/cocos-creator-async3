/**
 * 调试日志管理
 * @author Mortal-Li
 * @created Fri Apr 26 2024 15:22:25 GMT+0800 (中国标准时间)
 */

import { error, log, warn, Node, Layout, ScrollView, Label, UITransform, Color, color, Button } from "cc";
import TimeHelper from "../tools/TimeHelper";
import CocosHelper from "../tools/CocosHelper";

enum DebugLevel {
    NONE = 0,
    ERROR,
    WARN,
    INFO
};

class DebugHelper {

    public readonly Level = DebugLevel;
    public level: DebugLevel = DebugLevel.INFO;
    private logContent: Node = null;

    log(...data: unknown[]) {
        if (this.level >= DebugLevel.INFO) {
            log(`[${TimeHelper.getCurDetailTime()}]`, ...data);
            this.logContent && this._addLblNode(JSON.stringify(data));
        }
    }

    warn(...data: unknown[]) {
        if (this.level >= DebugLevel.WARN) {
            warn(`[${TimeHelper.getCurDetailTime()}]`, ...data);
            this.logContent && this._addLblNode(JSON.stringify(data), Color.YELLOW);
        }
    }

    error(...data: unknown[]) {
        if (this.level >= DebugLevel.ERROR) {
            error(`[${TimeHelper.getCurDetailTime()}]`, ...data);
            this.logContent && this._addLblNode(JSON.stringify(data), Color.RED);
        }
    }

    /**
     * 当不方便查看日志时，可以启动此开关，比如已发布的线上游戏
     * 仅限DebugHelper打印的日志
     */
    switchDebugLogBtn() {
        let logBtn = CocosHelper.getRoot().getChildByName("logBtn");
        if (logBtn) {
            logBtn.active = !logBtn.active;
        } else {
            this.level = DebugLevel.INFO;
            this._initLogPanel();
        }
    }

    private _initLogPanel() {
        let logPanel = new Node();
        let root = CocosHelper.getRoot();
        root.addChild(logPanel);
    
        CocosHelper.addSprite(logPanel, { spriteFrame: CocosHelper.genPureColorSpriteFrame(color(0, 0, 0, 180)) });
        let bgTsm = logPanel.getComponent(UITransform);
        bgTsm.setContentSize(root.getComponent(UITransform).contentSize);
    
        let content = new Node();
        content.addComponent(UITransform).anchorY = 1;
        content.parent = logPanel;
        CocosHelper.addWidget(content, { top: 0 });
        CocosHelper.addLayout(content, { type: Layout.Type.VERTICAL });
        this.logContent = content;
    
        let scv = logPanel.addComponent(ScrollView);
        scv.horizontal = false;
        scv.vertical = true;
        scv.bounceDuration = 0.23;
        scv.brake = 0.75;
        scv.content = content;
    
        logPanel.active = false;
    
        let logBtn = new Node("logBtn");
        logBtn.addComponent(UITransform).anchorX = 1;
        logBtn.setPosition(bgTsm.width / 2, 0);
        CocosHelper.addLabel(logBtn, {
            string: "DEBUG",
            fontSize: 30,
            color: Color.YELLOW,
            enableBold: true
        });
        
        root.addChild(logBtn);
        logBtn.addComponent(Button);
        logBtn.on(Button.EventType.CLICK, () => {
            logPanel.active = !logPanel.active;
        });
    
        let clearBtn = new Node();
        clearBtn.setPosition(bgTsm.width * 0.5 - 100, -bgTsm.height * 0.5 + 100);
        CocosHelper.addLabel(clearBtn, {
            string: "Clean",
            fontSize: 30,
            color: Color.RED,
            enableBold: true
        });
        
        logPanel.addChild(clearBtn);
        clearBtn.addComponent(Button);
        clearBtn.on(Button.EventType.CLICK, () => {
            content.removeAllChildren();
        });
    }

    private _addLblNode(msg: string, clr?: Color) {
        let nd = new Node();
        CocosHelper.addLabel(nd, {
            string: msg,
            fontSize: 24,
            color: clr,
            overflow: Label.Overflow.RESIZE_HEIGHT
        });
        nd.getComponent(UITransform).width = this.logContent.parent.getComponent(UITransform).width - 20;
        nd.parent = this.logContent;
    }
};

export default new DebugHelper();