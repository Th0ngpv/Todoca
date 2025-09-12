import React from "react";
import type { Task } from "./AddTask";

type Props = {
  date: Date;
  tasks: Task[];
  filterByList: (tasks: Task[]) => Task[];
  handleCompleteTask: (taskId: number) => void;
};

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function WeekView({
  date,
  tasks,
  filterByList,
  handleCompleteTask,
}: Props) {
  const start = new Date(date);
  start.setDate(date.getDate() - start.getDay());
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });

  return (
    <div>
      <div className="calendar-grid-header">
        {days.map((d, i) => (
          <div key={i} style={{ textAlign: "center" }}>
            {daysOfWeek[d.getDay()]}<br />
            {d.getMonth() + 1}/{d.getDate()}
          </div>
        ))}
      </div>
      <div className="calendar-grid">
        {days.map((d, i) => {
          const dayTasks = filterByList(tasks).filter(
            (task) =>
              !task.completed &&
              new Date(task.dueDate).toDateString() === d.toDateString()
          );
          return (
            <div
              key={i}
              className={`calendar-cell${d.toDateString() === new Date().toDateString() ? " today" : ""}`}
              style={{ minHeight: 120 }}
            >
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
        })}
      </div>
    </div>
  );
}