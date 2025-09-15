import { useState, useEffect } from "react";
import { getTasks } from "./Functions/TaskCRUD";
import type { List, Task } from "./types";

import ListFilterSidebar from "./Components/ListSideBar/ListFilterSidebar";
import ToolsBar from "./Components/ToolBar/ToolBar";

import DayView from "./Components/Views/DayView";
import WeekView from "./Components/Views/WeekView";
import MonthView from "./Components/Views/MonthView";

import type { ViewType } from "./Components/ToolBar/ViewSelector";
import { ensureDefaultList } from "./Functions/ListCRUD";

function App() {
  const [selectedListIds, setSelectedListIds] = useState<string[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [lists, setLists] = useState<List[]>([]);
  const [view, setView] = useState<ViewType>("day");
  const [showAdd, setShowAdd] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  async function refreshTasks() {
    setTasks(await getTasks());
  }

    async function refreshLists() {
    const seededLists = await ensureDefaultList();
    setLists(seededLists);
  }

  useEffect(() => {
    refreshTasks();
    refreshLists();
  }, []);

  return (
    <div className="app-main-container">
      <div className="list-filter-sidebar">
        <ListFilterSidebar
          selectedListIds={selectedListIds}
          onSelectLists={setSelectedListIds}
          tasks={tasks}               // pass from state
          refreshTasks={refreshTasks} 
        />
      </div>
      <main className="tasks-view">
        <ToolsBar
          onAddTask={() => setShowAdd(true)}
          view={view}
          onViewChange={setView}
          currentDate={currentDate}      
          onDateChange={setCurrentDate}
        />
        {view === "day" && (
          <DayView
            tasks={tasks}
            lists={lists}
            refreshTasks={refreshTasks}
            showAdd={showAdd}
            setShowAdd={setShowAdd}
            currentDate={currentDate}
          />
        )}
        {view === "week" && (
          <WeekView
            tasks={tasks}
            lists={lists}
            refreshTasks={refreshTasks}
            showAdd={showAdd}
            setShowAdd={setShowAdd}
            currentDate={currentDate}
          />
        )}
        {view === "month" && (
          <MonthView
            tasks={tasks}
            lists={lists}
            refreshTasks={refreshTasks}
            showAdd={showAdd}
            setShowAdd={setShowAdd}
            currentDate={currentDate}
          />
        )}
      </main>
    </div>
  );
}

export default App;
