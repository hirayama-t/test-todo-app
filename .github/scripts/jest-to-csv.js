// jest-to-csv.js
const fs = require('fs');
const path = require('path');

const jestResultPath = path.join(__dirname, '../../jest-result.json');
const testFilePath = path.join(__dirname, '../../src/testApp.test.js');
const csvPath = path.join(__dirname, '../../test-result.csv');

// テストファイルの内容を取得
const testFile = fs.readFileSync(testFilePath, 'utf-8').split('\n');

// jest結果を取得
const jestResult = JSON.parse(fs.readFileSync(jestResultPath, 'utf-8'));
const results = jestResult.testResults[0].assertionResults;

// テスト名から行番号を取得
function findLineNumber(title) {
  for (let i = 0; i < testFile.length; i++) {
    if (testFile[i].includes(title)) {
      return i + 1;
    }
  }
  return '';
}

const describeBlock = 'TestApp';
const csvRows = [
  '行番号,describeブロック名,期待結果,テストケース,結果',
  ...results.map(r => [
    findLineNumber(r.title),
    describeBlock,
    r.title,
    r.title,
    r.status
  ].join(','))
];

fs.writeFileSync(csvPath, csvRows.join('\n'), 'utf-8');
console.log('CSV出力完了:', csvPath);
