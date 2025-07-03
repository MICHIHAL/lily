// scripts/addRawUrls.js

const fs = require("fs");
const path = require("path");

// === 設定 ===
const repoUser = "michihal";
const repoName = "lily";
const branch = "main";
const structureDir = "structures";

const indexPath = path.join(__dirname, "../index/structureIndexMap.json");
const outputPath = path.join(__dirname, "../index/structureIndexMap_with_rawUrl.json");

// === 処理開始 ===
const index = JSON.parse(fs.readFileSync(indexPath, "utf-8"));

const updatedIndex = index.map(entry => {
  const rawUrl = `https://raw.githubusercontent.com/${repoUser}/${repoName}/${branch}/${structureDir}/${entry.fileName}`;
  return { ...entry, rawUrl };
});

fs.writeFileSync(outputPath, JSON.stringify(updatedIndex, null, 2), "utf-8");
console.log("✅ rawUrl付きの構造インデックスを書き出しました！");
