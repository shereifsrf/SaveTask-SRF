"use client";

import { useQueryClient } from "@tanstack/react-query";
import { deleteTask, updateTask } from "../action/task";
import BackIcon from "../icons/BackIcon";
import DeleteIcon from "../icons/DeleteIcon";
import TickIcon from "../icons/TickIcon";
import { TaskModel, TaskStatus } from "../model/task";
import { helper } from "../util/helper";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import EditIcon from "../icons/EditIcon";
import { useTask } from "./App";

const Task = ({ task }: { task: TaskModel }) => {
  const queryClient = useQueryClient();
  const { setSelected } = useTask();

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: task.id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleDeleteTask = async () => {
    await deleteTask(task.id);
    queryClient.invalidateQueries({ queryKey: ["tasks"] });
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
    queryClient.invalidateQueries({ queryKey: ["tasks"] });
  };
  return (
    <div
      className="bg-secondary rounded-lg p-2 flex flex-col gap-1"
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <div className=" flex justify-between gap-2">
        <h1 className="font-bold ">{task.name}</h1>
        <p className="">{helper.formatDate(task.date)}</p>
      </div>
      <div className="flex justify-between">
        <p className="whitespace-pre-line pl-2">{task.description}</p>
        <div className="flex items-end">
          <button onClick={() => setSelected(task)}>
            <EditIcon />
          </button>
          <button onClick={handleDeleteTask}>
            <DeleteIcon />
          </button>
          <button onClick={handleUpdateTask}>
            {task.status === TaskStatus.Pending ? <TickIcon /> : <BackIcon />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Task;
