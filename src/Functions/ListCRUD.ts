import type { List } from "../types";
import { localStorageProvider } from "./storage";

const LISTS_KEY = "lists";
export const DEFAULT_LIST_ID = "default-list";
const LISTS_SEEDED_FLAG = "lists_seeded_v1";

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

/**
 * Ensure a default list exists for first-time users.
 * Creates a single list named "My List" when none exist yet.
 */
export async function ensureDefaultList(): Promise<List[]> {
  const existing = await getLists();
  const alreadySeeded = localStorage.getItem(LISTS_SEEDED_FLAG) === "1";

  if (existing.length === 0 && !alreadySeeded) {
    const defaultList: List = {
      id: DEFAULT_LIST_ID,
      name: "My List",
      color: "#0072B2", // default color from your palette
    };
    await localStorageProvider.set(LISTS_KEY, [defaultList]);
    localStorage.setItem(LISTS_SEEDED_FLAG, "1");
    return [defaultList];
  }

  return existing;
}
