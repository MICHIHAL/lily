// 🔧 自動整備スクリプト: addTimestampsBasedOnVersion.js
const fs = require("fs");
const path = require("path");

const baseDir = path.join(__dirname, "../structures"); // 構造体フォルダへのパス
const today = "2025-07-05";

// Ver.5準拠かどうかを判定する関数
function isVer5Compliant(content) {
  const version = (content.version || "").toLowerCase();
  const type = (content.type || "").toLowerCase();
  const description = (content.description || "").toLowerCase();

  return (
    version.includes("v5") ||
    version.includes("5.") ||
    ["model", "view", "func", "ui", "struct"].includes(type) ||
    description.includes("ver.5") ||
    description.includes("バージョン5")
  );
}

fs.readdirSync(baseDir).forEach(file => {
  if (!file.endsWith(".json")) return;

  const filePath = path.join(baseDir, file);
  let content;

  try {
    content = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch (e) {
    console.warn("⚠️ JSON読み込みエラー:", file);
    return;
  }

  const isVer5 = isVer5Compliant(content);

  if (!content.created)
    content.created = isVer5 ? today : "unknown";

  if (!content.note)
    content.note = isVer5
      ? "Ver.5準拠構造体として整理時に記録"
      : "過去構造物または未分類として記録";

  fs.writeFileSync(filePath, JSON.stringify(content, null, 2), "utf-8");
  console.log(`✅ 整備完了: ${file}`);
});
