"use client";

import { useQueryClient } from "@tanstack/react-query";
import { deleteTask, updateTask } from "@/action/server/task";
import BackIcon from "@/icon/BackIcon";
import DeleteIcon from "@/icon/DeleteIcon";
import TickIcon from "@/icon/TickIcon";
import MoreIcon from "@/icon/MoreIcon";
import { TaskModel, TaskStatus } from "@/model/task";
import { helper } from "@/util/helper";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import EditIcon from "@/icon/EditIcon";
import { useEffect, useRef, useState } from "react";
import { useTask } from "../App";
import { constant } from "@/util/constant";

const Task = ({ task }: { task: TaskModel }) => {
  const [expand, setExpand] = useState(false);
  const [clamped, setClamped] = useState(false);
  const descriptionRef = useRef<HTMLParagraphElement>(null);

  const queryClient = useQueryClient();
  const { setSelectedTask, nameInputRef } = useTask();

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
    setSelectedTask(undefined);
    await deleteTask(task.id, helper.getLocalStorage(constant.TOKEN, ""));
    queryClient.invalidateQueries({ queryKey: ["tasks"] });
  };

  const handleStatusIcon = async () => {
    setSelectedTask(undefined);
    const taskToUpdate = {
      ...task,
      status:
        task.status === TaskStatus.Pending
          ? TaskStatus.Done
          : TaskStatus.Pending,
    };
    await updateTask(
      task.id,
      taskToUpdate,
      helper.getLocalStorage(constant.TOKEN, ""),
    );
    queryClient.invalidateQueries({ queryKey: ["tasks"] });
  };

  const handleEditIcon = () => {
    setSelectedTask(task);
    console.log("should see focus", nameInputRef);
    nameInputRef.current?.focus();
  };

  return (
    <div
      className="flex flex-col gap-1 rounded-lg bg-secondary p-2"
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <div className="flex justify-between gap-2">
        <h1 className="font-bold">{task.name}</h1>
        <p className="text-sm font-semibold">{helper.formatDate(task.date)}</p>
      </div>
      <p
        onClick={() => {
          if (clamped) setExpand(!expand);
        }}
        ref={descriptionRef}
        className={helper.cn(
          "line-clamp-3 whitespace-pre-line break-words px-2 text-black text-opacity-60",
          { "line-clamp-none": expand },
        )}
      >
        {task.description}
      </p>

      <div className="flex justify-between">
        {clamped ? (
          <button onClick={() => setExpand(!expand)}>
            <div
              className={helper.cn({
                "rotate-180": expand,
              })}
            >
              <MoreIcon />
            </div>
          </button>
        ) : (
          <span></span>
        )}

        <div className="flex justify-center">
          <Icon onClick={handleEditIcon}>
            <EditIcon />
          </Icon>
          <Icon onClick={handleDeleteIcon}>
            <DeleteIcon />
          </Icon>
          <Icon onClick={handleStatusIcon}>
            {task.status === TaskStatus.Pending ? <TickIcon /> : <BackIcon />}
          </Icon>
        </div>
      </div>
    </div>
  );
};

const Icon = ({
  onClick,
  children,
}: {
  onClick: () => Promise<void> | void;
  children: React.ReactNode;
}) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    await onClick();
    setLoading(false);
  };

  return (
    <button
      className="flex w-6 justify-center"
      onClick={handleClick}
      disabled={loading}
    >
      {loading ? <Spinner /> : children}
    </button>
  );
};

const Spinner = () => {
  return (
    <div className="border-secondary/60 h-5 w-5 animate-spin rounded-full border-2 border-t-primary"></div>
  );
};

export default Task;
