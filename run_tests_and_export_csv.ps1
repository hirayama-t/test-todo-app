# PowerShellスクリプト: テストケース再作成・実行・CSV出力

# 1. testcase.test.js を再作成（上書き）
$testFile = "src/testcase.test.js"
$testContent = @'
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import TestApp from './testApp';

describe('App component', () => {
  test('renders TestApp component', () => {
    render(<App />);
    expect(screen.getByText('業務用Todo管理アプリ')).toBeInTheDocument();
  });
});

describe('index.js entry point', () => {
  test('renders App without crashing', () => {
    const root = document.createElement('div');
    root.setAttribute('id', 'root');
    document.body.appendChild(root);
    render(<App />);
    expect(screen.getByText('業務用Todo管理アプリ')).toBeInTheDocument();
    document.body.removeChild(root);
  });
});

describe('TestApp component', () => {
  test('初期表示でタスクが無い旨が表示される', () => {
    render(<TestApp />);
    expect(screen.getByText('タスクはありません')).toBeInTheDocument();
  });

  test('タスクを追加できる', () => {
    render(<TestApp />);
    const input = screen.getByPlaceholderText('タスクを入力してください');
    fireEvent.change(input, { target: { value: 'テストタスク' } });
    const addBtn = screen.getByText('追加');
    fireEvent.click(addBtn);
    expect(screen.getByText('テストタスク')).toBeInTheDocument();
  });

  test('タスクを完了・未完了にできる', () => {
    render(<TestApp />);
    const input = screen.getByPlaceholderText('タスクを入力してください');
    fireEvent.change(input, { target: { value: '完了テスト' } });
    fireEvent.click(screen.getByText('追加'));
    const checkbox = screen.getByRole('checkbox', { name: '完了/未完了切替' });
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(true);
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(false);
  });

  test('タスクを削除できる', () => {
    render(<TestApp />);
    const input = screen.getByPlaceholderText('タスクを入力してください');
    fireEvent.change(input, { target: { value: '削除テスト' } });
    fireEvent.click(screen.getByText('追加'));
    const deleteBtn = screen.getByText('削除');
    fireEvent.click(deleteBtn);
    expect(screen.queryByText('削除テスト')).not.toBeInTheDocument();
  });

  test('フィルターで未完了・完了タスクを切り替えられる', () => {
    render(<TestApp />);
    const input = screen.getByPlaceholderText('タスクを入力してください');
    fireEvent.change(input, { target: { value: '未完了タスク' } });
    fireEvent.click(screen.getByText('追加'));
    const checkbox = screen.getByRole('checkbox', { name: '完了/未完了切替' });
    fireEvent.click(checkbox); // 完了にする
    fireEvent.click(screen.getByText('未完了'));
    expect(screen.getByText('タスクはありません')).toBeInTheDocument();
    fireEvent.click(screen.getByText('完了'));
    expect(screen.getByText('未完了タスク')).toBeInTheDocument();
  });
});
'@
Set-Content -Path $testFile -Value $testContent -Encoding UTF8

# 2. テスト実行（Jest）＆CSV出力
$csvFile = "testresult.csv"
$jestCmd = "npx jest src/testcase.test.js --json --outputFile=jest-result.json"
Invoke-Expression $jestCmd

# 3. JSON→CSV変換
$json = Get-Content jest-result.json | ConvertFrom-Json
$results = $json.testResults | ForEach-Object {
    $_.assertionResults | ForEach-Object {
        [PSCustomObject]@{
            TestFile = $_.ancestorTitles -join ' > '
            TestName = $_.title
            Status = $_.status
        }
    }
}
$results | Export-Csv -Path $csvFile -NoTypeInformation -Encoding UTF8
Write-Host "Test completed. Output: $csvFile"
