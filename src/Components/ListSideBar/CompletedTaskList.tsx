import type { Task } from "../../types";
import { updateTask } from "../../Functions/TaskCRUD";

import "../../Styles/ListSideBar/CompletedTaskList.css";

type Props = {
  tasks: Task[];
  refreshTasks: () => void;
};

export default function CompletedTaskList({ tasks, refreshTasks }: Props) {
  const handleToggleComplete = async (task: Task) => {
    await updateTask({
      ...task,
      status: task.status === "completed" ? "active" : "completed",
    });
    refreshTasks();
  };

  const completedTasks = tasks.filter((t) => t.status === "completed" && !t.archived);

  if (completedTasks.length === 0) return null;

  return (
    <div className="completed-task-list">
      <h4>
        Completed Tasks{" "}
        <span className="completed-count">({completedTasks.length})</span>
      </h4>
      <ul>
        {completedTasks.map((task) => (
          <li key={task.id} className="completed-task-item">
            <input
              type="checkbox"
              checked={task.status === "completed"}
              onChange={() => handleToggleComplete(task)}
            />
            <span>{task.title}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
