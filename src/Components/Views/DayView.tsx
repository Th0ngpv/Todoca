import { useState, useMemo } from "react";
import type { Task, List } from "../../types";
import AddTaskPopUp from "../AddTaskPopUp";
import ManageTaskPopUp from "../ManageTaskPopUp";
import { updateTask } from "../../Functions/TaskCRUD";
import { isSameDay, format } from "date-fns";

import "../../Styles/Views/DayView.css";

type Props = {
  tasks: Task[];
  lists: List[];
  refreshTasks: () => void;
  showAdd: boolean;
  setShowAdd: (v: boolean) => void;
  currentDate: Date; // navigation
};

export default function DayView({
  tasks,
  lists,
  refreshTasks,
  showAdd,
  setShowAdd,
  currentDate,
}: Props) {
  const [editTask, setEditTask] = useState<Task | null>(null);

  // Only show active (non-archived, not completed) tasks for this date
  const filteredTasks = useMemo(
    () =>
      tasks.filter(
        (t) =>
          !t.archived &&
          t.status !== "completed" &&
          t.dueTime &&
          isSameDay(new Date(t.dueTime), currentDate)
      ),
    [tasks, currentDate]
  );

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
    <div className="calendar-day-view">
      {/* Header */}
      <h3>{format(currentDate, "MMMM d, yyyy")}</h3>

      <div className="day-task-list">
        {filteredTasks.length === 0 && <div>No tasks to display.</div>}

        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className="day-task-item"
            style={{ "--task-color": getTaskColor(task) } as React.CSSProperties}
          >
            <input
              type="checkbox"
              className="day-task-checkbox"
              checked={false} // always unchecked since only active tasks show here
              onChange={() => handleToggleComplete(task)}
              aria-label="Mark as complete"
            />
            <span
              className="day-task-title"
              onClick={() => setEditTask(task)}
              tabIndex={0}
              title="Edit task"
            >
              {task.title}
            </span>
            {task.dueTime && (
              <span className="task-dueTime">
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
