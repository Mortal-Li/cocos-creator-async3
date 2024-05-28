"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const package_json_1 = __importDefault(require("../../package.json"));
class KKUtils {
    static sleepAsy(t) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, t * 1000);
        });
    }
    static getPluginPath() {
        return (0, path_1.join)(Editor.Project.path, "extensions", package_json_1.default.name);
    }
    static url2pathAsy(url) {
        return new Promise((resolve, reject) => {
            Editor.Message.request('asset-db', 'query-path', url)
                .then((str) => {
                resolve(str ? str : "");
            })
                .catch(reject);
        });
    }
    static url2uuidAsy(url) {
        return new Promise((resolve, reject) => {
            Editor.Message.request('asset-db', 'query-uuid', url)
                .then((str) => {
                resolve(str ? str : "");
            })
                .catch(reject);
        });
    }
    /**
     * 如果有嵌套资源，子资源要在后面更新，否则编辑器不显示，需要手动刷新
     */
    static refreshResAsy(url) {
        return Editor.Message.request('asset-db', 'refresh-asset', url);
    }
}
exports.default = KKUtils;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiS0tVdGlscy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NvdXJjZS9jb3JlL0tLVXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFDQSwrQkFBNEI7QUFDNUIsc0VBQTZDO0FBRTdDLE1BQXFCLE9BQU87SUFDeEIsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFTO1FBQ3JCLE9BQU8sSUFBSSxPQUFPLENBQU8sQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7WUFDekMsVUFBVSxDQUFDLEdBQUcsRUFBRTtnQkFDWixPQUFPLEVBQUUsQ0FBQztZQUNkLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7UUFDakIsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQsTUFBTSxDQUFDLGFBQWE7UUFDaEIsT0FBTyxJQUFBLFdBQUksRUFBQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxZQUFZLEVBQUUsc0JBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNyRSxDQUFDO0lBRUQsTUFBTSxDQUFDLFdBQVcsQ0FBQyxHQUFXO1FBQzFCLE9BQU8sSUFBSSxPQUFPLENBQVMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7WUFDM0MsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLFlBQVksRUFBRSxHQUFHLENBQUM7aUJBQ3BELElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFO2dCQUNWLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDNUIsQ0FBQyxDQUFDO2lCQUNELEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNuQixDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRCxNQUFNLENBQUMsV0FBVyxDQUFDLEdBQVc7UUFDMUIsT0FBTyxJQUFJLE9BQU8sQ0FBUyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtZQUMzQyxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsWUFBWSxFQUFFLEdBQUcsQ0FBQztpQkFDcEQsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUU7Z0JBQ1YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUM1QixDQUFDLENBQUM7aUJBQ0QsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ25CLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVEOztPQUVHO0lBQ0gsTUFBTSxDQUFDLGFBQWEsQ0FBQyxHQUFXO1FBQzVCLE9BQU8sTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLGVBQWUsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUNwRSxDQUFDO0NBQ0o7QUF2Q0QsMEJBdUNDIiwic291cmNlc0NvbnRlbnQiOlsiXHJcbmltcG9ydCB7IGpvaW4gfSBmcm9tICdwYXRoJztcclxuaW1wb3J0IHBhY2thZ2VKU09OIGZyb20gJy4uLy4uL3BhY2thZ2UuanNvbic7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBLS1V0aWxzIHtcclxuICAgIHN0YXRpYyBzbGVlcEFzeSh0OiBudW1iZXIpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8dm9pZD4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICAgICAgfSwgdCAqIDEwMDApO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBnZXRQbHVnaW5QYXRoKCkge1xyXG4gICAgICAgIHJldHVybiBqb2luKEVkaXRvci5Qcm9qZWN0LnBhdGgsIFwiZXh0ZW5zaW9uc1wiLCBwYWNrYWdlSlNPTi5uYW1lKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgdXJsMnBhdGhBc3kodXJsOiBzdHJpbmcpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8c3RyaW5nPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIEVkaXRvci5NZXNzYWdlLnJlcXVlc3QoJ2Fzc2V0LWRiJywgJ3F1ZXJ5LXBhdGgnLCB1cmwpXHJcbiAgICAgICAgICAgIC50aGVuKChzdHIpID0+IHtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUoc3RyID8gc3RyIDogXCJcIik7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5jYXRjaChyZWplY3QpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyB1cmwydXVpZEFzeSh1cmw6IHN0cmluZykge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZTxzdHJpbmc+KChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgRWRpdG9yLk1lc3NhZ2UucmVxdWVzdCgnYXNzZXQtZGInLCAncXVlcnktdXVpZCcsIHVybClcclxuICAgICAgICAgICAgLnRoZW4oKHN0cikgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShzdHIgPyBzdHIgOiBcIlwiKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmNhdGNoKHJlamVjdCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlpoLmnpzmnInltYzlpZfotYTmupDvvIzlrZDotYTmupDopoHlnKjlkI7pnaLmm7TmlrDvvIzlkKbliJnnvJbovpHlmajkuI3mmL7npLrvvIzpnIDopoHmiYvliqjliLfmlrBcclxuICAgICAqL1xyXG4gICAgc3RhdGljIHJlZnJlc2hSZXNBc3kodXJsOiBzdHJpbmcpIHtcclxuICAgICAgICByZXR1cm4gRWRpdG9yLk1lc3NhZ2UucmVxdWVzdCgnYXNzZXQtZGInLCAncmVmcmVzaC1hc3NldCcsIHVybCk7XHJcbiAgICB9XHJcbn0iXX0=