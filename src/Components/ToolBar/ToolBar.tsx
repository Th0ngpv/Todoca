import ViewSelector, { type ViewType } from "./ViewSelector";
import DateNavigator from "./DateNavigator";   
import "../../Styles/ToolBar/ToolBar.css";

import { generateRandomTasks } from "../../Functions/generateRandomTasks";

function DevSeeder() {
  return (
    <button onClick={() => generateRandomTasks()}>
      Seed 24 Random Tasks
    </button>
  );
}




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
      {/* DELETE THIS */}
      <DevSeeder />

      <button onClick={() => localStorage.clear()}>clear local storage</button>

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
