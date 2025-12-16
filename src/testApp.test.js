import { render, screen, fireEvent } from '@testing-library/react';
import TestApp from './testApp';

describe('TestApp', () => {
  test('初期表示でタスクがない場合、"タスクはありません"と表示される', () => {
    render(<TestApp />);
    expect(screen.getByText('タスクはありません')).toBeInTheDocument();
  });

  test('タスクを追加できる（期日・優先度・重要フラグ付き）', () => {
    render(<TestApp />);
    const input = screen.getByPlaceholderText('タスクを入力してください');
    const dateInput = screen.getByTitle('期日');
    const prioritySelect = screen.getByTitle('優先度');
    const importantCheckbox = screen.getByLabelText('重要');
    fireEvent.change(input, { target: { value: '新しいタスク' } });
    fireEvent.change(dateInput, { target: { value: '2025-12-31' } });
    fireEvent.change(prioritySelect, { target: { value: '高' } });
    fireEvent.click(importantCheckbox);
    fireEvent.click(screen.getByText('追加'));
    // タスク名
    expect(screen.getByText('新しいタスク')).toBeInTheDocument();
    // 期日
    expect(screen.getByText('2025-12-31')).toBeInTheDocument();
    // 優先度バッジ（span）だけを検証
    const badges = screen.getAllByText('高');
    expect(badges.some(badge => badge.tagName === 'SPAN')).toBe(true);
    // 重要フラグ（★アイコン）
    expect(screen.getByTitle('重要')).toBeInTheDocument();
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
    // 2つ目のcheckbox（リスト側）を取得
    const checkboxes = screen.getAllByRole('checkbox');
    const taskCheckbox = checkboxes.find(cb => cb.title === '完了/未完了切替');
    fireEvent.click(taskCheckbox);
    expect(taskCheckbox.checked).toBe(true);
  });

  test('タスクを削除できる', () => {
    render(<TestApp />);
    const input = screen.getByPlaceholderText('タスクを入力してください');
    fireEvent.change(input, { target: { value: '削除タスク' } });
    fireEvent.click(screen.getByText('追加'));
    fireEvent.click(screen.getByText('削除'));
    expect(screen.queryByText('削除タスク')).not.toBeInTheDocument();
  });

});
