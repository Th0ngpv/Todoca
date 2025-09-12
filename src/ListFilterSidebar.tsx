import React, { useState } from "react";
import "./ListFilterSidebar.css";

type Props = {
  allLists: string[];
  listFilters: string[];
  setListFilters: React.Dispatch<React.SetStateAction<string[]>>;
  onAddList: (listName: string) => void;
};

export default function ListFilterSidebar({
  allLists,
  listFilters,
  setListFilters,
  onAddList,
}: Props) {
  const [newList, setNewList] = useState("");

  return (
    <div className="list-filter-sidebar">
      <h4>Filter by List</h4>
      <div className="list-filter-add-row">
        <button
          className="list-filter-add-btn"
          onClick={() => {
            if (newList.trim() && !allLists.includes(newList.trim())) {
              onAddList(newList.trim());
              setNewList("");
            }
          }}
        >
          +
        </button>
        <input
          type="text"
          className="list-filter-input"
          value={newList}
          onChange={e => setNewList(e.target.value)}
          placeholder="New list"
          onKeyDown={e => {
            if (e.key === "Enter" && newList.trim() && !allLists.includes(newList.trim())) {
              onAddList(newList.trim());
              setNewList("");
            }
          }}
        />
      </div>

      {allLists.length === 0 && <div style={{ color: "#888" }}>No lists</div>}
      {allLists.map(list => (
        <label key={list} className="list-filter-label">
          <span className="list-filter-checkbox">
            <input
              type="checkbox"
              checked={listFilters.includes(list)}
              onChange={e => {
                setListFilters(filters =>
                  e.target.checked
                    ? [...filters, list]
                    : filters.filter(l => l !== list)
                );
              }}
            />
          </span>
          <span className="list-filter-listname">{list}</span>
        </label>
      ))}

      <button
        className="list-filter-showall-btn"
        onClick={() => setListFilters([])}
        disabled={listFilters.length === 0}
      >
        reset filters
      </button>
    </div>
  );
}