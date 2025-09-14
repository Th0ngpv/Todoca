import { useState } from "react";
import type { Task } from "../../types";
import AddTaskPopUp from "../AddTaskPopUp";
import ManageTaskPopUp from "../ManageTaskPopUp";
import { updateTask } from "../../Functions/TaskCRUD";
import {
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameDay,
  isToday,
} from "date-fns";

import "../../Styles/Views/WeekView.css"; // ✅ separate CSS file

type Props = {
  tasks: Task[];
  refreshTasks: () => void;
  showAdd: boolean;
  setShowAdd: (v: boolean) => void;
};

export default function WeekView({
  tasks,
  refreshTasks,
  showAdd,
  setShowAdd,
}: Props) {
  const [editTask, setEditTask] = useState<Task | null>(null);

  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 0 }); // Sunday
  const weekEnd = endOfWeek(today, { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

  async function handleToggleComplete(task: Task) {
    await updateTask({
      ...task,
      status: task.status === "completed" ? "active" : "completed",
    });
    refreshTasks();
  }

  return (
    <div className="calendar-week-view">
      <h3 className="week-title">
        Week of {format(weekStart, "MMM d")} – {format(weekEnd, "MMM d, yyyy")}
      </h3>

      <div className="week-grid">
        {days.map((day) => {
          const dayTasks = tasks.filter(
            (t) =>
              t.dueTime &&
              isSameDay(new Date(t.dueTime), day) &&
              !t.archived
          );

          return (
            <div
              key={day.toISOString()}
              className={`week-day-cell ${isToday(day) ? "today-cell" : ""}`}
            >
              {/* Day header */}
              <div className="week-day-header">
                <span className="weekday-name">{format(day, "EEE")}</span>
                <span className="weekday-number">{format(day, "d")}</span>
              </div>

              {/* Task list */}
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
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={task.status === "completed"}
                      onChange={() => handleToggleComplete(task)}
                      aria-label="Mark as complete"
                    />
                    <div className="week-task-content">
                        <div
                        style={{ flex: 1, cursor: "pointer" }}
                        onClick={() => setEditTask(task)}
                        >
                        {task.title}
                        </div>
                        {task.dueTime && (
                        <div className="task-dueTime">
                            {format(new Date(task.dueTime), "p")}
                        </div>
                        )}
                    </div>
                    
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
