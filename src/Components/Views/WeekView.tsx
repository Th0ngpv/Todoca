import { useState, useMemo } from "react";
import type { Task, List } from "../../types";
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
  lists: List[];
  refreshTasks: () => void;
  showAdd: boolean;
  setShowAdd: (v: boolean) => void;
  currentDate: Date;
};

export default function WeekView({
  tasks,
  lists,
  refreshTasks,
  showAdd,
  setShowAdd,
  currentDate,
}: Props) {
  const [editTask, setEditTask] = useState<Task | null>(null);

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

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
    return list?.color || "#ccc"; // default gray if not found
  };

  return (
    <div className="calendar-week-view">
      <h3 className="week-title">
        Week of {format(weekStart, "MMM d")} – {format(weekEnd, "MMM d, yyyy")}
      </h3>

      <div className="week-grid">
        {days.map((day) => {
          const dayKey = format(day, "yyyy-MM-dd");
          const dayTasks = (tasksByDate[dayKey] ?? []).filter(
            (t) => t.status !== "completed"
          );

          return (
            <div
              key={day.toISOString()}
              className={`week-day-cell ${isToday(day) ? "today-cell" : ""}`}
            >
              <div className="week-day-header">
                <span className="weekday">{format(day, "EEE")}</span>
                <span className="day-number">{format(day, "d")}</span>
              </div>

              <div className="week-day-tasks">
                {dayTasks.length === 0 && <div className="no-task">No tasks</div>}

                {dayTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`week-task-item ${task.status === "completed" ? "completed" : ""}`}
                    style={{ "--task-color": getTaskColor(task) } as React.CSSProperties} // CSS variable
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
