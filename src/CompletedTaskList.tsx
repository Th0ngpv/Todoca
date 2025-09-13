import type { Task } from "./AddTask";

type Props = {
  completedTasks: Task[];
  view: "month" | "week" | "day";
  date: Date;
  filterByList: (tasks: Task[]) => Task[];
};

function isTaskInCurrentView(task: Task, view: Props["view"], date: Date) {
  const taskDate = new Date(task.dueDate);
  if (view === "month") {
    return (
      taskDate.getFullYear() === date.getFullYear() &&
      taskDate.getMonth() === date.getMonth()
    );
  }
  if (view === "week") {
    const start = new Date(date);
    start.setDate(date.getDate() - start.getDay());
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return taskDate >= start && taskDate <= end;
  }
  if (view === "day") {
    return (
      taskDate.getFullYear() === date.getFullYear() &&
      taskDate.getMonth() === date.getMonth() &&
      taskDate.getDate() === date.getDate()
    );
  }
  return false;
}

export default function CompletedTaskList({ completedTasks, view, date, filterByList }: Props) {
  const completedTasksForView = filterByList(completedTasks).filter(task =>
    isTaskInCurrentView(task, view, date)
  );

  return (
    <div style={{
      flex: 1,
      background: "var(--bg-modal)",
      color: "var(--color-main)",
      borderRadius: 10,
      padding: 16,
      minWidth: 220,
      maxHeight: "80vh",
    }}>
      <h3 style={{ textAlign: "center" }}>Completed Tasks</h3>
      {completedTasksForView.length === 0 ? (
        <div style={{ textAlign: "center", color: "#888" }}>No completed tasks</div>
      ) : (
        <ul style={{ paddingLeft: 16 }}>
          {completedTasksForView.map(task => (
            <li key={task.id} style={{ marginBottom: 10 }}>
              <span style={{ textDecoration: "line-through" }}>{task.title}</span>
              <div style={{ fontSize: "0.85em", color: "#888" }}>
                {task.dueDate} | {task.list}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}