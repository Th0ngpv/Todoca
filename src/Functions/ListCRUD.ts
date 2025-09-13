import type { List } from "../types";
import { localStorageProvider } from "./storage";

const LISTS_KEY = "lists";

/**
 * Fetch all lists from storage.
 */
export async function getLists(): Promise<List[]> {
  return await localStorageProvider.get<List[]>(LISTS_KEY, []);
}

/**
 * Add a new list.
 */
export async function addList(list: List): Promise<void> {
  const lists = await getLists();
  lists.push(list);
  await localStorageProvider.set(LISTS_KEY, lists);
}

/**
 * Update an existing list by id.
 */
export async function updateList(updatedList: List): Promise<void> {
  const lists = await getLists();
  const idx = lists.findIndex(l => l.id === updatedList.id);
  if (idx !== -1) {
    lists[idx] = updatedList;
    await localStorageProvider.set(LISTS_KEY, lists);
  }
}

/**
 * Delete a list by id.
 */
export async function deleteList(id: string): Promise<void> {
  const lists = await getLists();
  const filtered = lists.filter(l => l.id !== id);
  await localStorageProvider.set(LISTS_KEY, filtered);
}