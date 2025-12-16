import React, { useState } from "react";
import "./testApp.css";

// 業務用Todo管理アプリ

function TestApp() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("all"); // all, active, completed

  // --- バリデーションチェック関数（リファクタリング後） ---
  function validateTaskInput(value) {
    return typeof value === "string" && value.trim() !== "";
  }
  // --- バリデーションチェック関数（リファクタリング後） ---

  // タスク追加
  function handleAddTask(e) {
    e.preventDefault();
    // --- バリデーションチェック関数を呼び出し ---
    if (!validateTaskInput(input)) {
      // --- 空欄の場合はアラートを表示 ---
      alert("タスク内容を入力してください。");
      return;
    }
    setTasks([
      ...tasks,
      { id: Date.now(), text: input, completed: false },
    ]);
    setInput("");
  }

  // タスク完了切替
  function handleToggleComplete(id) {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }

  // タスク削除
  function handleDeleteTask(id) {
    setTasks(tasks.filter((task) => task.id !== id));
  }

  // フィルタリング
  function getFilteredTasks() {
    if (filter === "active") {
      return tasks.filter((task) => !task.completed);
    } else if (filter === "completed") {
      return tasks.filter((task) => task.completed);
    }
    return tasks;
  }

  // バージョン情報を追加する
  const version = "1.0.0";

  // 件数カウント
  const allCount = tasks.length;
  const activeCount = tasks.filter((task) => !task.completed).length;
  const completedCount = tasks.filter((task) => task.completed).length;

  const filteredTasks = getFilteredTasks();
  return (
    <div className="todo-container shadow">
      <div className="header">
        <h2 className="mb-0">業務用Todo管理アプリ</h2>
        {/* * バージョン情報表示 * */}
        <span className="version-info">v{version}</span>
        <p className="text-secondary mb-0" style={{fontSize: "15px"}}>タスクの追加・完了・削除ができます</p>
      </div>
      {/* フィルターボタン＋件数 */}
      <div className="d-flex justify-content-center align-items-center gap-2 mt-3 flex-wrap">
        <button
          type="button"
          className={`btn btn-outline-primary btn-sm${filter === "all" ? " active" : ""}`}
          onClick={() => setFilter("all")}
        >全て <span className="badge bg-secondary ms-1">{allCount}</span></button>
        <button
          type="button"
          className={`btn btn-outline-primary btn-sm${filter === "active" ? " active" : ""}`}
          onClick={() => setFilter("active")}
        >未完了 <span className="badge bg-secondary ms-1">{activeCount}</span></button>
        <button
          type="button"
          className={`btn btn-outline-primary btn-sm${filter === "completed" ? " active" : ""}`}
          onClick={() => setFilter("completed")}
        >完了 <span className="badge bg-secondary ms-1">{completedCount}</span></button>
      </div>
      <form onSubmit={handleAddTask} className="todo-form mt-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="タスクを入力してください"
          className="todo-input form-control"
        />
        <button type="submit" className="add-btn btn btn-primary">追加</button>
      </form>
      <ul className="todo-list mt-3">
        {filteredTasks.length === 0 && (
          <li className="text-center text-muted">タスクはありません</li>
        )}
        {filteredTasks.map((task) => (
          <li key={task.id} className={task.completed ? "completed" : ""}>
            <input
              type="checkbox"
              className="form-check-input me-2"
              checked={task.completed}
              onChange={() => handleToggleComplete(task.id)}
              title="完了/未完了切替"
            />
            <span style={{ flex: 1 }}>
              {task.text}
            </span>
            <button
              onClick={() => handleDeleteTask(task.id)}
              className="delete-btn btn btn-danger btn-sm"
            >
              削除
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TestApp;
