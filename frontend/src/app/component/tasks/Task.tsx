"use client";

import { useQueryClient } from "@tanstack/react-query";
import { deleteTask, updateTask } from "@/action/task";
import BackIcon from "@/icons/BackIcon";
import DeleteIcon from "@/icons/DeleteIcon";
import TickIcon from "@/icons/TickIcon";
import MoreIcon from "@/icons/MoreIcon";
import { TaskModel, TaskStatus } from "@/model/task";
import { helper } from "@/util/helper";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import EditIcon from "@/icons/EditIcon";
import { useEffect, useRef, useState } from "react";
import { useTask } from "../App";

const Task = ({ task }: { task: TaskModel }) => {
  const [expand, setExpand] = useState(false);
  const [clamped, setClamped] = useState(false);
  const descriptionRef = useRef<HTMLParagraphElement>(null);

  const queryClient = useQueryClient();
  const { setSelectedTask, nameInputRef, pass } = useTask();

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
    await deleteTask(task.id, pass);
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
    await updateTask(task.id, taskToUpdate, pass);
    queryClient.invalidateQueries({ queryKey: ["tasks"] });
  };

  const handleEditIcon = () => {
    setSelectedTask(task);
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
          "whitespace-pre-line px-2 text-black text-opacity-60 break-words line-clamp-3",
          { "line-clamp-none": expand }
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
      className="w-6 flex justify-center"
      onClick={handleClick}
      disabled={loading}
    >
      {loading ? <Spinner /> : children}
    </button>
  );
};

const Spinner = () => {
  return (
    <div className="animate-spin rounded-full h-5 w-5 border-2 border-secondary/60 border-t-primary"></div>
  );
};

export default Task;
