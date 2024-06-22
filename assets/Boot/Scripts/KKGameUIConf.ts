/**
 * 项目UI配置文件，自动生成，如果不了解，请不要手动修改
 * @author Mortal-Li
 * @created 2024-05-31 16:52
 */

import { IUIConfig, UICacheMode } from "../../framework/ui/UIConfig";

export const KKBundleConf = {
	Load: "KKLoadBundle",
	Hall: "KKHallBundle",
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
