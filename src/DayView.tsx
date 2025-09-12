import type { Task } from "./App";

type Props = {
  date: Date;
  tasks: Task[];
  filterByList: (tasks: Task[]) => Task[];
  handleCompleteTask: (taskId: number) => void;
};

function DayView({ date, tasks, filterByList, handleCompleteTask }: Props) {
  const dayTasks = filterByList(tasks).filter(
    (task) =>
      !task.completed &&
      new Date(task.dueDate).toDateString() === date.toDateString()
  );
  return (
    <div className="calendar-day-view">
      <h3>
        {date.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
      </h3>
      <div style={{ fontSize: "0.9em", textAlign: "left" }}>
        {dayTasks.map((task) => (
          <div
            key={task.id}
            style={{
              display: "flex",
              alignItems: "center",
              background: "var(--bg-task)",
              color: "var(--color-task)",
              borderRadius: 4,
              padding: "2px 4px",
              margin: "2px 0",
              fontSize: "0.85em",
              wordBreak: "break-word",
              cursor: "pointer"
            }}
          >
            <input
              type="checkbox"
              checked={false}
              onChange={e => {
                e.stopPropagation();
                handleCompleteTask(task.id);
              }}
              style={{
                marginRight: 6,
                accentColor: "#4caf50",
                width: 16,
                height: 16,
                borderRadius: "50%",
                cursor: "pointer"
              }}
            />
            {task.title}
          </div>
        ))}
      </div>
    </div>
  );
}

export default DayView;