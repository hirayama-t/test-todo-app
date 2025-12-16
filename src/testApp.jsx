import React, { useState } from "react";
import "./testApp.css";

// 業務用Todo管理アプリ

function TestApp() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [due, setDue] = useState("");
  const [priority, setPriority] = useState("中");
  const [important, setImportant] = useState(false);
  const [filter, setFilter] = useState("all"); // all, active, completed

  // --- バリデーションチェック関数（リファクタリング後） ---
  function validateTaskInput(value) {
    return typeof value === "string" && value.trim() !== "";
  }
  // --- バリデーションチェック関数（リファクタリング後） ---

  // タスク追加
  function handleAddTask(e) {
    e.preventDefault();
    if (!validateTaskInput(input)) {
      alert("タスク内容を入力してください。");
      return;
    }
    setTasks([
      ...tasks,
      {
        id: Date.now(),
        text: input,
        due: due,
        priority: priority,
        important: important,
        completed: false
      },
    ]);
    setInput("");
    setDue("");
    setPriority("中");
    setImportant(false);
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
      <form onSubmit={handleAddTask} className="todo-form mt-3" style={{flexWrap: 'wrap'}}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="タスクを入力してください"
          className="todo-input form-control"
          style={{minWidth: '120px'}}
        />
        <input
          type="date"
          value={due}
          onChange={(e) => setDue(e.target.value)}
          className="form-control"
          style={{minWidth: '120px'}}
          title="期日"
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="form-control"
          style={{minWidth: '90px'}}
          title="優先度"
        >
          <option value="高">高</option>
          <option value="中">中</option>
          <option value="低">低</option>
        </select>
        <label className="form-check-label" style={{margin: '0 8px', whiteSpace: 'nowrap'}}>
          <input
            type="checkbox"
            className="form-check-input"
            checked={important}
            onChange={(e) => setImportant(e.target.checked)}
            style={{marginRight: '4px'}}
          />重要
        </label>
        <button type="submit" className="add-btn btn btn-primary">追加</button>
      </form>
      <ul className="todo-list mt-3">
        {filteredTasks.length === 0 && (
          <li className="text-center text-muted">タスクはありません</li>
        )}
        {filteredTasks.map((task) => (
          <li key={task.id} className={task.completed ? "completed" : ""} style={{alignItems: 'center'}}>
            <input
              type="checkbox"
              className="form-check-input me-2"
              checked={task.completed}
              onChange={() => handleToggleComplete(task.id)}
              title="完了/未完了切替"
            />
            <span style={{ flex: 1 }}>
              {task.important && <span title="重要" style={{color: '#e53935', fontWeight: 'bold', marginRight: 4}}>★</span>}
              {task.text}
              {task.due && (
                <span className="badge bg-light text-dark ms-2" title="期日" style={{border: '1px solid #ccc', fontSize: '12px'}}>
                  {task.due}
                </span>
              )}
              <span className="badge bg-info text-dark ms-2" title="優先度" style={{fontSize: '12px'}}>
                {task.priority || '中'}
              </span>
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
