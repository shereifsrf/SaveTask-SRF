"use server";
import { constant } from "@/util/constant";
import { TaskModel, TaskStatus } from "../model/task";
import { helper } from "@/util/helper";

const url = process.env.NEXT_PUBLIC_TASK_BACKEND_URL;

export const addTask = async (
  name: string,
  description: string,
  date: string
) => {
  const dateC = new Date(date);
  //
  // call post method to url to add task using fetch
  const response = await fetch(`${url}/task`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      [constant.Authorization]: helper.getLocalStorage(constant.TOKEN, ""),
    },
    body: JSON.stringify({
      name: name,
      description: description,
      date: dateC.toISOString(),
      status: TaskStatus.Pending,
    }),
  });

  console.log(response);

  return response.status === 200;
};

export const getTasks = async () => {
  const response = await fetch(`${url}/task`, {
    headers: {
      [constant.Authorization]: helper.getLocalStorage(constant.TOKEN, ""),
    },
    method: "GET",
    cache: "no-store",
  });

  return response.json();
};

export const deleteTask = async (id: string) => {
  const response = await fetch(`${url}/task/${id}`, {
    headers: {
      [constant.Authorization]: helper.getLocalStorage(constant.TOKEN, ""),
    },
    method: "DELETE",
  });

  return response.status === 200;
};

export const updateTask = async (id: string, task: TaskModel) => {
  const dateC = new Date(task.date);
  task.date = dateC.toISOString();

  const response = await fetch(`${url}/task/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      [constant.Authorization]: helper.getLocalStorage(constant.TOKEN, ""),
    },
    body: JSON.stringify(task),
  });

  // revalidatePath("/");

  return response.status === 200;
};
