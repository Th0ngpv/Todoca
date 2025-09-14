import { useState } from "react";
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
  tasks: Task[];               // All tasks to display
  refreshTasks: () => void;    // Function to reload task list after updates         // Toggle: show all tasks vs only this month’s
  showAdd: boolean;            // Whether the "Add Task" popup is visible
  setShowAdd: (v: boolean) => void; // Setter to toggle Add Task popup
  currentDate: Date;           // The month to render (controlled by parent)
};

export default function MonthView({
  tasks,
  refreshTasks,
  showAdd,
  setShowAdd,
  currentDate,
}: Props) {
  const [editTask, setEditTask] = useState<Task | null>(null); // Track task being edited

  // Calculate the range of days to show for this month (including extra days from prev/next month to fill weeks)
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 }); // Sunday as first day
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  // Group tasks into an object keyed by YYYY-MM-DD
  const tasksByDate: Record<string, Task[]> = {};
  tasks.forEach((task) => {
    if (task.archived) return; // Skip archived tasks
    const dateKey = task.dueTime?.split("T")[0]; // Extract date portion only
    if (!dateKey) return;
    if (!tasksByDate[dateKey]) tasksByDate[dateKey] = [];
    tasksByDate[dateKey].push(task);
  });

  // Toggle task completion
  async function handleToggleComplete(task: Task) {
    await updateTask({
      ...task,
      status: task.status === "completed" ? "active" : "completed",
    });
    refreshTasks();
  }

  return (
    <div className="calendar-month-view">
      {/* Month title (e.g. "September 2025") */}
      <h3 className="month-title">{format(currentDate, "MMMM yyyy")}</h3>

      {/* Weekday headers row */}
      <div className="month-grid month-headers">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="month-cell-header">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar day cells */}
      <div className="month-grid">
        {days.map((day) => {
          const dayKey = format(day, "yyyy-MM-dd"); // Match tasksByDate keys
          const dayTasks = tasksByDate[dayKey] || []; // Otherwise, tasks only for this day

          return (
            <div
              key={day.toISOString()}
              className={`month-cell ${
                isToday(day) ? "today-cell" : ""                     // Highlight today
              } ${!isSameMonth(day, currentDate) ? "faded-cell" : ""}`} // Fade out days outside current month
            >
              {/* Day number (1, 2, 3, …) */}
              <div className="day-number">{format(day, "d")}</div>

              {/* Task previews inside the cell */}
              <div className="day-tasks">
                {dayTasks.slice(0, 3).map((task) => (
                  <div
                    key={task.id}
                    className="day-task-preview"
                    style={{
                      textDecoration:
                        task.status === "completed" ? "line-through" : undefined,
                      opacity: task.status === "completed" ? 0.6 : 1,
                    }}
                  >
                    {/* Checkbox to mark complete/incomplete */}
                    <input
                      type="checkbox"
                      checked={task.status === "completed"}
                      onChange={() => handleToggleComplete(task)}
                      aria-label="Mark as complete"
                    />
                    {/* Clickable task title (opens ManageTaskPopUp) */}
                    <span
                      style={{ cursor: "pointer", flex: 1 }}
                      onClick={() => setEditTask(task)}
                    >
                      {task.title}
                    </span>
                  </div>
                ))}
                {/* If more than 3 tasks, show “+N more” */}
                {dayTasks.length > 3 && (
                  <div className="more-tasks">+{dayTasks.length - 3} more</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Task popup */}
      {showAdd && (
        <AddTaskPopUp
          onClose={() => {
            setShowAdd(false);
            refreshTasks();
          }}
        />
      )}

      {/* Manage Task popup (for editing) */}
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