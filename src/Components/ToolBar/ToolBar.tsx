import ViewSelector, { type ViewType } from "./ViewSelector";
import "../../styles/ToolBar/ToolBar.css";

type ToolsBarProps = {
  onAddTask: () => void;
  view: ViewType;
  onViewChange: (view: ViewType) => void;
};

export default function ToolsBar({ onAddTask, view, onViewChange }: ToolsBarProps) {
  return (
    <div className="tools-bar">
      
      <button onClick={onAddTask}>+ Add Task</button>
      <ViewSelector view={view} onChange={onViewChange} />
    </div>
  );
}