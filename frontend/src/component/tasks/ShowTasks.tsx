"use client";

import React, { useEffect } from "react";
import { TaskModel } from "@/model/task";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useQueryTasks } from "@/action/query";
import Task from "./Task";
import { updateTask } from "@/action/task";
import { useTask } from "../App";
import { helper } from "@/util/helper";
import { constant } from "@/util/constant";
import { ApiError } from "@/model/error";
import { redirect } from "next/navigation";

const LIMIT = 5;

function ShowTasks() {
  const [items, setItems] = React.useState<TaskModel[]>();
  const { selectedStatus } = useTask();

  const sensors = useSensors(
    // useSensor(PointerSensor, {
    //   activationConstraint: {
    //     distance: 5,
    //   },
    // }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const {
    data,
    isLoading,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isError,
    error,
  } = useQueryTasks(LIMIT, selectedStatus!);

  useEffect(() => {
    setItems(data?.pages.flat());
  }, [data]);

  const reorderTasks = async (e: DragEndEvent) => {
    if (e.over?.id === e.active.id) {
      return;
    }

    if (e.active.id === e.over?.id) return;
    if (items == undefined) return;

    const activeIdx = items.findIndex((item) => item.id === e.active.id);
    const overIdx = items.findIndex((item) => item.id === e.over!.id);
    const over = items[overIdx];
    const isUpwards = activeIdx > overIdx;

    let portion = 0.1;
    // if upwards drag, add portion, otherwise subtract portion
    if (!isUpwards) portion = -portion;

    let order = over.order + portion;
    let prevOverOrder = 0;
    // over is not end items => upwards: first item, downwards: last item
    if (
      (isUpwards && overIdx !== 0) ||
      (!isUpwards && overIdx !== items.length - 1)
    ) {
      // get the prev item of over
      prevOverOrder = isUpwards
        ? items[overIdx - 1].order
        : items[overIdx + 1].order;
    } else {
      if (isUpwards) prevOverOrder = Math.ceil(over.order);
      else prevOverOrder = Math.floor(over.order);
    }

    // over and prevOver orders should not be equal, if equal then (1+1)/2 = 1. no difference,
    // so for now just ignore it as next drag can cater
    if (
      over.order !== prevOverOrder &&
      ((isUpwards && prevOverOrder <= order) ||
        (!isUpwards && prevOverOrder >= order))
    ) {
      order = (over.order + prevOverOrder) / 2;
    }

    const task = { ...items[activeIdx], order: order };
    // const active = items[activeIdx];
    // console.log(
    //   `${active.name}-${active.order}`,
    //   `${over.name}-${over.order}`,
    //   order
    // );
    const updated = arrayMove(items, activeIdx, overIdx);
    updated[overIdx] = task;
    setItems(updated);
    await updateTask(task.id, task, helper.getLocalStorage(constant.TOKEN, ""));
  };

  const navText =
    !isLoading && !isFetching
      ? items?.length === 0
        ? "No More"
        : "Load More"
      : "Loading...";

  if (isError && error instanceof ApiError && error.status === 401) {
    redirect("/login");
  }
  return (
    <section className="touch-manipulation">
      <DndContext
        onDragEnd={reorderTasks}
        sensors={sensors}
        collisionDetection={closestCenter}
      >
        <SortableContext
          items={items ?? []}
          strategy={verticalListSortingStrategy}
        >
          <ul className="flex flex-col gap-2 ">
            {items?.map((task) => {
              return (
                <li key={task.id} className="">
                  <Task task={task} />
                </li>
              );
            })}
          </ul>
        </SortableContext>
      </DndContext>
      <div className="p-1 flex gap-2 mt-2">
        <button
          className="flex w-full justify-center enabled:hover:bg-primary p-2 enabled:hover:text-white bg-secondary disabled:text-slate-400 text-sm rounded-md hover:ring-2 hover:ring-secondary "
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetching || isLoading}
        >
          {navText}
        </button>
      </div>
    </section>
  );
}

export default ShowTasks;
