import { useState, useEffect } from "react";
import { getTasks } from "./Functions/TaskCRUD";
import type { Task } from "./types";

import ListFilterSidebar from "./Components/ListSideBar/ListFilterSidebar";
import ToolsBar from "./Components/ToolBar/ToolBar";

import DayView from "./Components/Views/DayView";
import WeekView from "./Components/Views/WeekView";
import MonthView from "./Components/Views/MonthView";

import type { ViewType } from "./Components/ToolBar/ViewSelector";

function App() {
  const [selectedListIds, setSelectedListIds] = useState<string[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [view, setView] = useState<ViewType>("day");
  const [showAdd, setShowAdd] = useState(false);

  async function refreshTasks() {
    setTasks(await getTasks());
  }

  useEffect(() => {
    refreshTasks();
  }, []);

  return (
    <div className="app-main-container">
      <div className="list-filter-sidebar">
        <ListFilterSidebar
          selectedListIds={selectedListIds}
          onSelectLists={setSelectedListIds}
        />
      </div>
      <main className="tasks-view">
        <ToolsBar
          onAddTask={() => setShowAdd(true)}
          view={view} 
          onViewChange={setView} 
        />
        {view === "day" && <DayView
          tasks={tasks}
          refreshTasks={refreshTasks}
          showAdd={showAdd}
          setShowAdd={setShowAdd}
        />}
        {view === "week" && <WeekView
          tasks={tasks}
          refreshTasks={refreshTasks}
          showAdd={showAdd}
          setShowAdd={setShowAdd}
        />}
        {view === "month" && <MonthView
          tasks={tasks}
          refreshTasks={refreshTasks}
          showAdd={showAdd}
          setShowAdd={setShowAdd}
          currentDate={new Date()}
        />}
      </main>
    </div>
  );
}

export default App;