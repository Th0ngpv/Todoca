# 📅 Student Time Management – To-Do & Calendar App

A lightweight task manager with Day/Week/Month calendar views, list-based organization, and persistent local storage — designed to help students plan their time quickly and clearly.

---

## 🚀 Project Setup & Usage
### Start the dev server (Vite)
npm run dev

Open the printed local URL (typically http://localhost:5173).

### Build for production
npm run build

### Preview the production build locally
npm run preview

### Run tests
npm test

### Lint the code
npm run lint

## 🔗 Deployed Web URL or APK file
✍️ [Paste your link here]

## 🎥 Demo Video
**Demo video link (≤ 2 minutes):**  
📌 **Video Upload Guideline:** when uploading your demo video to YouTube, please set the visibility to **Unlisted**.  
- “Unlisted” videos can only be viewed by users who have the link.  
- The video will not appear in search results or on your channel.  
- Share the link in your README so mentors can access it.  

✍️ [Paste your video link here]


## 💻 Project Introduction

### a. Overview

This app helps students plan their daily, weekly, and monthly work. It balances simplicity and clarity: add tasks quickly, view them across multiple time ranges, and keep everything organized with colored lists. All data is stored locally in your browser for instant performance and a zero-setup experience.

### b. Key Features & Function Manual

#### Task Management

- Add tasks with title, optional description, and due date/time

- Edit/update existing tasks

- Mark tasks complete/incomplete

- Delete tasks

#### Multiple Views

- Day View: see tasks for the selected day with time labels

- Week View: 7-day grid for the selected week

- Month View: month grid with per-day task previews

#### Lists (Categories)

- Create lists with color

- Select lists to filter tasks

- Edit/delete lists via a contextual popup

#### Toolbar

- View Selector: Day / Week / Month

- Date Navigator: Prev / Today / Next

- Add Task button

#### Persistence

- All tasks and lists are stored in localStorage

- Basic usage

- Add a task: click “+ Add Task”, fill in fields, save

- Switch view: use Day / Week / Month buttons

- Navigate time: Prev / Today / Next

- Manage lists: sidebar controls

- Edit a task: click the task title

### c. Unique Features (What’s special about this app?) 

- Minimal yet clear UI with three perspectives

- Zero backend requirement — everything persists locally

- Smooth popups and animations

- Easy to extend (cloud sync, notifications, recurrence, etc.)

### d. Technology Stack and Implementation Methods

- Frontend: React 19, TypeScript, Vite 7

- Styling: CSS modules + custom styles

- Date handling: date-fns

- Persistence: localStorage via abstraction layer

- Testing: Jest + ts-jest

- Linting: ESLint with strict configs

### e. Service Architecture & Database structure (when used)

#### Components

- ToolBar: view selector and date navigation

- Views: Day, Week, Month views

- ListSideBar: list creation, selection, management

- AddTaskPopUp, ManageTaskPopUp: task dialogs

#### Functions

- storage.ts: storage abstraction

- TaskCRUD.ts: task CRUD

- ListCRUD.ts: list CRUD

#### Types

- types.ts: Task and List definitions

#### Storage keys

- tasks: all tasks array

- lists: all lists array

## 🧠 Reflection

### a. If you had more time, what would you expand?

- Deep filtering and search

- Recurrence rules + auto-generation

- Notifications (browser or push)

- Cloud sync and multi-device support

- Drag-and-drop task rescheduling

- Virtualization for very large datasets

### b. If you integrate AI APIs more for your app, what would you do?

- Task drafting from natural language (e.g., “Finish calculus HW by Wed 10pm”)

- Smart scheduling based on free slots

- Priority suggestions based on urgency

- Daily/weekly planning notes

- Habit insights (time-of-day productivity)

## ✅ Checklist
 ✅ Code runs without errors locally

 ✅ Core features: add/edit/delete/complete tasks

 ✅ Persistent storage via localStorage

 ✅ Three views (Day/Week/Month)

 ✅ Time/date navigation

 ✅ CRUD unit tests

 ✅ README filled with setup, docs, and usage
