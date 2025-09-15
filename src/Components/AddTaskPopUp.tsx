import React, { useState, useEffect } from "react";
import { addTask } from "../Functions/TaskCRUD";
import type { Task, List } from "../types";
import { DEFAULT_LIST_ID, ensureDefaultList } from "../Functions/ListCRUD";

import "../Styles/AddTaskPopUp.css";

type Props = {
  onClose: () => void;
};

export default function AddTaskPopUp({ onClose }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [lists, setLists] = useState<List[]>([]);
  const [listId, setListId] = useState(DEFAULT_LIST_ID);
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [loading, setLoading] = useState(false);

  // Fetch lists and ensure default on mount
  useEffect(() => {
    (async () => {
      const loadedLists = await ensureDefaultList();
      setLists(loadedLists);
      if (loadedLists.length > 0) setListId(loadedLists[0].id); // default selection
    })();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !dueTime || !listId) return; // must belong to a list

    setLoading(true);
    const now = new Date().toISOString();

    const newTask: Task = {
      id: Date.now().toString(),
      title: title.trim(),
      description,
      dueTime,
      listId,
      status: "active",
      priority,
      createdAt: now,
      updatedAt: now,
      archived: false,
    };

    await addTask(newTask);
    setLoading(false);
    onClose();
  }

  return (
    <div className="add-task-popup-backdrop" onClick={onClose}>
      <div className="add-task-popup" onClick={(e) => e.stopPropagation()}>
        <div className="add-task-popup-title">Add Task</div>
        <form className="add-task-form" onSubmit={handleSubmit}>
          <label>
            Title
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
              required
              maxLength={64}
              autoFocus
              disabled={loading}
            />
          </label>

          <label>
            Description
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              disabled={loading}
            />
          </label>

          <label>
            Due Time
            <input
              type="datetime-local"
              value={dueTime}
              onChange={(e) => setDueTime(e.target.value)}
              required
              disabled={loading}
            />
          </label>

          {/* List selection */}
          {lists.length > 0 && (
            <label>
              List
              <select
                value={listId}
                onChange={(e) => setListId(e.target.value)}
                required
              >
                {lists.map((list) => (
                  <option key={list.id} value={list.id}>
                    {list.name}
                  </option>
                ))}
              </select>
            </label>
          )}

          <label>
            Priority
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as "low" | "medium" | "high")}
              disabled={loading}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </label>

          <div className="add-task-actions">
            <button type="button" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" disabled={loading || !title.trim() || !listId}>
              {loading ? "Adding..." : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
