type TaskModel = {
  id: number;
  name: string;
  description: string;
  isCompleted: boolean;
  createdAt: Date;
  dueDate: Date;
  completedAt: Date;
};

const defaultTask: TaskModel = {
  // unique id
  id: Date.now(),
  name: "",
  description: "",
  isCompleted: false,
  completedAt: new Date(),
  createdAt: new Date(),
  dueDate: new Date(),
};

export type { TaskModel };
export { defaultTask };
