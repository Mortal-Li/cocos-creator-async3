/**
 * 会将项目中使用的framework覆盖到插件中
 */
const { existsSync, rmSync, copySync, statSync, readdirSync } = require("fs-extra");
const { join } = require("path");

let srcPath = join(__dirname, "../../../assets", "framework");
let tgtPath = join(__dirname, "../template/init", "framework");
if (existsSync(tgtPath)) {
    rmSync(tgtPath, { recursive: true });
}

if (existsSync(srcPath)) {
    copySync(srcPath, tgtPath);
    
    let rmAllMetas = function(p) {
        let files = readdirSync(p);
        for (const f of files) {
            let fp = join(p, f);
            let stat = statSync(fp);
            if (stat.isDirectory()) {
                rmAllMetas(fp);
            } else if (f.endsWith('.meta')) {
                rmSync(fp);
            }
        }
    };

    rmAllMetas(tgtPath);
    console.log("\x1b[32m%s\x1b[0m", "sync success");
} else {
    console.warn("Cannot find the framework");
}