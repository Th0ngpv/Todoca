import type { Task } from "./AddTask";
import "./MonthView.css";

type Props = {
  date: Date;
  tasks: Task[];
  filterByList: (tasks: Task[]) => Task[];
  handleCompleteTask: (taskId: number) => void;
  setSelectedDay: (d: { year: number; month: number; day: number }) => void;
};

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getMonthMatrix(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const matrix: (number | null)[][] = [];
  let week: (number | null)[] = Array(firstDay.getDay()).fill(null);

  for (let d = 1; d <= lastDay.getDate(); d++) {
    week.push(d);
    if (week.length === 7) {
      matrix.push(week);
      week = [];
    }
  }
  if (week.length) {
    while (week.length < 7) week.push(null);
    matrix.push(week);
  }
  return matrix;
}

export default function MonthView({
  date,
  tasks,
  filterByList,
  handleCompleteTask,
  setSelectedDay,
}: Props) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const matrix = getMonthMatrix(year, month);

  return (
    <div>
      <div className="calendar-grid-header">
        {daysOfWeek.map((d) => (
          <div key={d} style={{ textAlign: "center" }}>{d}</div>
        ))}
      </div>
      <div className="calendar-grid">
        {matrix.flat().map((d, i) => {
          const dayTasks = filterByList(tasks).filter(
            (task) =>
              d &&
              !task.completed &&
              new Date(task.dueDate).getFullYear() === year &&
              new Date(task.dueDate).getMonth() === month &&
              new Date(task.dueDate).getDate() === d
          );
          const isToday =
            d === date.getDate() &&
            month === new Date().getMonth() &&
            year === new Date().getFullYear();
          return (
            <div
              key={i}
              className={`calendar-cell${isToday ? " today" : ""}`}
              onClick={() => {
                if (d) setSelectedDay({ year, month, day: d });
              }}
            >
              <div style={{ fontWeight: "bold", textAlign: "center" }}>{d || ""}</div>
              <div style={{ fontSize: "0.9em", textAlign: "left" }}>
                {dayTasks.slice(0, 2).map((task) => (
                  <div
                    key={task.id}
                    className="month-task"
                    onClick={e => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={false}
                      onChange={e => {
                        e.stopPropagation();
                        handleCompleteTask(task.id);
                      }}
                    />
                    {task.title}
                  </div>
                ))}
                {dayTasks.length > 2 && (
                  <div
                    className="month-task-ellipsis"
                    onClick={e => {
                      e.stopPropagation();
                      setSelectedDay({ year, month, day: d! });
                    }}
                  >
                    ...
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}