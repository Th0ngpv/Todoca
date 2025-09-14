export type ViewType = "day" | "week" | "month";

interface ViewSelectorProps {
  view: ViewType;
  onChange: (view: ViewType) => void;
}

export default function ViewSelector({ view, onChange }: ViewSelectorProps) {
  return (
    <div className="view-selector">
      <button
        className={`day-button ${view === "day" ? "active" : ""}`}
        onClick={() => onChange("day")}
      >
        Day
      </button>

      <button
        className={`week-button ${view === "week" ? "active" : ""}`}
        onClick={() => onChange("week")}
      >
        Week
      </button>

      <button
        className={`month-button ${view === "month" ? "active" : ""}`}
        onClick={() => onChange("month")}
      >
        Month
      </button>
    </div>
  );
}
