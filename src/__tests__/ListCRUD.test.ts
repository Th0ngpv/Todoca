import {
  getLists,
  addList,
  updateList,
  deleteList,
} from "../Functions/ListCRUD";
import type { List } from "../types";

// Clear localStorage before each test for isolation
beforeEach(() => {
  localStorage.clear();
});

test("addList and getLists", async () => {
  const list: List = {
    id: "1",
    name: "Work",
    color: "#FF0000",
    description: "Work related tasks",
  };
  await addList(list);
  const lists = await getLists();
  expect(lists).toHaveLength(1);
  expect(lists[0].name).toBe("Work");
  expect(lists[0].color).toBe("#FF0000");
});

test("updateList", async () => {
  const list: List = {
    id: "2",
    name: "Personal",
    color: "#00FF00",
  };
  await addList(list);
  const updated: List = { ...list, name: "Personal Updated", color: "#0000FF" };
  await updateList(updated);
  const lists = await getLists();
  expect(lists[0].name).toBe("Personal Updated");
  expect(lists[0].color).toBe("#0000FF");
});

test("deleteList", async () => {
  const list: List = {
    id: "3",
    name: "To Delete",
  };
  await addList(list);
  await deleteList("3");
  const lists = await getLists();
  expect(lists).toHaveLength(0);
});