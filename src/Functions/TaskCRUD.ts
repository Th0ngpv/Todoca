import type { Task } from "../types";
import { localStorageProvider } from "./storage";

const TASKS_KEY = "tasks";

/**
 * Fetch all tasks from storage.
 */
export async function getTasks(): Promise<Task[]> {
  return await localStorageProvider.get<Task[]>(TASKS_KEY, []);
}

/**
 * Add a new task.
 */
export async function addTask(task: Task): Promise<void> {
  const tasks = await getTasks();
  tasks.push(task);
  await localStorageProvider.set(TASKS_KEY, tasks);
}

/**
 * Update an existing task by id.
 */
export async function updateTask(updatedTask: Task): Promise<void> {
  const tasks = await getTasks();
  const idx = tasks.findIndex(t => t.id === updatedTask.id);
  if (idx !== -1) {
    tasks[idx] = updatedTask;
    await localStorageProvider.set(TASKS_KEY, tasks);
  }
}

/**
 * Delete a task by id.
 */
export async function deleteTask(id: string): Promise<void> {
  const tasks = await getTasks();
  const filtered = tasks.filter(t => t.id !== id);
  await localStorageProvider.set(TASKS_KEY, filtered);
}