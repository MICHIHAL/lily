const fs = require("fs");
const path = require("path");

const structuresDir = path.join(__dirname, "../structures");
const outputPath = path.join(__dirname, "../index/structureIndexMap_with_rawUrl.json");

// GitHub用：パスの設定（変更してね）
const githubBaseUrl = "https://raw.githubusercontent.com/MICHIHAL/lily/main/structures/";

const index = [];

fs.readdirSync(structuresDir).forEach(file => {
  if (file.endsWith(".json")) {
    const filePath = path.join(structuresDir, file);
    try {
      const content = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      index.push({
        fileName: file,
        name: content.name || "(未定義)",
        type: content.type || "(不明)",
        zone: content.zone || "(ZONE不明)",
        version: content.version || "(不明)",
        description: content.description || "(説明なし)",
        rawUrl: githubBaseUrl + file
      });
    } catch (e) {
      console.warn(`⚠ JSON読み込みエラー: ${file}`);
    }
  }
});

fs.writeFileSync(outputPath, JSON.stringify(index, null, 2), "utf-8");
console.log(`✅ 構造ファイルインデックス（${index.length}件）を出力しました`);