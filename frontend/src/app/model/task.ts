export interface TaskModel {
  id: string;
  name: string;
  description: string;
  date: string;
  status: TaskStatus;
}

export enum TaskStatus {
  Pending = "pending",
  Done = "done",
}
