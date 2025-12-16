
import { render, screen } from '@testing-library/react';
import App from './App';

test('アプリのタイトルが表示される', () => {
  render(<App />);
  const titleElement = screen.getByText(/業務用Todo管理アプリ/);
  expect(titleElement).toBeInTheDocument();
});

test('説明文が表示される', () => {
  render(<App />);
  const descElement = screen.getByText(/タスクの追加・完了・削除ができます/);
  expect(descElement).toBeInTheDocument();
});
