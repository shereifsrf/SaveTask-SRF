import axios from "axios";
import { UserModel } from "../../models/user";
import { TaskModel } from "../../models/task";

const server = import.meta.env.VITE_SERVER_URL;

interface todoAPI {
  getTodos: (user: UserModel) => Promise<Array<TaskModel>>;
  addTodo: (user: UserModel, task: TaskModel) => Promise<TaskModel | undefined>;
  removeTodo: (user: UserModel, id: string) => Promise<string | undefined>;
  updateTodo: (
    user: UserModel,
    id: string,
    task: TaskModel
  ) => Promise<TaskModel | undefined>;
}

const todoAPI: todoAPI = {
  getTodos: async (user) => {
    try {
      // add header from user
      var response = await axios.get(`${server}/todos`, {
        headers: {
          Authorization: `Bearer ${user.token?.token}`,
        },
      });
      if (response.status === 200) {
        return response.data as Array<TaskModel>;
      }
    } catch (error) {
      return [];
    }
    return [];
  },
  addTodo: async (user, task) => {
    // clear id
    task.id = undefined;
    try {
      // add header from user
      var response = await axios.post(`${server}/todos`, task, {
        headers: {
          Authorization: `Bearer ${user.token?.token}`,
        },
      });
      if (response.status === 201) {
        return response.data as TaskModel;
      }
    } catch (error) {
      return undefined;
    }
    return undefined;
  },
  removeTodo: async (user, id) => {
    try {
      const response = await axios.delete(`${server}/todos/${id}`, {
        headers: {
          Authorization: `Bearer ${user.token?.token}`,
        },
      });
      if (response.status === 200) {
        console.log("response", response);
        return undefined;
      }
    } catch (error) {
      console.log("error", error);
      return error as string;
    }
    return "error";
  },
  updateTodo: async (user, id, task) => {
    try {
      const response = await axios.put(`${server}/todos/${id}`, task, {
        headers: {
          Authorization: `Bearer ${user.token?.token}`,
        },
      });
      if (response.status === 200) {
        return response.data as TaskModel;
      }
    } catch (error) {
      console.log("error", error);
      return undefined;
    }
    return undefined;
  },
};

export default todoAPI;
