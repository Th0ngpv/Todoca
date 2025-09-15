import { useEffect, useState } from "react";
import type { List, Task } from "../../types";
import { getLists, addList, ensureDefaultList } from "../../Functions/ListCRUD";

import CreateListForm from "./CreateListForm";
import ListRender from "./ListRender";
import CompletedTaskList from "./CompletedTaskList";

import "../../Styles/ListSideBar/ListFilterSidebar.css";

type Props = {
  selectedListIds: string[];
  onSelectLists: (listIds: string[]) => void;
  tasks: Task[];              
  refreshTasks: () => void;
};

/**
 * Sidebar component for displaying and selecting task lists.
 * Fetches lists from storage on mount.
 * Allows creating a new list at the top, with color selection.
 */
export default function ListFilterSidebar({ selectedListIds, onSelectLists, tasks, refreshTasks }: Props) {
  const [lists, setLists] = useState<List[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [popupList, setPopupList] = useState<List | null>(null);
  const [popupPosition, setPopupPosition] = useState<{ top: number; left: number } | null>(null);

  // Fetch lists on component mount
  useEffect(() => {
    setLoading(true);
    getLists()
      .then(setLists)
      .finally(() => setLoading(false));
  }, []);

  
  useEffect(() => {
    let mounted = true;

    (async () => {
      setLoading(true);
      const seededLists = await ensureDefaultList();
      if (mounted) {
        setLists(seededLists);
        setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // Handle create new list
  async function handleCreateList(list: Omit<List, "id">) {
    setCreating(true);
    const newList: List = {
      id: Date.now().toString(),
      ...list,
    };
    await addList(newList);
    setLists(await getLists());
    setCreating(false);
  }

  return (
    <aside className="list-filter-sidebar">
      <div className="list-section">
        <h3>Lists</h3>
        <CreateListForm onCreate={handleCreateList} creating={creating} />
        {loading ? (
          <div>Loading lists...</div>
        ) : (
          <ListRender
            lists={lists}
            selectedListIds={selectedListIds}
            onSelectLists={onSelectLists}
            popupList={popupList}
            setPopupList={setPopupList}
            popupPosition={popupPosition}
            setPopupPosition={setPopupPosition}
            setLists={setLists}
            getLists={getLists}
          />
        )}
        </div>
        <CompletedTaskList tasks={tasks} refreshTasks={refreshTasks} />
      </aside>
  );
}