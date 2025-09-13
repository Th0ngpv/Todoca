import React, { useEffect, useState, useRef } from "react";
import type { List } from "../types";
import { getLists, addList } from "../Functions/ListCRUD";
import "./ListFilterSidebar.css"


import ThreeDotsIcon from "../assets/ThreeDotsIcon";
import ManageListPopUp from "./ManageListPopUp";

type Props = {
  selectedListIds: string[];
  onSelectLists: (listIds: string[]) => void;
};

/**
 * Sidebar component for displaying and selecting task lists.
 * Fetches lists from storage on mount.
 * Allows creating a new list at the top, with color selection.
 */
export default function ListFilterSidebar({ selectedListIds, onSelectLists }: Props) {
  const [lists, setLists] = useState<List[]>([]);
  const [loading, setLoading] = useState(true);
  const [newListName, setNewListName] = useState("");
  const [newListColor, setNewListColor] = useState("#0091ff");
  const [creating, setCreating] = useState(false);
  const [popupList, setPopupList] = useState<List | null>(null);
  const [popupPosition, setPopupPosition] = useState<{ top: number; left: number } | null>(null);
  const colorInputRef = useRef<HTMLInputElement>(null);

  // Fetch lists on component mount
  useEffect(() => {
    setLoading(true);
    getLists()
      .then(setLists)
      .finally(() => setLoading(false));
  }, []);

  // Handle create new list
  async function handleCreateList(e: React.FormEvent) {
    e.preventDefault();
    if (!newListName.trim()) return;
    setCreating(true);
    const newList: List = {
      id: Date.now().toString(),
      name: newListName.trim(),
      color: newListColor,
    };
    await addList(newList);
    setLists(await getLists());
    setNewListName("");
    setNewListColor("#0091ff");
    setCreating(false);
  }

  // Colorblind-friendly palette (Wong's palette + black/gray/white)
  const COLORS = ["#0072B2", "#E69F00", "#009E73", "#F0E442", "#56B4E9", "#D55E00", "#CC79A7", "#000000", "#999999", "#FFFFFF",];

  return (
    <aside className="list-filter-sidebar">
      <h3>Lists</h3>
      {/* Create new list input with color selector */}
      <form className="create-list-form" onSubmit={handleCreateList}>
        <input
          type="text"
          placeholder="New list name"
          value={newListName}
          onChange={e => setNewListName(e.target.value)}
          className="create-list-input"
          disabled={creating}
          maxLength={32}
        />
        <div className="color-swatches">
          {COLORS.map((color) => (
            <button
              key={color}
              type="button"
              className={`color-swatch${newListColor === color ? " selected" : ""}`}
              style={{ background: color }}
              onClick={() => setNewListColor(color)}
              aria-label={`Select color ${color}`}
            />
          ))}
          {/* Optional: fallback to native color picker */}
          <button
            type="button"
            className="color-picker-icon"
            style={{
              borderColor: newListColor,
              backgroundColor: newListColor,
            }}
            onClick={() => colorInputRef.current?.click()}
            aria-label="Custom color"
            title="Custom color"
          >
            <input
              ref={colorInputRef}
              type="color"
              value={newListColor}
              onChange={e => setNewListColor(e.target.value)}
              style={{ display: "none" }}
              tabIndex={-1}
            />
          </button>
        </div>
        <button
          type="submit"
          className="create-list-btn"
          disabled={creating || !newListName.trim()}
          aria-label="Create new list"
        >
          +
        </button>
      </form>
      {loading ? (
        <div>Loading lists...</div>
      ) : (
        <ul>
          {/* "All Tasks" option */}
          <li
            className={selectedListIds.length === 0 ? "selected all-tasks" : "all-tasks"}
            title="Show all tasks"
          >
            <input
              type="checkbox"
              checked={selectedListIds.length === 0}
              onChange={() => onSelectLists([])}
              className="list-checkbox"
              aria-label="Show all tasks"
              onClick={e => e.stopPropagation()}
            />
            <span className="all-tasks-label">All Tasks</span>
          </li>
          {/* Render each list */}
          {lists.map((list) => {
            const checked = selectedListIds.includes(list.id);
            return (
              <li
                key={list.id}
                className={checked ? "selected" : ""}
                title={list.name.length > 18 ? list.name : list.description || list.name}
                data-list-color={list.color || ""}
                style={list.color ? { "--list-color": list.color } as React.CSSProperties : undefined}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => {
                    let newSelected: string[];
                    if (checked) {
                      newSelected = selectedListIds.filter(id => id !== list.id);
                    } else {
                      newSelected = [...selectedListIds, list.id];
                    }
                    onSelectLists(newSelected);
                  }}
                  className="list-checkbox"
                  aria-label={`Show/hide ${list.name}`}
                  onClick={e => e.stopPropagation()}
                />
                <span
                  className="list-name"
                  title={list.name.length > 18 ? list.name : undefined}
                  onClick={() => {
                    let newSelected: string[];
                    if (checked) {
                      newSelected = selectedListIds.filter(id => id !== list.id);
                    } else {
                      newSelected = [...selectedListIds, list.id];
                    }
                    onSelectLists(newSelected);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  {list.name.length > 18 ? list.name.slice(0, 15) + '…' : list.name}
                </span>
                {/* Three dots menu */}
                <button
                  type="button"
                  className="list-menu-btn"
                  title="List options"
                  aria-label="List options"
                  onClick={e => {
                    e.stopPropagation();
                    setPopupList(list);
                    // Get the button's position relative to the viewport
                    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                    setPopupPosition({
                      top: rect.bottom + window.scrollY,
                      left: rect.left + window.scrollX,
                    });
                  }}
                >
                  <ThreeDotsIcon />
                </button>
                {popupList && popupList.id === list.id && popupPosition && (
                  <ManageListPopUp
                    list={popupList}
                    onClose={() => {
                      setPopupList(null);
                      setPopupPosition(null);
                    }}
                    onListUpdated={async () => setLists(await getLists())}
                    position={popupPosition}
                  />
                )}
              </li>
            );
          })}
        </ul>
      )}
    </aside>
  );
}