
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';
import TestApp from './testApp';

describe('App.jsのテスト', () => {
  test('TestAppコンポーネントが描画される', () => {
    render(<App />);
    expect(screen.getByText('業務用Todo管理アプリ')).toBeInTheDocument();
  });
});

describe('index.jsのテスト', () => {
  test('Appがクラッシュせず描画される', () => {
    const root = document.createElement('div');
    root.setAttribute('id', 'root');
    document.body.appendChild(root);
    render(<App />);
    expect(screen.getByText('業務用Todo管理アプリ')).toBeInTheDocument();
    document.body.removeChild(root);
  });
});

describe('testApp.jsxのテスト', () => {
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
    // 2つ目のcheckbox（タスクリスト側）を取得
    const checkboxes = screen.getAllByRole('checkbox');
    const taskCheckbox = checkboxes[1];
    fireEvent.click(taskCheckbox);
    expect(taskCheckbox.checked).toBe(true);
    fireEvent.click(taskCheckbox);
    expect(taskCheckbox.checked).toBe(false);
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
    // 2つ目のcheckbox（タスクリスト側）を取得
    const checkboxes = screen.getAllByRole('checkbox');
    const taskCheckbox = checkboxes[1];
    fireEvent.click(taskCheckbox); // 完了にする
    fireEvent.click(screen.getByText('未完了'));
    expect(screen.getByText('タスクはありません')).toBeInTheDocument();
    fireEvent.click(screen.getByText('完了'));
    expect(screen.getByText('未完了タスク')).toBeInTheDocument();
  });
});
