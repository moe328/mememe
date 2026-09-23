# mememe

A simple React to-do app with two components: App and TodoList.

## Run locally

Use Node.js 22.12 or newer.

```sh
npm install
npm run dev
```

Open the local URL printed by Vite.

```sh
npm run build
npm run preview
```

## Features

- Add tasks with the Add button or Enter.
- Mark tasks completed and filter by All, Completed, or Uncompleted.
- Search task text while using a status filter.
- Edit tasks with Save/Enter and Cancel/Escape; blank tasks are rejected.
- Delete individual tasks or use Clear all to remove every task, including hidden tasks.
- Choose Low, Medium, or High priority when adding a task or beside an existing task.
- Tasks, completion, and priorities stay saved in this browser after refresh.

Saved data uses localStorage. It is specific to the browser and site address;
clearing site data removes it. A message appears if the browser cannot save.

## Source files

- src/App.jsx: page heading and TodoList component.
- src/TodoList.jsx: task state, actions, search, filters, priorities, and storage.
- src/styles.css: simple white and gray design.
- src/main.jsx: React entry point.
- index.html: HTML entry page.
