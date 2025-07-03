// scripts/generateIndex.js

const fs = require("fs");
const path = require("path");

const structuresDir = path.join(__dirname, "../structures");
const indexOutput = path.join(__dirname, "../index/structureIndexMap.json");

const index = [];

fs.readdirSync(structuresDir).forEach(file => {
  if (file.endsWith(".json")) {
    const filePath = path.join(structuresDir, file);
    const content = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    index.push({
      fileName: file,
      name: content.name || "(名前未定義)",
      type: content.type || "(タイプ不明)",
      zone: content.zone || "(ZONE不明)",
      version: content.version || "不明",
      description: content.description || "(説明なし)"
    });
  }
});

fs.writeFileSync(indexOutput, JSON.stringify(index, null, 2), "utf-8");
console.log("✅ 構造ファイルのインデックスを出力しました！");
