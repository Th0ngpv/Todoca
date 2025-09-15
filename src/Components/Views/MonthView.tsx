import { useState, useMemo } from "react";
import type { Task } from "../../types";
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
  refreshTasks: () => void;
  showAdd: boolean;
  setShowAdd: (v: boolean) => void;
  currentDate: Date;
};

export default function MonthView({
  tasks,
  refreshTasks,
  showAdd,
  setShowAdd,
  currentDate,
}: Props) {
  const [editTask, setEditTask] = useState<Task | null>(null);

  // Precompute visible days for the month grid (depends only on currentDate)
  const days = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentDate]);

  // Pre-group tasks by date (depends only on tasks)
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

  return (
    <div className="calendar-month-view">
      {/* Header */}
      <h3>{format(currentDate, "MMMM yyyy")}</h3>

      <div className="month-grid">
        {days.map((day) => {
          const dayKey = format(day, "yyyy-MM-dd");
          const dayTasks = tasksByDate[dayKey] ?? [];

          return (
            <div
              key={day.toISOString()}
              className={`month-day-cell 
                ${!isSameMonth(day, currentDate) ? "outside-month" : ""}
                ${isToday(day) ? "today-cell" : ""}`}
            >
              {/* Day number */}
              <div className="month-day-header">{format(day, "d")}</div>

              {/* Tasks */}
              <div className="month-day-tasks">
                {dayTasks.map((task) => (
                  <div
                    key={task.id}
                    className="month-task-item"
                    style={{
                      textDecoration:
                        task.status === "completed" ? "line-through" : undefined,
                      opacity: task.status === "completed" ? 0.6 : 1,
                    }}
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

      {/* Popups */}
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
