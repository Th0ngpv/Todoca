import React, { useState, useRef, useEffect } from "react";
import type { List } from "../../types";
import { updateList, deleteList } from "../../Functions/ListCRUD";
import "../../Styles/ListSideBar/ManageListPopUp.css";

type Props = {
  list: List;
  onClose: () => void;
  onListUpdated: () => void;
  position?: { top: number; left: number };
};

export default function ManageListPopUp({ list, onClose, onListUpdated, position }: Props) {
  const [editName, setEditName] = useState(list.name);
  const [editColor, setEditColor] = useState(list.color || "#0091ff");
  const [editing, setEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  // Focus trap refs
  const popupRef = useRef<HTMLDivElement>(null);
  const lastFocusableRef = useRef<HTMLButtonElement>(null);

  // Focus trap & ESC to close
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        if (showDeleteConfirm) {
          setShowDeleteConfirm(false);
        } else {
          onClose();
        }
      }
      // Focus trap logic
      if (e.key === "Tab" && popupRef.current) {
        const focusable = popupRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    // Focus the first focusable element
    setTimeout(() => {
      if (popupRef.current) {
        const focusable = popupRef.current.querySelector<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        focusable?.focus();
      }
    }, 0);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose, showDeleteConfirm]);

  // Save edited list
  async function handleEditSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await updateList({
      ...list,
      name: editName.trim(),
      color: editColor,
    });
    setLoading(false);
    onListUpdated();
    onClose();
  }

  // Delete list with confirmation
  async function handleDelete() {
    setLoading(true);
    await deleteList(list.id);
    setLoading(false);
    onListUpdated();
    onClose();
  }

  return (
    <div className="manage-list-popup-backdrop" onClick={onClose}>
      <div
        className="manage-list-popup"
        ref={popupRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="manage-list-popup-title"
        onClick={e => e.stopPropagation()}
        style={
          position
            ? {
                position: "absolute",
                top: position.top,
                left: position.left,
                right: "auto",
              }
            : undefined
        }
      >
        {/* Title for clarity */}
        <div className="manage-list-popup-title" id="manage-list-popup-title">
          {editing ? "Edit List" : "List Options"}
        </div>
        {/* Section: Edit/Delete actions */}
        {!editing && !showDeleteConfirm && (
          <div className="manage-list-popup-actions">
            <button
              className="manage-list-popup-action"
              onClick={() => setEditing(true)}
              disabled={loading}
            >
              Edit
            </button>
            <button
              className="manage-list-popup-action delete"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={loading}
            >
              Delete
            </button>
          </div>
        )}
        {/* Section: Edit form */}
        {editing && !showDeleteConfirm && (
          <form className="edit-list-form" onSubmit={handleEditSave}>
            <input
              type="text"
              value={editName}
              onChange={e => setEditName(e.target.value)}
              className="edit-list-input"
              maxLength={32}
              autoFocus
              disabled={loading}
            />
            <input
              type="color"
              value={editColor}
              onChange={e => setEditColor(e.target.value)}
              className="edit-list-color"
              disabled={loading}
            />
            {/* Save on right, Cancel on left */}
            <button
              type="button"
              className="edit-list-cancel"
              onClick={() => setEditing(false)}
              disabled={loading}
            >✖</button>
            <button
              type="submit"
              className="edit-list-save"
              aria-label="Save"
              disabled={loading}
              ref={lastFocusableRef}
            >{loading ? <span className="spinner" /> : "✔"}</button>
          </form>
        )}
        {/* Section: Delete confirmation */}
        {showDeleteConfirm && (
          <div className="delete-confirm-section">
            <div className="delete-confirm-text">
              Are you sure you want to delete <b>{list.name}</b>?
            </div>
            <div className="delete-confirm-actions">
              <button
                className="manage-list-popup-action"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="manage-list-popup-action delete"
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? <span className="spinner" /> : "Delete"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}