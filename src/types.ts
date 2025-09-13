// Represents a user-defined list/category for grouping tasks
export type List = {
  id: string;           // Unique identifier for the list
  name: string;         // Display name of the list
  color?: string;       // (Optional) Color code for UI highlighting (e.g., "#FF0000")
  description?: string; // (Optional) Additional details about the list
  createdAt?: string;   // (Optional) Creation date (ISO string)
  updatedAt?: string;   // (Optional) Last updated date (ISO string)
  archived?: boolean;   // (Optional) Mark if the list is archived
};

// Represents a single task in the todo/calendar app
export type Task = {
  id: string;                // Unique identifier for the task
  title: string;             // Task title
  description?: string;      // (Optional) Detailed description
  dueTime: string;           // Due date/time (ISO string)
  listId: string;            // The id of the list this task belongs to
  status: "active" | "completed"; // Task status
  priority?: "low" | "medium" | "high"; // (Optional) Priority level
  recurrence?: "none" | "daily" | "weekly" | "monthly"; // (Optional) Recurrence rule
  reminder?: string;         // (Optional) Reminder date/time (ISO string)
  createdAt?: string;        // (Optional) Creation date (ISO string)
  updatedAt?: string;        // (Optional) Last updated date (ISO string)
  archived?: boolean;        // (Optional) Mark if the task is archived
};