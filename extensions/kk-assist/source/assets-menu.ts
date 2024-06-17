import { AssetInfo } from "@cocos/creator-types/editor/packages/asset-db/@types/public";
import { readFileSync } from "fs-extra";

const TargetFilter = ["cc.ImageAsset", "cc.SpriteAtlas", "cc.AnimationClip", "cc.Material"];
const SearchFilter = ["cc.SceneAsset", "cc.Prefab"];

let uuid2BuffMap: Map<string, string> = new Map();
let isSearching = false;
/**
 * 不能定义为async，否则不生效
 */
export function onAssetMenu(assetInfo: AssetInfo): Editor.Menu.BaseMenuItem[] {
    if (!assetInfo.isDirectory) return [];

    return [
        {
            label: "🔍未被引用的资源",
            async click() {
                if (isSearching) {
                    console.log("搜索中，请稍等...");
                    return;
                }
                isSearching = true;
                Editor.Selection.clear('asset');
                console.log("开始搜索 >>>");

                uuid2BuffMap.clear();
                let infos = await Editor.Message.request('asset-db', 'query-assets');
                let results = [];
                for (let i = 0; i < infos.length; ++i) {
                    let cur = infos[i];
                    if (TargetFilter.includes(cur.type) && cur.url.startsWith(assetInfo.url)) {
                        let hasFind = false;
                        for (let j = 0; j < infos.length; ++j) {
                            let one = infos[j];
                            if (SearchFilter.includes(one.type)) {
                                let content = uuid2BuffMap.get(one.uuid);
                                if (!content) {
                                    content = readFileSync(one.file, 'utf-8');
                                    uuid2BuffMap.set(one.uuid, content);
                                }
                                if (content.includes(cur.uuid)) {
                                    hasFind = true;
                                    break;
                                }
                            }
                        }
                        if (!hasFind) {
                            results.push(cur);
                        }
                    }
                }

                console.log("搜索结束 <<<");
                console.log(`有${results.length}个资源未被引用:`);
                for (let i = 0; i < results.length; ++i) {
                    console.log(`${i + 1}、${results[i].url}`);
                    Editor.Selection.select('asset', results[i].uuid);
                }
                isSearching = false;
            }
        }
    ];
}