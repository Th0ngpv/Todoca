import type { Task } from "./AddTask";

// Generates 24 random tasks for the current month and year
export function generateRandomTasks(date: Date): Task[] {
  const lists = ["Work", "Personal", "Study", "Fitness", "Fitness", "Hobby"];
  const titles = [
    "This is a really long task", "This is a really long task", "This is a really long task", "This is a really long task", "This is a really long task", "Research", "Test", "Deploy",
    "Fix bug", "Brainstorm", "Sync", "Backup", "Update", "Organize", "Meditate", "Walk"
  ];
  const year = date.getFullYear();
  const month = date.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  return Array.from({ length: 24 }, (_, i) => {
    const day = Math.floor(Math.random() * daysInMonth) + 1;
    const dueDate = new Date(year, month, day).toISOString().slice(0, 10);
    return {
      id: Date.now() + i,
      title: titles[i % titles.length],
      dueDate,
      list: lists[Math.floor(Math.random() * lists.length)],
      completed: false, // <-- add this line
    };
  });
}

export const longNameTasks: Task[] = [
  {
    id: 10001,
    title: "Prepare an extremely detailed and comprehensive report on the quarterly financial performance and projections for the next fiscal year",
    dueDate: "2025-09-15",
    list: "Work",
    completed: false, // <-- add this line
  },
  {
    id: 10002,
    title: "Organize and categorize all digital photos from the last five years into appropriately named folders with descriptive metadata",
    dueDate: "2025-09-16",
    list: "Personal",
    completed: false,
  },
  {
    id: 10003,
    title: "Read and summarize the entire documentation for the new software development kit including all API endpoints and usage examples",
    dueDate: "2025-09-17",
    list: "Study",
    completed: false,
  },
  {
    id: 10004,
    title: "Complete the advanced full-body workout routine including warm-up, main exercises, cool-down, and stretching for at least ninety minutes",
    dueDate: "2025-09-18",
    list: "Fitness",
    completed: false,
  },
];