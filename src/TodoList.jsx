import React, { useEffect, useState } from "react";

const storageKey = "simple-todo-tasks";
const priorities = ["Low", "Medium", "High"];

// Read saved tasks once when the app opens.
function loadTasks() {
  try {
    const savedTasks = JSON.parse(localStorage.getItem(storageKey) || "[]");
    if (!Array.isArray(savedTasks)) return [];
    return savedTasks.filter((task) =>
      task && typeof task.id === "string"
      && typeof task.text === "string" && task.text.trim()
      && typeof task.completed === "boolean"
    ).map((task) => ({
      ...task,
      // Older saved tasks did not have a priority.
      priority: priorities.includes(task.priority) ? task.priority : "Medium",
    }));
  } catch {
    return [];
  }
}

export default function TodoList() {
  const [tasks, setTasks] = useState(loadTasks);
  const [storageError, setStorageError] = useState(false);
  const [taskText, setTaskText] = useState("");
  const [newPriority, setNewPriority] = useState("Medium");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  // Save after adding, editing, completing, or deleting tasks.
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(tasks));
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }, [tasks]);

  function addTask(event) {
    event.preventDefault();
    const text = taskText.trim();
    if (!text) return;

    const newTask = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      priority: newPriority,
    };
    setTasks([...tasks, newTask]);
    setTaskText("");
  }

  function toggleTask(id) {
    setTasks(tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  }

  function startEditing(task) {
    setEditingId(task.id);
    setEditText(task.text);
  }

  function changePriority(id, priority) {
    setTasks(tasks.map((task) =>
      task.id === id ? { ...task, priority } : task
    ));
  }

  function cancelEditing() {
    setEditingId(null);
    setEditText("");
  }

  function saveTask(event, id) {
    event.preventDefault();
    const text = editText.trim();
    if (!text) return;

    setTasks(tasks.map((task) => task.id === id ? { ...task, text } : task));
    cancelEditing();
  }

  function deleteTask(id) {
    setTasks(tasks.filter((task) => task.id !== id));
    if (editingId === id) cancelEditing();
  }

  function clearAllTasks() {
    setTasks([]);
    cancelEditing();
  }

  // A task must match BOTH the search text and the selected status.
  const visibleTasks = tasks.filter((task) => {
    const matchesSearch = task.text.toLowerCase().includes(search.trim().toLowerCase());
    const matchesStatus = filter === "All"
      || (filter === "Completed" && task.completed)
      || (filter === "Uncompleted" && !task.completed);
    return matchesSearch && matchesStatus;
  });

  const completedCount = tasks.filter((task) => task.completed).length;

  return (
    <>
      <section className="task-panel" aria-label="Manage tasks">
        <form onSubmit={addTask}>
          <label htmlFor="new-task">New task</label>
          <div className="add-row">
            <input
              id="new-task"
              value={taskText}
              onChange={(event) => setTaskText(event.target.value)}
              placeholder="Enter a task"
              autoComplete="off"
            />
            <select
              aria-label="New task priority"
              value={newPriority}
              onChange={(event) => setNewPriority(event.target.value)}
            >
              {priorities.map((priority) => (
                <option key={priority} value={priority}>{priority}</option>
              ))}
            </select>
            <button className="add-button" disabled={!taskText.trim()}>Add</button>
          </div>
        </form>

        <div className="search-section">
          <label htmlFor="search">Search tasks</label>
          <input
            id="search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search tasks"
          />
        </div>

        <div className="filters" role="group" aria-label="Task filters and actions">
          {["All", "Completed", "Uncompleted"].map((status) => (
            <button
              key={status}
              type="button"
              aria-pressed={filter === status}
              onClick={() => setFilter(status)}
            >
              {status}
            </button>
          ))}
          <button
            type="button"
            className="delete-button"
            onClick={clearAllTasks}
            disabled={tasks.length === 0}
          >
            Clear all
          </button>
        </div>

        {visibleTasks.length > 0 ? (
          <ul className="task-list">
            {visibleTasks.map((task) => (
              <li className="task-row" key={task.id}>
                {editingId === task.id ? (
                  <form className="edit-form" onSubmit={(event) => saveTask(event, task.id)}>
                    <input
                      aria-label="Edit task"
                      value={editText}
                      onChange={(event) => setEditText(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Escape") cancelEditing();
                      }}
                      autoFocus
                    />
                    <button type="submit" disabled={!editText.trim()}>Save</button>
                    <button type="button" onClick={cancelEditing}>Cancel</button>
                  </form>
                ) : (
                  <>
                    <label className={task.completed ? "task completed" : "task"}>
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTask(task.id)}
                      />
                      <span>{task.text}</span>
                    </label>
                    <button type="button" onClick={() => startEditing(task)}>
                      Edit
                    </button>
                  </>
                )}
                <select
                  aria-label={`Priority for ${task.text}`}
                  value={task.priority}
                  onChange={(event) => changePriority(task.id, event.target.value)}
                >
                  {priorities.map((priority) => (
                    <option key={priority} value={priority}>{priority}</option>
                  ))}
                </select>
                <button type="button" className="delete-button" onClick={() => deleteTask(task.id)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="empty-state" role="status">
            <p>{tasks.length === 0
              ? "No tasks yet."
              : "No matching tasks. Try another search or filter."}</p>
          </div>
        )}

        <footer aria-live="polite">
          <span>{tasks.length - completedCount} remaining</span>
          <span>{completedCount} of {tasks.length} completed</span>
        </footer>
      </section>
      <p className="session-note" role="status">
        {storageError
          ? "Your browser could not save your tasks. Keep this page open to avoid losing changes."
          : "Tasks are saved in this browser, even after refreshing."}
      </p>
    </>
  );
}
