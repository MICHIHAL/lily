const fs = require('fs');
const path = require('path');

const structureDir = path.join(__dirname, '../structures');
const indexDir = path.join(__dirname, '../index');
const outputFile = path.join(indexDir, 'allFileIndexMap.json');

function readJsonFilesFromDir(dirPath) {
  const fileList = fs.readdirSync(dirPath);
  return fileList
    .filter(file => file.endsWith('.json'))
    .map(file => {
      const filePath = path.join(dirPath, file);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

      return {
        fileName: file,
        folder: path.basename(dirPath),
        name: data.name || '(未定義)',
        type: data.type || '(type不明)',
        zone: data.zone || '(ZONE不明)',
        version: data.version || '不明',
        description: data.description || '(説明なし)',
        rawUrl: `https://raw.githubusercontent.com/MICHIHAL/lily/main/${path.basename(dirPath)}/${file}`
      };
    });
}

// 🧠 未定義項目を補完するロジックを追加
function autoFixStructureIndex(structureList) {
  const typeMap = {
    'Model': 'ZONE-1',
    'Func': 'ZONE-1',
    'View': 'ZONE-3',
    'UI': 'ZONE-3',
    'Struct': 'ZONE-3'
  };

  return structureList.map(item => {
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
      zone = typeMap[type] || '(ZONE不明)';
    }

    return {
      ...item,
      name,
      type,
      zone
    };
  });
}

// 🔁 全フォルダ走査
function generateAllIndex() {
  const folders = ['structures', 'scripts', 'index', 'viewer'];
  let allIndex = [];

  folders.forEach(folder => {
    const dirPath = path.join(__dirname, '../', folder);
    if (fs.existsSync(dirPath)) {
      const entries = readJsonFilesFromDir(dirPath);
      allIndex = allIndex.concat(entries);
    }
  });

  const fixedIndex = autoFixStructureIndex(allIndex);
  fs.writeFileSync(outputFile, JSON.stringify(fixedIndex, null, 2), 'utf8');
  console.log('✅ allFileIndexMap.json が生成されました（補完済）');
}

generateAllIndex();