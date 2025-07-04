const fs = require('fs');
const path = require('path');

// 📂 対象フォルダ（必要なら追加可能）
const folders = ['structures', 'scripts', 'index', 'viewer'];
const baseDir = __dirname;
const outputFile = path.join(baseDir, '../index/allFileIndexMap.json');

// 🔍 JSONファイルを読み込んで構造抽出
function readJsonFilesFromDir(dirPath, folder) {
  const fileList = fs.readdirSync(dirPath);
  return fileList
    .filter(file => file.endsWith('.json'))
    .map(file => {
      const filePath = path.join(dirPath, file);
      let data = {};

      try {
        data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      } catch (err) {
        console.warn(`⚠️ JSON読み込みエラー: ${filePath}`);
      }

      return {
        fileName: file,
        folder: folder,
        name: data.name || '(未定義)',
        type: data.type || '(type不明)',
        zone: data.zone || '(ZONE不明)',
        version: data.version || '不明',
        description: data.description || '(説明なし)',
        rawUrl: `https://raw.githubusercontent.com/MICHIHAL/lily/main/${folder}/${file}`
      };
    });
}

// 🧠 構造補完ルール（typeからzoneを自動補完）
function autoFixStructureIndex(structureList) {
  const typeToZone = {
    'Model': 'ZONE-1',
    'Func': 'ZONE-1',
    'View': 'ZONE-3',
    'UI': 'ZONE-3',
    'Struct': 'ZONE-3'
  };

  return structureList.map(item => {
    // structures フォルダのみ補完対象
    if (item.folder !== 'structures') return item;

    let name = item.name;
    if (!name || name === '(未定義)') {
      name = item.fileName.replace('.json', '');
    }

    let type = item.type;
    if (!type || type === '(type不明)') {
      const match = name.match(/(Model|Func|View|UI|Struct)$/);
      type = match ? match[1] : '(type不明)';
    }

    let zone = item.zone;
    if (!zone || zone === '(ZONE不明)') {
      zone = typeToZone[type] || '(ZONE不明)';
    }

    return {
      ...item,
      name,
      type,
      zone
    };
  });
}

// 🚀 全体実行
function generateAllFileIndex_withFix() {
  let allIndex = [];

  folders.forEach(folder => {
    const dirPath = path.join(baseDir, '../', folder);
    if (fs.existsSync(dirPath)) {
      const entries = readJsonFilesFromDir(dirPath, folder);
      allIndex = allIndex.concat(entries);
    }
  });

  const fixedIndex = autoFixStructureIndex(allIndex);
  fs.writeFileSync(outputFile, JSON.stringify(fixedIndex, null, 2), 'utf8');
  console.log(`✅ allFileIndexMap.json を生成（補完済）→ ${outputFile}`);
}

generateAllFileIndex_withFix();