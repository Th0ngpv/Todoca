export type CalendarView = 'month' | 'week' | 'day';
export type Tag = string;

export interface Task {
  id: string;
  title: string;
  dueDate: string; // yyyy-mm-dd
  dueTime: string; // HH:mm
  tags: Tag[];
}

export interface Event {
  id: string;
  title: string;
  startDate: string; // yyyy-mm-dd
  startTime: string; // HH:mm
  endDate: string;   // yyyy-mm-dd
  endTime: string;   // HH:mm
  tags: Tag[];
}
