import ViewSelector, { type ViewType } from "./ViewSelector";
import DateNavigator from "./DateNavigator";   
import "../../styles/ToolBar/ToolBar.css";

type ToolsBarProps = {
  onAddTask: () => void;
  view: ViewType;
  onViewChange: (view: ViewType) => void;
  currentDate: Date;               
  onDateChange: (date: Date) => void; 
};

export default function ToolsBar({
  onAddTask,
  view,
  onViewChange,
  currentDate,
  onDateChange,
}: ToolsBarProps) {
  return (
    <div className="tools-bar">
      <button className="add-task-button" onClick={onAddTask}>+ Add Task</button>
      <ViewSelector view={view} onChange={onViewChange} />
      <DateNavigator
        view={view}
        currentDate={currentDate}
        onDateChange={onDateChange}
      />
    </div>
  );
}
