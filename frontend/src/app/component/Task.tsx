"use client";

import { deleteTask, updateTask } from "../action/task";
import BackIcon from "../icons/BackIcon";
import DeleteIcon from "../icons/DeleteIcon";
import TickIcon from "../icons/TickIcon";
import { TaskModel, TaskStatus } from "../model/task";
import { helper } from "../util/helper";

const Task = ({ task }: { task: TaskModel }) => {
  const handleDeleteTask = async () => {
    await deleteTask(task.id);
  };

  const handleUpdateTask = async () => {
    const taskToUpdate = {
      ...task,
      status:
        task.status === TaskStatus.Pending
          ? TaskStatus.Done
          : TaskStatus.Pending,
    };
    await updateTask(task.id, taskToUpdate);
  };
  return (
    <div className="flex justify-between gap-2">
      <div className="flex">
        <h1>{task.name}</h1>
        <p>{task.description}</p>
        <p>{helper.formatDate(task.date)}</p>
      </div>
      <div className="flex justify-end">
        <button onClick={handleDeleteTask}>
          <DeleteIcon />
        </button>
        <button onClick={handleUpdateTask}>
          {task.status === TaskStatus.Pending ? <TickIcon /> : <BackIcon />}
        </button>
      </div>
    </div>
  );
};

export default Task;
