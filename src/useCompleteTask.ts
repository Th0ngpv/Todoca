import { useCallback } from "react";
import type { Task } from "./AddTask";

export function useCompleteTask(
  tasks: Task[],
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>,
  setCompletedTasks: React.Dispatch<React.SetStateAction<Task[]>>
) {
  return useCallback(
    (taskId: number) => {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;
      setTasks(prev => prev.filter(t => t.id !== taskId));
      setCompletedTasks(prev => [...prev, { ...task, completed: true }]);
    },
    [tasks, setTasks, setCompletedTasks]
  );
}