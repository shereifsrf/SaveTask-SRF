"use server";
import { TaskStatus } from "../model/task";

const url = "http://localhost:8080";

export const addTask = async (
  name: string,
  description: string,
  date: string
) => {
  console.log(url);
  //   change date string to be dd-mm-yyyy
  const dateC = new Date(date);
  //
  // call post method to url to add task using fetch
  const response = await fetch(`${url}/api/task`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
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
