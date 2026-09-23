import React from "react";
import TodoList from "./TodoList.jsx";

// App handles the page layout. TodoList handles the tasks.
export default function App() {
  return (
    <main className="todo-app">
      <header>
        <h1>To-do list</h1>
      </header>
      <TodoList />
    </main>
  );
}
