import { useState, useMemo } from "react";
import type { Task } from "../../types";
import AddTaskPopUp from "../AddTaskPopUp";
import ManageTaskPopUp from "../ManageTaskPopUp";
import { updateTask } from "../../Functions/TaskCRUD";
import {
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isToday,
} from "date-fns";

import "../../Styles/Views/WeekView.css";

type Props = {
  tasks: Task[];
  refreshTasks: () => void;
  showAdd: boolean;
  setShowAdd: (v: boolean) => void;
  currentDate: Date;
};

export default function WeekView({
  tasks,
  refreshTasks,
  showAdd,
  setShowAdd,
  currentDate,
}: Props) {
  const [editTask, setEditTask] = useState<Task | null>(null);

  // Week range (Sunday → Saturday)
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

  // Pre-group tasks by due date once per render
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
    <div className="calendar-week-view">
      {/* Header */}
      <h3 className="week-title">
        Week of {format(weekStart, "MMM d")} – {format(weekEnd, "MMM d, yyyy")}
      </h3>

      <div className="week-grid">
        {days.map((day) => {
          const dayKey = format(day, "yyyy-MM-dd");
          const dayTasks = tasksByDate[dayKey] ?? [];

          return (
            <div
              key={day.toISOString()}
              className={`week-day-cell ${isToday(day) ? "today-cell" : ""}`}
            >
              {/* Day header */}
              <div className="week-day-header">
                <span className="weekday">{format(day, "EEE")}</span>
                <span className="day-number">{format(day, "d")}</span>
              </div>

              {/* Tasks */}
              <div className="week-day-tasks">
                {dayTasks.length === 0 && (
                  <div className="no-task">No tasks</div>
                )}

                {dayTasks.map((task) => (
                  <div
                    key={task.id}
                    className="week-task-item"
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
                      className="week-task-title"
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
