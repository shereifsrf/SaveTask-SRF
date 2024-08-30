"use client";

import { useQueryClient } from "@tanstack/react-query";
import { deleteTask, updateTask } from "../action/task";
import BackIcon from "../icons/BackIcon";
import DeleteIcon from "../icons/DeleteIcon";
import TickIcon from "../icons/TickIcon";
import MoreIcon from "../icons/MoreIcon";
import { TaskModel, TaskStatus } from "../model/task";
import { helper } from "../util/helper";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import EditIcon from "../icons/EditIcon";
import { useTask } from "./App";
import { useEffect, useRef, useState } from "react";

const Task = ({ task }: { task: TaskModel }) => {
  const [expand, setExpand] = useState(false);
  const [clamped, setClamped] = useState(false);
  const descriptionRef = useRef<HTMLParagraphElement>(null);

  const queryClient = useQueryClient();
  const { setSelected, nameInputRef } = useTask();

  useEffect(() => {
    const element = descriptionRef.current;
    if (element) {
      setClamped(element.scrollHeight > element.clientHeight);
    }
  }, [task]);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: task.id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleDeleteIcon = async () => {
    await deleteTask(task.id);
    queryClient.invalidateQueries({ queryKey: ["tasks"] });
  };

  const handleStatusIcon = async () => {
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

  const handleEditIcon = () => {
    setSelected(task);
    console.log("should see focus", nameInputRef);
    nameInputRef.current?.focus();
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
        <p className="text-sm font-semibold">{helper.formatDate(task.date)}</p>
      </div>
      <p
        onClick={() => {
          if (clamped) setExpand(!expand);
        }}
        ref={descriptionRef}
        className={helper.cn(
          "whitespace-pre-line pl-2 text-black text-opacity-60 break-words line-clamp-3",
          { "line-clamp-none": expand }
        )}
      >
        {task.description}
      </p>

      <div className="flex justify-between">
        {clamped && (
          <button onClick={() => setExpand(!expand)}>
            <div
              className={helper.cn({
                "rotate-180": expand,
              })}
            >
              <MoreIcon />
            </div>
          </button>
        )}

        <div className="flex justify-end flex-1">
          <button onClick={handleEditIcon}>
            <EditIcon />
          </button>
          <button onClick={handleDeleteIcon}>
            <DeleteIcon />
          </button>
          <button onClick={handleStatusIcon}>
            {task.status === TaskStatus.Pending ? <TickIcon /> : <BackIcon />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Task;
