import { create } from "zustand";
import { TaskModel } from "../models/task";
import { devtools, persist } from "zustand/middleware";
import { UserModel, defaultUser } from "../models/user";
import userAPI from "../util/apis/user-api";
import todoAPI from "../util/apis/todo-api";

interface TaskState {
  // task is a map of TaskModel
  user: UserModel;
  // async login
  login: (username: string, password: string) => Promise<String | undefined>;
  logout: () => void;
  register: (
    username: string,
    password: string,
    email: string
  ) => Promise<String | undefined>;
  guestLogin: (guestName: string) => void;

  tasks: Array<TaskModel>;
  getTasks: () => Promise<void>;
  addTask: (task: TaskModel) => Promise<String | undefined>;
  removeTask: (id: string) => void;
  updateTask: (task: TaskModel) => void;
}

const useTaskStore = create<TaskState>()(
  devtools(
    persist(
      (set) => ({
        user: defaultUser,
        login: async (username, password) => {
          const { user, err } = await userAPI.login(username, password);
          if (err) {
            set(() => ({ user: defaultUser }));
            return err;
          }
          if (user) {
            set(() => ({ user }));
            return undefined;
          }
        },
        logout: () => set(() => ({ user: defaultUser })),
        register: async (username, password, email) => {
          const { user, err } = await userAPI.register(
            username,
            password,
            email
          );

          if (err) {
            set(() => ({ user: defaultUser }));
            return err;
          }
          if (user) {
            set(() => ({ user }));
            return undefined;
          }
        },
        guestLogin: (guestName) => {
          userAPI.guestLogin(guestName);
          set(() => ({
            user: { name: guestName, isLogged: true, isGuest: true },
          }));
        },

        tasks: [],
        getTasks: async () => {
          const tasks = await todoAPI.getTodos(useTaskStore.getState().user);
          set(() => ({ tasks: tasks }));
        },
        addTask: async (task) => {
          const response = await todoAPI.addTodo(
            useTaskStore.getState().user,
            task
          );
          console.log("store:", { response });
          if (response) {
            set((state) => ({ tasks: [...state.tasks, task] }));
            return undefined;
          }
          return "Error adding task";
        },
        removeTask: (id) =>
          set((state) => ({
            tasks: state.tasks.filter((task) => task.id !== id),
          })),
        updateTask: (task) =>
          set((state) => ({
            tasks: state.tasks.map((t) => (t.id === task.id ? task : t)),
          })),
      }),
      {
        name: "task-storage",
      }
    )
  )
);

export { useTaskStore };
