// fixUndefinedStructures.js

const fs = require('fs');
const path = require('path');

// 読み込みファイル名
const inputFile = './allFileIndexMap.json';
const outputFile = './allFileIndexMap_fixed_structuresOnly.json';

// キーワード分類（暫定ルール）
const typeGuessRules = [
  { keyword: 'Func', type: 'Func', zone: 'ZONE-1' },
  { keyword: 'Model', type: 'Model', zone: 'ZONE-1' },
  { keyword: 'View', type: 'View', zone: 'ZONE-3' },
  { keyword: 'UI', type: 'UI', zone: 'ZONE-3' },
  { keyword: 'Struct', type: 'Struct', zone: 'ZONE-3' },
];

function guessTypeAndZone(fileName) {
  for (let rule of typeGuessRules) {
    if (fileName.includes(rule.keyword)) {
      return { type: rule.type, zone: rule.zone };
    }
  }
  // fallback
  return { type: 'Model', zone: 'ZONE-1' };
}

// メイン処理
function processIndexFile() {
  const rawData = fs.readFileSync(inputFile, 'utf-8');
  const data = JSON.parse(rawData);

  const fixedList = data
    .filter(entry => entry.folder === 'structures') // structures フォルダ限定
    .map(entry => {
      const newEntry = { ...entry };

      // name未定義 → fileNameから補完
      if (!newEntry.name || newEntry.name === '(未定義)') {
        newEntry.name = path.basename(newEntry.fileName, '.json');
      }

      // type未定義
      if (!newEntry.type || newEntry.type.includes('不明') || newEntry.type === '(type不明)') {
        const guess = guessTypeAndZone(newEntry.name);
        newEntry.type = guess.type;
        newEntry.zone = guess.zone;
      }

      // zone未定義
      if (!newEntry.zone || newEntry.zone.includes('不明') || newEntry.zone === '(ZONE不明)') {
        const guess = guessTypeAndZone(newEntry.name);
        newEntry.zone = guess.zone;
      }

      // descriptionがなければデフォルト
      if (!newEntry.description || newEntry.description === '(説明なし)') {
        newEntry.description = `${newEntry.name} の構造体エントリ（自動補完）`;
      }

      // versionがなければ不明扱い
      if (!newEntry.version || newEntry.version === '') {
        newEntry.version = '不明';
      }

      return newEntry;
    });

  fs.writeFileSync(outputFile, JSON.stringify(fixedList, null, 2), 'utf-8');
  console.log(`✅ 修正済みファイルを出力しました：${outputFile}`);
}

processIndexFile();