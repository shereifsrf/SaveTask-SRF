import { create } from "zustand";
import { TaskModel } from "../models/task";
import { devtools, persist } from "zustand/middleware";
import todoAPI from "../util/apis/todo-api";
import useUserStore from "./user-store";

interface TaskState {
  tasks: Array<TaskModel>;
  getTasks: () => Promise<void>;
  addTask: (task: TaskModel) => Promise<String | undefined>;
  removeTask: (id: string) => Promise<String | undefined>;
  updateTask: (id: string, task: TaskModel) => Promise<String | undefined>;
}

const useTaskStore = create<TaskState>()(
  devtools(
    persist(
      (set) => ({
        tasks: [],
        getTasks: async () => {
          // get user from user store
          const user = useUserStore.getState().user;
          const tasks = await todoAPI.getTodos(user);
          set(() => ({ tasks: tasks }));
        },
        addTask: async (task) => {
          const user = useUserStore.getState().user;
          const response = await todoAPI.addTodo(user, task);
          console.log("store:", { response });
          if (response) {
            set((state) => ({ tasks: [...state.tasks, response] }));
            return undefined;
          }
          return "Error adding task";
        },
        removeTask: async (id) => {
          const user = useUserStore.getState().user;
          const response = await todoAPI.removeTodo(user, id);
          console.log("store:", { response });
          if (!response) {
            set((state) => ({
              tasks: state.tasks.filter((t) => t.id != id),
            }));
          }

          return "error";
        },
        updateTask: async (id, task) => {
          const user = useUserStore.getState().user;
          const response = await todoAPI.updateTodo(user, id, task);
          if (response) {
            set((state) => ({
              tasks: state.tasks.map((t) => (t.id == id ? task : t)),
            }));
            return undefined;
          }

          return "error";
        },
      }),
      {
        name: "task-storage",
      }
    )
  )
);

export { useTaskStore };
