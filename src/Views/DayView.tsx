import { useState } from "react";
import type { Task } from "../types";
import AddTaskPopUp from "../Components/AddTaskPopUp";
import ManageTaskPopUp from "../Components/ManageTaskPopUp";
import { updateTask } from "../Functions/TaskCRUD";

function isSameDay(dueTime: string, today: Date) {
  const due = new Date(dueTime);
  return (
    due.getFullYear() === today.getFullYear() &&
    due.getMonth() === today.getMonth() &&
    due.getDate() === today.getDate()
  );
}

const today = new Date();

export default function DayView({ tasks, refreshTasks }: { tasks: Task[]; refreshTasks: () => void }) {
  const [showAdd, setShowAdd] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [showAll, setShowAll] = useState(false);

  // Filter tasks
  const filteredTasks = showAll
    ? tasks.filter(t => !t.archived)
    : tasks.filter(
        t => t.dueTime && isSameDay(t.dueTime, today) && !t.archived
      );

  async function handleToggleComplete(task: Task) {
    await updateTask({ ...task, status: task.status === "completed" ? "active" : "completed" });
    refreshTasks();
  }

  return (
    <div className="calendar-day-view">
      <h3>{showAll ? "All Tasks" : "Today"}</h3>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <button onClick={() => setShowAdd(true)}>
          + Add Task
        </button>
        <button onClick={() => setShowAll(v => !v)}>
          {showAll ? "Show Today's Tasks" : "Show All Tasks"}
        </button>
      </div>
      <div className="day-task-list">
        {filteredTasks.length === 0 && <div>No tasks to display.</div>}
        {filteredTasks.map(task => (
          <div
            key={task.id}
            className="day-task-item"
            style={{
              textDecoration: task.status === "completed" ? "line-through" : undefined,
              opacity: task.status === "completed" ? 0.6 : 1,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <input
              type="checkbox"
              className="day-task-checkbox"
              checked={task.status === "completed"}
              onChange={() => handleToggleComplete(task)}
              aria-label="Mark as complete"
            />
            <span
              style={{ flex: 1, cursor: "pointer" }}
              onClick={() => setEditTask(task)}
              tabIndex={0}
              title="Edit task"
            >
              {task.title}
            </span>
            {task.dueTime && (
              <span className="task-dueTime" style={{ fontSize: "0.95em", color: "#888" }}>
                {new Date(task.dueTime).toLocaleString()}
              </span>
            )}
          </div>
        ))}
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