/**
 * 项目UI配置文件，自动生成，如果不了解，请不要手动修改
 * @author Mortal-Li
 * @created 2024-05-31 16:52
 */

import { IUIConfig, UICacheMode } from "../../framework/ui/UIConfig";

export const KKBundleConf = {
	Load: "KKLoadBundle",
	Hall: "KKHallBundle",
	Common: "KKCommonBundle",
	//@bundle
};

export const KKLayerConf = {
	Load: <IUIConfig> {
        bundle: KKBundleConf.Load,
        name: "KKLoadLayer",
    },

    Hall: <IUIConfig> {
        bundle: KKBundleConf.Hall,
        name: "KKHallLayer",
		cacheMode: UICacheMode.Stay
    },

    //@layer
};

export const KKCommonPopupConf = {
	Common: <IUIConfig> {
        bundle: KKBundleConf.Common,
        name: "KKCommonPopup",
		cacheMode: UICacheMode.Cache
    },

    //@common_popup
};

export const KKHallPanelConf = {
	Test: <IUIConfig> {
        bundle: KKBundleConf.Hall,
        name: "KKTestPanel",
    },

    Game: <IUIConfig> {
        bundle: KKBundleConf.Hall,
        name: "KKGamePanel",
    },

    //@hall_Panel
};

export const KKCommonWidgetConf = {
	Toast: <IUIConfig> {
        bundle: KKBundleConf.Common,
        name: "KKToastWidget",
		cacheMode: UICacheMode.Cache
    },

    //@common_Widget
};

export const KKHallPopupConf = {
	TableView: <IUIConfig> {
        bundle: KKBundleConf.Hall,
        name: "KKTableViewPopup",
    },

    //@hall_popup
};
