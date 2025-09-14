import { useState, useEffect } from "react";
import ListFilterSidebar from "./Components/ListSideBar/ListFilterSidebar";
import DayView from "./Views/DayView";
import { getTasks } from "./Functions/TaskCRUD";
import type { Task } from "./types";

function App() {
  const [selectedListIds, setSelectedListIds] = useState<string[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  async function refreshTasks() {
    setTasks(await getTasks());
  }

  useEffect(() => {
    refreshTasks();
  }, []);

  return (
    <div className="app-main-container">
      <nav className="list-filter-sidebar">
        <ListFilterSidebar
          selectedListIds={selectedListIds}
          onSelectLists={setSelectedListIds}
        />
      </nav>
      <main className="calendar-day-view">
        <DayView tasks={tasks} refreshTasks={refreshTasks} />
      </main>
    </div>
  );
}

export default App;