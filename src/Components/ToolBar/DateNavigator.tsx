import {  addDays, addWeeks, addMonths } from "date-fns";
import type { ViewType } from "./ViewSelector";

import "../../Styles/ToolBar/DateNavigator.css";

type DateNavigatorProps = {
  view: ViewType;
  currentDate: Date;
  onDateChange: (date: Date) => void;
};

export default function DateNavigator({
  view,
  currentDate,
  onDateChange,
}: DateNavigatorProps) {
  function handlePrev() {
    if (view === "day") onDateChange(addDays(currentDate, -1));
    else if (view === "week") onDateChange(addWeeks(currentDate, -1));
    else if (view === "month") onDateChange(addMonths(currentDate, -1));
  }

  function handleNext() {
    if (view === "day") onDateChange(addDays(currentDate, 1));
    else if (view === "week") onDateChange(addWeeks(currentDate, 1));
    else if (view === "month") onDateChange(addMonths(currentDate, 1));
  }

  function handleToday() {
    onDateChange(new Date());
  }

  return (
    <div className="date-navigator">
      <button className="nav-btn" onClick={handlePrev}>
        ← Prev
      </button>
      <button className="nav-btn" onClick={handleToday}>
        Today
      </button>
      <button className="nav-btn" onClick={handleNext}>
        Next →
      </button>
    </div>
  );
}
