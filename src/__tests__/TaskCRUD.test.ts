import {
  getTasks,
  addTask,
  updateTask,
  deleteTask,
} from "../Functions/TaskCRUD";
import type { Task } from "../types";

// Helper to clear tasks before each test
beforeEach(async () => {
  localStorage.clear();
});

test("addTask and getTasks", async () => {
  const task: Task = {
    id: "1",
    title: "Test Task",
    dueTime: "2025-09-15T10:00",
    list: "Work",
    status: "active",
  };
  await addTask(task);
  const tasks = await getTasks();
  expect(tasks).toHaveLength(1);
  expect(tasks[0].title).toBe("Test Task");
});

test("updateTask", async () => {
  const task: Task = {
    id: "2",
    title: "Old Title",
    dueTime: "2025-09-15T10:00",
    list: "Work",
    status: "active",
  };
  await addTask(task);
  const updated: Task = { ...task, title: "New Title" };
  await updateTask(updated);
  const tasks = await getTasks();
  expect(tasks[0].title).toBe("New Title");
});

test("deleteTask", async () => {
  const task: Task = {
    id: "3",
    title: "To Delete",
    dueTime: "2025-09-15T10:00",
    list: "Work",
    status: "active",
  };
  await addTask(task);
  await deleteTask("3");
  const tasks = await getTasks();
  expect(tasks).toHaveLength(0);
});