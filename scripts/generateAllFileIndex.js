// scripts/generateAllFileIndex.js

const fs = require("fs");
const path = require("path");

const baseRawUrl = "https://raw.githubusercontent.com/MICHIHAL/lily/main";

const indexDirs = ["structures", "index", "scripts", "viewer"]; // 必要に応じて追加
const outputPath = path.join(__dirname, "../index/allFileIndexMap.json");

const index = [];

indexDirs.forEach(dir => {
  const fullDirPath = path.join(__dirname, "..", dir);

  if (!fs.existsSync(fullDirPath)) return;

  fs.readdirSync(fullDirPath).forEach(file => {
    if (file.endsWith(".json") || file.endsWith(".js") || file.endsWith(".html")) {
      const filePath = path.join(fullDirPath, file);
      let content = {};
      try {
        content = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      } catch (e) {
        // JSONでない場合は無視（.js/.html想定）
      }

      index.push({
        fileName: file,
        folder: dir,
        name: content.name || "(未定義)",
        type: content.type || "(type不明)",
        zone: content.zone || "(ZONE不明)",
        version: content.version || "不明",
        description: content.description || "(説明なし)",
        rawUrl: `${baseRawUrl}/${dir}/${file}`
      });
    }
  });
});

fs.writeFileSync(outputPath, JSON.stringify(index, null, 2), "utf-8");
console.log("✅ allFileIndexMap.json を出力しました！");