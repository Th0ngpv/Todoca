import { useState } from "react";

export type Task = {
  completed: boolean; // changed from 'any' to 'boolean'
  id: number;
  title: string;
  dueDate: string;
  list: string;
};

type AddTaskProps = {
  onAdd: (task: Task) => void;
};

export default function AddTask({ onAdd }: AddTaskProps) {
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [taskList, setTaskList] = useState("");
  const [show, setShow] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle || !taskDueDate || !taskList) return;
    onAdd({
      id: Date.now(),
      title: taskTitle,
      dueDate: taskDueDate,
      list: taskList,
      completed: false, // add this line
    });
    setTaskTitle("");
    setTaskDueDate("");
    setTaskList("");
    setShow(false);
  };

  return (
    <>
      <button style={{ marginLeft: 16 }} onClick={() => setShow(true)}>
        + Add Task
      </button>
      {show && (
        <>
          {/* Backdrop */}
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(0,0,0,0.3)",
              zIndex: 1000,
            }}
            onClick={() => setShow(false)}
          />
          {/* Modal Form */}
          <form
            onSubmit={handleSubmit}
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "var(--bg-modal)",
              color: "var(--color-main)",
              padding: 24,
              borderRadius: 10,
              boxShadow: "0 4px 24px #0003",
              marginBottom: 0,
              maxWidth: 400,
              zIndex: 1001,
              minWidth: 300,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Add Task</h3>
            <div style={{ marginBottom: 8 }}>
              <input
                type="text"
                placeholder="Title"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: 8,
                  border: "1px solid #ccc",
                  borderRadius: 4,
                }}
              />
            </div>
            <div style={{ marginBottom: 8 }}>
              <input
                type="date"
                value={taskDueDate}
                onChange={(e) => setTaskDueDate(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: 8,
                  border: "1px solid #ccc",
                  borderRadius: 4,
                }}
              />
            </div>
            <div style={{ marginBottom: 8 }}>
              <input
                type="text"
                placeholder="List"
                value={taskList}
                onChange={(e) => setTaskList(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: 8,
                  border: "1px solid #ccc",
                  borderRadius: 4,
                }}
              />
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button type="submit">Add</button>
              <button type="button" onClick={() => setShow(false)}>
                Cancel
              </button>
            </div>
          </form>
        </>
      )}
    </>
  );
}