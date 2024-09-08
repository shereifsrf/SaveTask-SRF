"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { addTask, updateTask } from "@/action/server/task";
import { DateFormat, helper } from "@/util/helper";
import { useQueryClient } from "@tanstack/react-query";
import { useTask } from "./App";
import ResetIcon from "@/icon/ResetIcon";
import { constant } from "@/util/constant";
import Input from "@/component/form/Input";
import Button from "./form/Button";

enum FormAction {
  Add = "Add",
  Edit = "Edit",
}

const TaskFormSchema = z.object({
  name: z.string().min(5),
  description: z.string(),
  date: z.string().min(10).max(10),
});
type TaskFormSchemaType = z.infer<typeof TaskFormSchema>;

const defaultValues: TaskFormSchemaType = {
  name: "",
  description: "",
  date: helper.formatDate(new Date().toISOString(), DateFormat.yyyyMMdd),
};

function TaskForm() {
  const [pushing, setPushing] = useState(false);
  const { selectedTask, setSelectedTask, nameInputRef } = useTask();
  const action = selectedTask ? FormAction.Edit : FormAction.Add;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormSchemaType>({
    resolver: zodResolver(TaskFormSchema),
    defaultValues,
  });
  const queryClient = useQueryClient();
  const { ref, ...rest } = register("name");

  useEffect(() => {
    if (selectedTask === undefined) return;
    reset({
      name: selectedTask.name,
      description: selectedTask.description,
      date: helper.formatDate(selectedTask.date, DateFormat.yyyyMMdd),
    });
  }, [selectedTask, reset]);

  const handleSuccess = async (data: TaskFormSchemaType) => {
    setPushing(true);
    if (action === FormAction.Edit) {
      await updateTask(
        selectedTask!.id,
        {
          ...selectedTask!,
          ...data,
        },
        helper.getLocalStorage(constant.TOKEN, ""),
      );
    } else
      await addTask(
        data.name,
        data.description,
        data.date,
        helper.getLocalStorage(constant.TOKEN, ""),
      );
    console.log("invalidate");
    queryClient.invalidateQueries({ queryKey: ["tasks"] });
    setPushing(false);
  };

  const handleError = (errors: any) => {
    console.log(errors);
  };

  const handleReset = () => {
    reset(defaultValues);
    setSelectedTask(undefined);
  };

  return (
    <form
      className="sm:w-full flex w-[15rem] flex-col gap-2"
      onSubmit={handleSubmit(handleSuccess, handleError)}
    >
      <Input
        {...rest}
        ref={(e) => {
          ref(e);
          // @ts-ignore => this works for focus call from another component
          nameInputRef.current = e;
        }}
        className=""
        placeholder="Name"
        error={errors.name}
      />
      <Input
        {...register("description")}
        placeholder="Description"
        multiline
        error={errors.description}
      />
      <Input
        {...register("date")}
        type="date"
        className=""
        placeholder="Date"
        error={errors.date}
      />
      <div className="flex w-full gap-2 p-1">
        <Button
          disabled={pushing}
          type="submit"
          className="w-full disabled:bg-secondary"
        >
          {action}
        </Button>
        <Button
          disabled={pushing}
          type="button"
          onClick={handleReset}
          className="flex-1 bg-slate-600 px-1"
        >
          <ResetIcon />
        </Button>
      </div>
    </form>
  );
}

export default TaskForm;
