export type Task = {
  id: string;
  title: string;
  dueTime: string;
  list: string;
  status: "active" | "completed";
};

export type List = {
  id: string;
  name: string;
  color?: string; // Optional: for UI color-coding
  description?: string; // Optional: for extra info
};