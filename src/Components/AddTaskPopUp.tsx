import React, { useState } from "react";
import { addTask } from "../Functions/TaskCRUD";
import type { Task } from "../types";

import "../Styles/AddTaskPopUp.css";

type Props = {
  onClose: () => void;
};

export default function AddTaskPopUp({ onClose }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    const newTask: Task = {
      id: Date.now().toString(),
      title: title.trim(),
      description,
      dueTime,
      listId: "", // You can update this if you want to support lists
      status: "active",
      archived: false,
    };
    await addTask(newTask);
    setLoading(false);
    onClose();
  }

  return (
    <div className="add-task-popup-backdrop" onClick={onClose}>
      <div className="add-task-popup" onClick={e => e.stopPropagation()}>
        <div className="add-task-popup-title">Add Task</div>
        <form className="add-task-form" onSubmit={handleSubmit}>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Task title"
            required
            maxLength={64}
            autoFocus
            disabled={loading}
          />
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Description"
            disabled={loading}
          />
          <input
            type="datetime-local"
            value={dueTime}
            onChange={e => setDueTime(e.target.value)}
            disabled={loading}
          />
          <div className="add-task-actions">
            <button type="button" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" disabled={loading || !title.trim()}>
              {loading ? "Adding..." : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}