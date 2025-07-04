// deleteDeprecatedFiles.js

const fs = require("fs");
const path = require("path");

// 読み込み先：deprecatedIndex_v1.0.json
const deprecatedIndex = require("./deprecatedIndex_v1.0.json");

// 削除対象フォルダ（変更可）
const targetDir = path.resolve(__dirname, "../structures");

deprecatedIndex.deprecatedFiles.forEach(entry => {
  const filePath = path.join(targetDir, entry.fileName);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log(`✅ Deleted: ${entry.fileName}`);
  } else {
    console.warn(`⚠️ Not Found: ${entry.fileName}`);
  }
});