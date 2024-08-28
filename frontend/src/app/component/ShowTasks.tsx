import React from "react";
import { getTasks } from "../action/task";
import { TaskModel } from "../model/task";
import Task from "./Task";

async function ShowTasks() {
  // get tasks using server actions
  const tasks = (await getTasks()) as TaskModel[];
  console.log({ tasks });

  return (
    <div className="">
      <ul className="list-disc pl-3">
        {tasks.map((task) => {
          return (
            <li key={task.id} className="">
              <Task task={task} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default ShowTasks;
