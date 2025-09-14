import React from "react";
import type { List } from "../../types";
import ThreeDotsIcon from "../../assets/ThreeDotsIcon";
import ManageListPopUp from "./ManageListPopUp";

import "../../Styles/ListSideBar/ListRender.css";

type Props = {
  lists: List[];
  selectedListIds: string[];
  onSelectLists: (listIds: string[]) => void;
  popupList: List | null;
  setPopupList: (list: List | null) => void;
  popupPosition: { top: number; left: number } | null;
  setPopupPosition: (pos: { top: number; left: number } | null) => void;
  setLists: (lists: List[]) => void;
  getLists: () => Promise<List[]>;
};

export default function ListRender({
  lists,
  selectedListIds,
  onSelectLists,
  popupList,
  setPopupList,
  popupPosition,
  setPopupPosition,
  setLists,
  getLists,
}: Props) {
  return (
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
  );
}