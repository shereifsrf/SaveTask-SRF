type TaskModel = {
  id?: string;
  todoName: string;
  details: string;
  isCompleted: boolean;
  createdAt: Date;
  dueDate: Date;
  completedAt: Date;
};

const defaultTask: TaskModel = {
  // unique id
  id: Date.now().toString(),
  todoName: "",
  details: "",
  isCompleted: false,
  completedAt: new Date(),
  createdAt: new Date(),
  dueDate: new Date(),
};

export type { TaskModel };
export { defaultTask };
