import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import TestApp from './testApp';

describe('App', () => {
  test('TestAppコンポーネントが描画される', () => {
    render(<App />);
    // TestAppのタイトルが表示されているか確認
    expect(screen.getByText('業務用Todo管理アプリ')).toBeInTheDocument();
  });

  test('Appクラス名のdivが存在する', () => {
    const { container } = render(<App />);
    expect(container.querySelector('.App')).toBeTruthy();
  });
});

describe('index.js', () => {
  // test('root要素が存在し、Reactアプリがマウントされる', () => {
  //   // DOMをセットアップ
  //   document.body.innerHTML = '<div id="root"></div>';
  //   // 必要なモジュールを再取得
  //   jest.resetModules();
  //   require('./index.js');
  //   // Appのタイトルが描画されているか
  //   expect(document.body.textContent).toContain('業務用Todo管理アプリ');
  // });

  test('reportWebVitalsが呼ばれる', () => {
    // モック関数を用意
    const mockReport = jest.fn();
    jest.resetModules();
    jest.doMock('./reportWebVitals', () => mockReport);
    document.body.innerHTML = '<div id="root"></div>';
    require('./index.js');
    expect(mockReport).toHaveBeenCalled();
  });
});

describe('TestApp', () => {
  test('初期表示でタスクがない場合、"タスクはありません"と表示される', () => {
    render(<TestApp />);
    expect(screen.getByText('タスクはありません')).toBeInTheDocument();
  });

  test('タスクを追加できる', () => {
    render(<TestApp />);
    const input = screen.getByPlaceholderText('タスクを入力してください');
    fireEvent.change(input, { target: { value: '新しいタスク' } });
    fireEvent.click(screen.getByText('追加'));
    expect(screen.getByText('新しいタスク')).toBeInTheDocument();
  });

  test('空欄で追加しようとするとアラートが表示される', () => {
    window.alert = jest.fn();
    render(<TestApp />);
    fireEvent.click(screen.getByText('追加'));
    expect(window.alert).toHaveBeenCalledWith('タスク内容を入力してください。');
  });

  test('タスクを完了状態にできる', () => {
    render(<TestApp />);
    const input = screen.getByPlaceholderText('タスクを入力してください');
    fireEvent.change(input, { target: { value: '完了タスク' } });
    fireEvent.click(screen.getByText('追加'));
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(true);
  });

  test('タスクを削除できる', () => {
    render(<TestApp />);
    const input = screen.getByPlaceholderText('タスクを入力してください');
    fireEvent.change(input, { target: { value: '削除タスク' } });
    fireEvent.click(screen.getByText('追加'));
    fireEvent.click(screen.getByText('削除'));
    expect(screen.queryByText('削除タスク')).not.toBeInTheDocument();
  });

  test('フィルターで未完了・完了タスクを切り替えられる', () => {
    render(<TestApp />);
    const input = screen.getByPlaceholderText('タスクを入力してください');
    fireEvent.change(input, { target: { value: '未完了タスク' } });
    fireEvent.click(screen.getByText('追加'));
    fireEvent.change(input, { target: { value: '完了タスク' } });
    fireEvent.click(screen.getByText('追加'));
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[1]); // 2つ目を完了に
    fireEvent.click(screen.getByText('未完了'));
    expect(screen.getByText('未完了タスク')).toBeInTheDocument();
    expect(screen.queryByText('完了タスク')).not.toBeInTheDocument();
    fireEvent.click(screen.getByText('完了'));
    expect(screen.getByText('完了タスク')).toBeInTheDocument();
    expect(screen.queryByText('未完了タスク')).not.toBeInTheDocument();
  });

  test('バージョン情報が表示される', () => {
    render(<TestApp />);
    expect(screen.getByText(/v1.0.0/)).toBeInTheDocument();
  });

  // test('validateTaskInput関数の動作', () => {
  //   expect(window.validateTaskInput('abc')).toBe(true);
  //   expect(window.validateTaskInput('   ')).toBe(false);
  //   expect(window.validateTaskInput('')).toBe(false);
  //   expect(window.validateTaskInput(null)).toBe(false);
  // });
});
