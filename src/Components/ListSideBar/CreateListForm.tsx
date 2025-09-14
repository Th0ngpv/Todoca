import React, { useRef, useState } from "react";
import type { List } from "../../types";
import "../../Styles/ListSideBar/CreateListForm.css";

type Props = {
  onCreate: (list: Omit<List, "id">) => Promise<void>;
  creating: boolean;
};

  // Colorblind-friendly palette (Wong's palette + black/gray/white)
  const COLORS = ["#0072B2", "#E69F00", "#009E73", "#F0E442", "#56B4E9", "#D55E00", "#CC79A7", "#000000", "#999999", "#FFFFFF"];

export default function CreateListForm({ onCreate, creating }: Props) {
  const [newListName, setNewListName] = useState("");
  const [newListColor, setNewListColor] = useState("#0091ff");
  const colorInputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newListName.trim()) return;
    await onCreate({
      name: newListName.trim(),
      color: newListColor,
    });
    setNewListName("");
    setNewListColor("#0091ff");
  }

  return (
    <form className="create-list-form" onSubmit={handleSubmit}>
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
  );
}