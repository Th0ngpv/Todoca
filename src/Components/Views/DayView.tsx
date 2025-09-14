import { useState } from "react";
import type { Task } from "../../types";
import AddTaskPopUp from "../AddTaskPopUp";
import ManageTaskPopUp from "../ManageTaskPopUp";
import { updateTask } from "../../Functions/TaskCRUD";
import { isSameDay, format } from "date-fns";

import "../../Styles/Views/DayView.css";

type Props = {
  tasks: Task[];
  refreshTasks: () => void;
  showAdd: boolean;
  setShowAdd: (v: boolean) => void;
  currentDate: Date;   // ✅ use this for navigation
};

export default function DayView({
  tasks,
  refreshTasks,
  showAdd,
  setShowAdd,
  currentDate,
}: Props) {
  const [editTask, setEditTask] = useState<Task | null>(null);

  // ✅ Filter tasks for the selected day
  const filteredTasks = tasks.filter(
    (t) =>
      !t.archived &&
      t.dueTime &&
      isSameDay(new Date(t.dueTime), currentDate)
  );

  async function handleToggleComplete(task: Task) {
    await updateTask({
      ...task,
      status: task.status === "completed" ? "active" : "completed",
    });
    refreshTasks();
  }

  return (
    <div className="calendar-day-view">
      {/* ✅ Header shows the currently selected day */}
      <h3>{format(currentDate, "MMMM d, yyyy")}</h3>

      <div className="day-task-list">
        {filteredTasks.length === 0 && <div>No tasks to display.</div>}

        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className="day-task-item"
            style={{
              textDecoration:
                task.status === "completed" ? "line-through" : undefined,
              opacity: task.status === "completed" ? 0.6 : 1,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            {/* Toggle complete */}
            <input
              type="checkbox"
              className="day-task-checkbox"
              checked={task.status === "completed"}
              onChange={() => handleToggleComplete(task)}
              aria-label="Mark as complete"
            />

            {/* Clickable title */}
            <span
              style={{ flex: 1, cursor: "pointer" }}
              onClick={() => setEditTask(task)}
              tabIndex={0}
              title="Edit task"
            >
              {task.title}
            </span>

            {/* Due time */}
            {task.dueTime && (
              <span
                className="task-dueTime"
                style={{ fontSize: "0.95em", color: "#888" }}
              >
                {format(new Date(task.dueTime), "p")}
              </span>
            )}
          </div>
        ))}
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
