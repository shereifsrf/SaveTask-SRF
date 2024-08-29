"use client";

import React, { useEffect } from "react";
import { TaskModel } from "../model/task";
import Task from "./Task";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { updateTask } from "../action/task";

function ShowTasks() {
  const [items, setItems] = React.useState<TaskModel[]>([]);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const { data: tasks } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const response = await fetch("http://localhost:8080/api/task");
      const data = await response.json();
      return data as TaskModel[];
    },
  });

  useEffect(() => {
    // tasks?.sort((a, b) => b.order - a.order);
    setItems(tasks ?? []);
  }, [tasks]);

  const reorderTasks = async (e: DragEndEvent) => {
    if (e.over?.id === e.active.id) {
      return;
    }

    if (e.active.id === e.over?.id) return;

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
      console.log("not end items");
      // get the prev item of over
      prevOverOrder = isUpwards
        ? items[overIdx - 1].order
        : items[overIdx + 1].order;
    } else {
      console.log("end items");
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
      console.log(
        "order is not aligned as prevOver",
        order,
        prevOverOrder,
        over.order
      );
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
    await updateTask(task.id, task);
  };

  return (
    <DndContext
      onDragEnd={reorderTasks}
      sensors={sensors}
      collisionDetection={closestCenter}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <ul className="flex flex-col gap-2">
          {items.map((task) => {
            return (
              <li key={task.id} className="">
                <Task task={task} />
              </li>
            );
          })}
        </ul>
      </SortableContext>
    </DndContext>
  );
}

export default ShowTasks;
