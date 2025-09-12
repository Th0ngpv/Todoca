import React from "react";
import { useState } from "react";
import ThemeSwitch from "./ThemeSwitch";
import AddTask from "./AddTask";
import type { Task as BaseTask } from "./AddTask";
import { generateRandomTasks } from "./testFunctions";
import "./App.css";
import MonthView from "./MonthView";
import WeekView from "./WeekView";
import DayView from "./DayView";
import CompletedTaskList from "./CompletedTaskList";
import { useCompleteTask } from "./useCompleteTask";
import ListFilterSidebar from "./ListFilterSidebar";

type ViewType = "month" | "week" | "day";
type Theme = "light" | "dark";

export type Task = BaseTask & { completed?: boolean };



function App() {
  const [view, setView] = useState<ViewType>("month");
  const [date, setDate] = useState(new Date());
  const [theme, setTheme] = useState<Theme>("light");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [selectedDay, setSelectedDay] = useState<{ year: number; month: number; day: number } | null>(null);
  const [listFilters, setListFilters] = useState<string[]>([]);
  const [customLists, setCustomLists] = useState<string[]>([]);

  // Combine lists from tasks, completedTasks, and customLists
  const allLists = Array.from(
    new Set([
      ...tasks.map(task => task.list),
      ...completedTasks.map(task => task.list),
      ...customLists,
    ].filter(list => !!list))
  );

  // Navigation helpers
  const goToday = () => setDate(new Date());
  const prev = () => {
    const d = new Date(date);
    if (view === "month") d.setMonth(d.getMonth() - 1);
    else if (view === "week") d.setDate(d.getDate() - 7);
    else d.setDate(d.getDate() - 1);
    setDate(d);
  };
  const next = () => {
    const d = new Date(date);
    if (view === "month") d.setMonth(d.getMonth() + 1);
    else if (view === "week") d.setDate(d.getDate() + 7);
    else d.setDate(d.getDate() + 1);
    setDate(d);
  };

  // Add task handler
  const handleAddTask = (task: BaseTask) => {
    setTasks(prev => [...prev, { ...task, completed: false }]);
  };

  // Mark as complete handler
  const handleCompleteTask = useCompleteTask(tasks, setTasks, setCompletedTasks);

  // Filter tasks by list
  const filterByList = (taskArr: Task[]) =>
    listFilters.length === 0 ? taskArr : taskArr.filter(task => listFilters.includes(task.list));

  // Get tasks for selected day
  const selectedDayTasks = selectedDay
    ? filterByList(tasks).filter(
        (task) =>
          !task.completed &&
          new Date(task.dueDate).getFullYear() === selectedDay.year &&
          new Date(task.dueDate).getMonth() === selectedDay.month &&
          new Date(task.dueDate).getDate() === selectedDay.day
      )
    : [];

  // Responsive: hide completed sidebar on small screens
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  React.useEffect(() => {
    const checkScreen = () => setIsSmallScreen(window.innerWidth < 900);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  // Add this handler
  const handleAddList = (listName: string) => {
    setCustomLists(prev =>
      prev.includes(listName) ? prev : [...prev, listName]
    );
  };

  return (
    <div className={`app-root ${theme}`}>
      <div className="app-main-container">
        {/* List Filter Sidebar */}
        <ListFilterSidebar
          allLists={allLists}
          listFilters={listFilters}
          setListFilters={setListFilters}
          onAddList={handleAddList}
        />
        <div className="calendar-main">
          <div className="calendar-toolbar">
            <button onClick={prev}>Prev</button>
            <button onClick={goToday}>Today</button>
            <button onClick={next}>Next</button>
            <select value={view} onChange={e => setView(e.target.value as ViewType)}>
              <option value="month">Month</option>
              <option value="week">Week</option>
              <option value="day">Day</option>
            </select>
            <ThemeSwitch theme={theme} setTheme={setTheme} />
            <AddTask onAdd={handleAddTask} />
            <button style={{ marginLeft: 16 }} onClick={() => setTasks(prev => [...prev, ...generateRandomTasks(date).map(t => ({ ...t, completed: false }))])}>
              + 24 Random Tasks
            </button>
            <span className="calendar-toolbar-title">
              {view === "month" && date.toLocaleString(undefined, { month: "long", year: "numeric" })}
              {view === "week" && "Week of " + date.toLocaleDateString()}
              {view === "day" && date.toLocaleDateString()}
            </span>
          </div>
          {view === "month" && (
            <MonthView
              date={date}
              tasks={tasks}
              filterByList={filterByList}
              handleCompleteTask={handleCompleteTask}
              setSelectedDay={setSelectedDay}
            />
          )}
          {view === "week" && (
            <WeekView
              date={date}
              tasks={tasks}
              filterByList={filterByList}
              handleCompleteTask={handleCompleteTask}
            />
          )}
          {view === "day" && (
            <DayView
              date={date}
              tasks={tasks}
              filterByList={filterByList}
              handleCompleteTask={handleCompleteTask}
            />
          )}

          {/* Day Task List Modal */}
          {selectedDay && (
            <>
              {/* Backdrop */}
              <div
                className="day-modal-backdrop"
                onClick={() => setSelectedDay(null)}
              />
              {/* Modal */}
              <div
                className="day-modal"
                onClick={e => e.stopPropagation()}
              >
                <h3>
                  Tasks for {selectedDay.day}/{selectedDay.month + 1}/{selectedDay.year}
                </h3>
                {selectedDayTasks.length === 0 ? (
                  <div>No tasks for this day.</div>
                ) : (
                  <ul style={{ paddingInlineStart: 0, overflowY: "scroll", maxHeight: "40vh" }}>
                    {selectedDayTasks.map(task => (
                      <li key={task.id} className="day-modal-task-list">
                        <input
                          type="checkbox"
                          checked={false}
                          onChange={e => {
                            e.stopPropagation();
                            handleCompleteTask(task.id);
                          }}
                          className="day-modal-task-checkbox"
                        />
                        <div>
                          <b>{task.title}</b>
                          <div>List: {task.list}</div>
                          <div>Due: {task.dueDate}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                <button style={{ marginTop: 16 }} onClick={() => setSelectedDay(null)}>
                  Close
                </button>
              </div>
            </>
          )}
        </div>
        {/* Completed Tasks Sidebar */}
        {!isSmallScreen && (
          <CompletedTaskList
            completedTasks={completedTasks}
            view={view}
            date={date}
            filterByList={filterByList}
          />
        )}
      </div>
    </div>
  );
}

export default App;