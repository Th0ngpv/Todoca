import React, { useState } from "react";
import type { List } from "../types";
import { updateList, deleteList } from "../Functions/ListCRUD";
import "./ManageListPopUp.css";

type Props = {
  list: List;
  onClose: () => void;
  onListUpdated: () => void;
};

export default function ManageListPopUp({ list, onClose, onListUpdated }: Props) {
  const [editName, setEditName] = useState(list.name);
  const [editColor, setEditColor] = useState(list.color || "#0091ff");
  const [editing, setEditing] = useState(false);

  async function handleEditSave(e: React.FormEvent) {
    e.preventDefault();
    await updateList({
      ...list,
      name: editName.trim(),
      color: editColor,
    });
    onListUpdated();
    onClose();
  }

  async function handleDelete() {
    await deleteList(list.id);
    onListUpdated();
    onClose();
  }

  return (
    <div className="manage-list-popup-backdrop" onClick={onClose}>
      <div className="manage-list-popup" onClick={e => e.stopPropagation()}>
        {!editing ? (
          <>
            <div className="manage-list-popup-title">{list.name}</div>
            <button
              className="manage-list-popup-action"
              onClick={() => setEditing(true)}
            >
              Edit
            </button>
            <button
              className="manage-list-popup-action delete"
              onClick={handleDelete}
            >
              Delete
            </button>
            <button
              className="manage-list-popup-close"
              onClick={onClose}
              aria-label="Close"
            >✖</button>
          </>
        ) : (
          <form className="edit-list-form" onSubmit={handleEditSave}>
            <input
              type="text"
              value={editName}
              onChange={e => setEditName(e.target.value)}
              className="edit-list-input"
              maxLength={32}
              autoFocus
            />
            <input
              type="color"
              value={editColor}
              onChange={e => setEditColor(e.target.value)}
              className="edit-list-color"
            />
            <button type="submit" className="edit-list-save" aria-label="Save">✔</button>
            <button type="button" className="edit-list-cancel" onClick={() => setEditing(false)} aria-label="Cancel">✖</button>
          </form>
        )}
      </div>
    </div>
  );
}