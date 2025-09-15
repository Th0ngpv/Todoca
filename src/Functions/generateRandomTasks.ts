import { addTask } from "../Functions/TaskCRUD";
import type { Task } from "../types";

const titles = [
  "Buy groceries",
  "Study React",
  "Gym workout",
  "Team meeting",
  "Doctor appointment",
  "Finish project report",
  "Read a book",
  "Laundry",
  "Call mom",
  "Plan trip",
  "Pay bills",
  "Water plants",
  "Clean room",
  "Watch tutorial",
  "Write blog post",
  "Practice guitar",
  "Dinner with friends",
  "Morning run",
  "Shopping",
  "Car maintenance",
  "Update resume",
  "Play games",
  "Cook dinner",
  "Organize desk",
];

const descriptions = [
  "High priority task",
  "Quick reminder",
  "Don’t forget this one",
  "Try to finish today",
  "Move if busy",
];

const priorities: Task["priority"][] = ["low", "medium", "high"];
const recurrences: Task["recurrence"][] = ["none", "daily", "weekly", "monthly"];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export async function generateRandomTasks(count = 24) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  // first day & last day of current month
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  for (let i = 0; i < count; i++) {
    // pick a random day within this month
    const day =
      Math.floor(
        Math.random() * (lastDay.getDate() - firstDay.getDate() + 1)
      ) + 1;

    const due = new Date(year, month, day);
    due.setHours(Math.floor(Math.random() * 24));
    due.setMinutes([0, 15, 30, 45][Math.floor(Math.random() * 4)]);

    const recurrence = randomItem(recurrences);

    const task: Task = {
      id: Date.now().toString() + "-" + i,
      title: titles[i % titles.length],
      description: randomItem(descriptions),
      dueTime: due.toISOString(),
      listId: "default", // change if you have multiple lists
      status: "active",
      priority: randomItem(priorities),
      recurrence,
      recurrenceEnd:
        recurrence !== "none"
          ? new Date(due.getTime() + 1000 * 60 * 60 * 24 * 30)
              .toISOString()
              .split("T")[0]
          : undefined,
      reminder: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      archived: false,
    };

    await addTask(task);
  }
}
