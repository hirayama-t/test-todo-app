import { render, screen, fireEvent } from '@testing-library/react';
import TestApp from './testApp';

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
});
