import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { UserModel, defaultUser } from "../models/user";
import userAPI from "../util/apis/user-api";

interface UserState {
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
}

const useUserStore = create<UserState>()(
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
      }),
      {
        name: "user-storage",
      }
    )
  )
);

export default useUserStore;
