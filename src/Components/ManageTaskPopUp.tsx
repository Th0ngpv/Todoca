import React, { useState, useEffect } from "react";
import type { Task, List } from "../types";
import { updateTask, deleteTask } from "../Functions/TaskCRUD";
import "../Styles/ManageTaskPopUp.css";

type Props = {
  task: Task;
  lists?: List[];
  onClose: () => void;
  onTaskUpdated: () => void;
};

export default function ManageTaskPopUp({ task, lists = [], onClose, onTaskUpdated }: Props) {
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || "");
  const [editDue, setEditDue] = useState(task.dueTime || "");
  const [editListId, setEditListId] = useState(task.listId || "");
  const [editing, setEditing] = useState(false);

  // Escape key to close
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

    useEffect(() => {
    setEditTitle(task.title);
    setEditDescription(task.description || "");
    setEditDue(task.dueTime || "");
    setEditListId(task.listId || "");
  }, [task]);


  async function handleEditSave(e: React.FormEvent) {
    e.preventDefault();
    await updateTask({
      ...task,
      title: editTitle.trim(),
      description: editDescription,
      dueTime: editDue,
      listId: editListId,
    });
    onTaskUpdated();
    onClose();
  }

  async function handleDelete() {
    if (confirm("Are you sure you want to delete this task?")) {
      await deleteTask(task.id);
      onTaskUpdated();
      onClose();
    }
  }

  async function handleToggleStatus() {
    await updateTask({
      ...task,
      status: task.status === "completed" ? "active" : "completed",
    });
    onTaskUpdated();
    onClose();
  }

  return (
    <div className="manage-task-popup-backdrop" onClick={onClose}>
      <div className="manage-task-popup" onClick={e => e.stopPropagation()}>
        <div className="manage-task-popup-title">
          {editing ? "Edit Task" : "Task Details"}
        </div>

        {!editing ? (
          <>
            <div className="manage-task-popup-content">
              <div><b>Title:</b> {task.title}</div>
              {task.description && <div><b>Description:</b> {task.description}</div>}
              <div><b>Due:</b> {task.dueTime ? new Date(task.dueTime).toLocaleString() : "None"}</div>
              <div><b>Status:</b> {task.status}</div>
            </div>
            <div className="manage-task-popup-actions">
              <button onClick={() => setEditing(true)}>Edit</button>
              <button onClick={handleToggleStatus}>
                {task.status === "completed" ? "Mark Active" : "Mark Completed"}
              </button>
              <button className="delete" onClick={handleDelete}>Delete</button>
              <button onClick={onClose}>Close</button>
            </div>
          </>
        ) : (
          <form className="edit-task-form" onSubmit={handleEditSave}>
            <label className="task-label">Title:</label>
            <input
              type="text"
              value={editTitle}
              onChange={e => setEditTitle(e.target.value)}
              required
              maxLength={64}
              autoFocus
            />
            <label className="task-label">Description:</label>
            <textarea
              value={editDescription}
              onChange={e => setEditDescription(e.target.value)}
              placeholder="Description"
            />
            <label className="task-label">Due Time:</label>
            <input
              type="datetime-local"
              value={editDue}
              onChange={e => setEditDue(e.target.value)}
            />
            {lists.length > 0 && (
              <select value={editListId} onChange={e => setEditListId(e.target.value)}>
                {lists.map(l => (
                  <option key={l.id} value={l.id}>{l.name}</option>
                ))}
              </select>
            )}
            <div className="manage-task-popup-actions">
              <button type="button" onClick={() => setEditing(false)}>Cancel</button>
              <button type="submit">Save</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
