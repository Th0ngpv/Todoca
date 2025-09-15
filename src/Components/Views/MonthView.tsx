import { useState, useMemo } from "react";
import type { Task, List } from "../../types";
import AddTaskPopUp from "../AddTaskPopUp";
import ManageTaskPopUp from "../ManageTaskPopUp";
import { updateTask } from "../../Functions/TaskCRUD";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isToday,
} from "date-fns";

import "../../Styles/Views/MonthView.css";

type Props = {
  tasks: Task[];
  lists: List[];
  refreshTasks: () => void;
  showAdd: boolean;
  setShowAdd: (v: boolean) => void;
  currentDate: Date;
};

export default function MonthView({
  tasks,
  lists, 
  refreshTasks,
  showAdd,
  setShowAdd,
  currentDate,
}: Props) {
  const [editTask, setEditTask] = useState<Task | null>(null);

  const days = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentDate]);

  const tasksByDate = useMemo(() => {
    const grouped: Record<string, Task[]> = {};
    for (const t of tasks) {
      if (!t.dueTime || t.archived) continue;
      const key = format(new Date(t.dueTime), "yyyy-MM-dd");
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(t);
    }
    return grouped;
  }, [tasks]);

  async function handleToggleComplete(task: Task) {
    await updateTask({
      ...task,
      status: task.status === "completed" ? "active" : "completed",
    });
    refreshTasks();
  }

  const getTaskColor = (task: Task) => {
    const list = lists.find((l) => l.id === task.listId);
    return list?.color || "#ccc";
  };

  return (
    <div className="calendar-month-view">
      <h3>{format(currentDate, "MMMM yyyy")}</h3>

      <div className="month-grid">
        {days.map((day) => {
          const dayKey = format(day, "yyyy-MM-dd");
          const dayTasks = (tasksByDate[dayKey] ?? []).filter(
            (t) => t.status !== "completed"
          );

          return (
            <div
              key={day.toISOString()}
              className={`month-day-cell 
                ${!isSameMonth(day, currentDate) ? "outside-month" : ""} 
                ${isToday(day) ? "today-cell" : ""}`}
            >
              <div className="month-day-header">{format(day, "d")}</div>

              <div className="month-day-tasks">
                {dayTasks.map((task) => (
                  <div
                    key={task.id}
                    className="month-task-item"
                    style={{ "--task-color": getTaskColor(task) } as React.CSSProperties}
                  >
                    <input
                      type="checkbox"
                      checked={task.status === "completed"}
                      onChange={() => handleToggleComplete(task)}
                    />
                    <span
                      className="month-task-title"
                      onClick={() => setEditTask(task)}
                    >
                      {task.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {showAdd && (
        <AddTaskPopUp
          onClose={() => {
            setShowAdd(false);
            refreshTasks();
          }}
        />
      )}
      {editTask && (
        <ManageTaskPopUp
          task={editTask}
          onClose={() => setEditTask(null)}
          onTaskUpdated={refreshTasks}
        />
      )}
    </div>
  );
}
