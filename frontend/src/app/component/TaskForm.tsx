"use client";

import { z } from "zod";
import { FieldError, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { forwardRef, useEffect } from "react";
import { addTask, updateTask } from "../action/task";
import { DateFormat, helper } from "../util/helper";
import { useQueryClient } from "@tanstack/react-query";
import { useTask } from "./App";
import ResetIcon from "../icons/ResetIcon";

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
  const { selected, setSelected, nameInputRef } = useTask();
  const action = selected ? FormAction.Edit : FormAction.Add;

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
    if (selected === undefined) return;
    reset({
      name: selected.name,
      description: selected.description,
      date: helper.formatDate(selected.date, DateFormat.yyyyMMdd),
    });
  }, [selected, reset]);

  const handleSuccess = async (data: TaskFormSchemaType) => {
    if (action === FormAction.Edit) {
      await updateTask(selected!.id, {
        ...selected!,
        ...data,
      });
    } else await addTask(data.name, data.description, data.date);
    console.log("invalidate");
    queryClient.invalidateQueries({ queryKey: ["tasks"] });
  };

  const handleError = (errors: any) => {
    console.log(errors);
  };

  const handleReset = () => {
    reset(defaultValues);
    setSelected(undefined);
  };

  return (
    <form
      className="w-[15rem] sm:w-full flex flex-col gap-2"
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
        <button
          type="submit"
          className="w-full bg-primary ring-secondary ring text-white py-1 rounded-lg"
        >
          {action}
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="flex-1 px-1 bg-orange-900 w-full bg-primary ring-secondary ring text-white py-1 rounded-lg"
        >
          <ResetIcon />
        </button>
      </div>
    </form>
  );
}

interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  error?: FieldError;
  multiline?: boolean;
}

const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  ({ multiline, error, ...props }, ref) => {
    const twClass =
      "w-full rounded-lg p-2 outline-none border-2 focus:border-slate-700";
    return (
      <div className="w-full flex justify-center ">
        {multiline ? (
          <textarea
            className={helper.cn(props.className, twClass)}
            {...props}
            ref={ref as React.Ref<HTMLTextAreaElement>}
          />
        ) : (
          <input
            {...props}
            className={helper.cn(props.className, twClass)}
            ref={ref as React.Ref<HTMLInputElement>}
          />
        )}
        {error && <p className="text-[15px] text-red-500">{error.message}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

export default TaskForm;
