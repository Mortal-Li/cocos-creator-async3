/**
 * 对cocos api的一些功能性封装
 * @author Mortal-Li
 * @created Mon Apr 15 2024 16:29:38 GMT+0800 (中国标准时间)
 */

import { Node, SpriteFrame, Sprite, Color, Label, Widget, Layout, Texture2D, rect, UITransform, ImageAsset, builtinResMgr } from "cc";


export default class CocosHelper {

    static addSprite(nd: Node, options: {
        spriteFrame: SpriteFrame;
        /**
         * 默认值 Sprite.Type.SIMPLE
         */
        type?: number;
        /**
         * 默认值 Sprite.SizeMode.TRIMMED
         */
        sizeMode?: number;
        /**
         * 默认值 true
         */
        trim?: boolean;
    }) {
        if (!nd) return;

        if (typeof options.type !== "number") options.type = Sprite.Type.SIMPLE;
        if (typeof options.sizeMode !== "number") options.sizeMode = Sprite.SizeMode.TRIMMED;
        if (typeof options.trim !== "boolean") options.trim = true;

        let spr = nd.addComponent(Sprite);
        spr.spriteFrame = options.spriteFrame;
        spr.type = options.type;
        spr.sizeMode = options.sizeMode;
        spr.trim = options.trim;

        return spr;
    }
    
    static addLabel(nd: Node, options: {
        string: string;
        /**
         * 默认值 40
         */
        fontSize?: number;
        /**
         * 默认值 Color.WHITE
         */
        color?: Color;
        /**
         * 默认值 等于fontSize
         */
        lineHeight?: number;
        /**
         * 默认值 Label.HorizontalAlign.CENTER
         */
        horizontalAlign?: number;
        /**
         * 默认值 Label.VerticalAlign.CENTER
         */
        verticalAlign?: number;
        /**
         * 默认值 Label.Overflow.NONE
         */
        overflow?: number;
        /**
         * 默认值 Label.CacheMode.NONE
         */
        cacheMode?: number;
        enableBold?: boolean;
        enableItalic?: boolean;
        enableUnderline?: boolean;
        /**
         * 默认值 false
         */
        enableWrapText?: boolean;
    }) {
        if (!nd) return;

        if (!options.fontSize) options.fontSize = 40;
        if (!options.color) options.color = Color.WHITE;
        if (!options.lineHeight) options.lineHeight = options.fontSize;
        if (typeof options.horizontalAlign !== "number") options.horizontalAlign = Label.HorizontalAlign.CENTER;
        if (typeof options.verticalAlign !== "number") options.verticalAlign = Label.VerticalAlign.CENTER;
        if (typeof options.overflow !== "number") options.overflow = Label.Overflow.NONE;
        if (typeof options.cacheMode !== "number") options.cacheMode = Label.CacheMode.NONE;

        let lbl = nd.addComponent(Label);
        lbl.string = options.string;
        lbl.fontSize = options.fontSize;
        lbl.lineHeight = options.lineHeight;
        lbl.horizontalAlign = options.horizontalAlign;
        lbl.verticalAlign = options.verticalAlign;
        lbl.overflow = options.overflow;
        lbl.isBold = !!options.enableBold;
        lbl.isItalic = !!options.enableItalic;
        lbl.isUnderline = !!options.enableUnderline;
        lbl.enableWrapText = !!options.enableWrapText;
        lbl.cacheMode = options.cacheMode;
        lbl.color = options.color;

        return lbl;
    }

    static addWidget(nd: Node, paddings: { left?: number; right?: number; top?: number, bottom?: number}) {
        if (!nd) return;

        let wgt = nd.addComponent(Widget);

        if (typeof paddings.left === "number") {
            wgt.isAlignLeft = true;
            wgt.left = paddings.left;
        }

        if (typeof paddings.right === "number") {
            wgt.isAlignRight = true;
            wgt.right = paddings.right;
        }

        if (typeof paddings.top === "number") {
            wgt.isAlignTop = true;
            wgt.top = paddings.top;
        }

        if (typeof paddings.bottom === "number") {
            wgt.isAlignBottom = true;
            wgt.bottom = paddings.bottom;
        }

        return wgt;
    }

    static addLayout(nd: Node, options: {
        /**
         * Layout.Type
         */
        type: number;
        /**
         * 默认值 Layout.ResizeMode.CONTAINER
         */
        resizeMode?: number;
        /**
         * 默认值 false
         */
        affectedByScale?: boolean;
        width?: number;
        height?: number;
        spacingX?: number;
        paddingLeft?: number;
        paddingRight?: number;
        /**
         * 默认值 Layout.HorizontalDirection.LEFT_TO_RIGHT
         */
        horizontalDirection?: number;
        spacingY?: number;
        paddingTop?: number;
        paddingBottom?: number;
        /**
         * 默认值 Layout.VerticalDirection.TOP_TO_BOTTOM
         */
        verticalDirection?: number;
        /**
         * 默认值 Layout.AxisDirection.HORIZONTAL
         */
        startAxis?: number;
    }) {
        if (!nd) return;

        if (typeof options.resizeMode !== "number") options.resizeMode = Layout.ResizeMode.CONTAINER;

        let uiTsm = nd.getComponent(UITransform);
        if (!uiTsm) nd.addComponent(UITransform);
        if (options.width) uiTsm.width = options.width;
        if (options.height) uiTsm.height = options.height;

        let lo = nd.addComponent(Layout);
        lo.type = options.type;
        lo.resizeMode = options.resizeMode;
        lo.affectedByScale = !!options.affectedByScale;

        if (lo.type == Layout.Type.HORIZONTAL) {
            lo.horizontalDirection = (typeof options.horizontalDirection === "number") ? options.horizontalDirection : Layout.HorizontalDirection.LEFT_TO_RIGHT;
            lo.spacingX = options.spacingX ? options.spacingX : 0;
            lo.paddingLeft = options.paddingLeft ? options.paddingLeft : 0;
            lo.paddingRight = options.paddingRight ? options.paddingRight : 0;
        } else if (lo.type == Layout.Type.VERTICAL) {
            lo.verticalDirection = (typeof options.verticalDirection === "number") ? options.verticalDirection : Layout.VerticalDirection.TOP_TO_BOTTOM;
            lo.spacingY = options.spacingY ? options.spacingY : 0;
            lo.paddingTop = options.paddingTop ? options.paddingTop : 0;
            lo.paddingBottom = options.paddingBottom ? options.paddingBottom : 0;
        } else if (lo.type == Layout.Type.GRID) {
            lo.startAxis = (typeof options.startAxis === "number") ? options.startAxis : Layout.AxisDirection.HORIZONTAL;
            lo.horizontalDirection = (typeof options.horizontalDirection === "number") ? options.horizontalDirection : Layout.HorizontalDirection.LEFT_TO_RIGHT;
            lo.verticalDirection = (typeof options.verticalDirection === "number") ? options.verticalDirection : Layout.VerticalDirection.TOP_TO_BOTTOM;
            lo.spacingX = options.spacingX ? options.spacingX : 0;
            lo.paddingLeft = options.paddingLeft ? options.paddingLeft : 0;
            lo.paddingRight = options.paddingRight ? options.paddingRight : 0;
            lo.spacingY = options.spacingY ? options.spacingY : 0;
            lo.paddingTop = options.paddingTop ? options.paddingTop : 0;
            lo.paddingBottom = options.paddingBottom ? options.paddingBottom : 0;
        }

        return lo;
    }

    /**
     * 递归置灰或还原节点
     */
    static grayNode(node: Node, isGray: boolean = true) {
        if (node.getComponent(Sprite)) {
            node.getComponent(Sprite).grayscale = isGray;
        } else if (node.getComponent(Label)) {
            node.getComponent(Label).setSharedMaterial(builtinResMgr.get(isGray ? "ui-sprite-gray-material" : "ui-sprite-material"), 0);
        }

        for (let i = node.children.length - 1; i >= 0; --i ) {
            CocosHelper.grayNode(node.children[i], isGray);
        }
    }

    /**
     * 生成一张纯色的图片帧，默认黑色
     * @param color 图片的颜色
     */
    static genPureColorSpriteFrame(color: Color = Color.BLACK) {
        let imgAst = new ImageAsset({
            _data: new Uint8Array([color.r, color.g, color.b, color.a]),
            width: 2,
            height: 2,
            format: Texture2D.PixelFormat.RGBA8888,
            _compressed: false
        });
        
        let ttx = new Texture2D();
        ttx.image = imgAst;

        let sprFrm = new SpriteFrame();
        sprFrm.texture = ttx;
        sprFrm.rect = rect(0, 0, 8, 8);

        return sprFrm;
    }

}




