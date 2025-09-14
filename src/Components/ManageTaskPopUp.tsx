import React, { useState } from "react";
import type { Task } from "../types";
// If you have these functions, otherwise remove or adjust
import { updateTask, deleteTask } from "../Functions/TaskCRUD";
import "../Styles/ManageTaskPopUp.css";

type Props = {
  task: Task;
  onClose: () => void;
  onTaskUpdated: () => void;
};

export default function ManageTaskPopUp({ task, onClose, onTaskUpdated }: Props) {
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || "");
  const [editDue, setEditDue] = useState(task.dueTime || "");
  const [editing, setEditing] = useState(false);

  async function handleEditSave(e: React.FormEvent) {
    e.preventDefault();
    if (updateTask) {
      await updateTask({
        ...task,
        title: editTitle.trim(),
        description: editDescription,
        dueTime: editDue,
      });
      onTaskUpdated();
      onClose();
    }
  }

  async function handleDelete() {
    if (deleteTask) {
      await deleteTask(task.id);
      onTaskUpdated();
      onClose();
    }
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
              <div><b>Description:</b> {task.description}</div>
              <div><b>Due:</b> {task.dueTime ? new Date(task.dueTime).toLocaleString() : "None"}</div>
            </div>
            <div className="manage-task-popup-actions">
              <button onClick={() => setEditing(true)}>Edit</button>
              <button className="delete" onClick={handleDelete}>Delete</button>
              <button onClick={onClose}>Close</button>
            </div>
          </>
        ) : (
          <form className="edit-task-form" onSubmit={handleEditSave}>
            <input
              type="text"
              value={editTitle}
              onChange={e => setEditTitle(e.target.value)}
              required
              maxLength={64}
              autoFocus
            />
            <textarea
              value={editDescription}
              onChange={e => setEditDescription(e.target.value)}
              placeholder="Description"
            />
            <input
              type="datetime-local"
              value={editDue}
              onChange={e => setEditDue(e.target.value)}
            />
            <button type="button" onClick={() => setEditing(false)}>Cancel</button>
            <button type="submit">Save</button>
          </form>
        )}
      </div>
    </div>
  );
}