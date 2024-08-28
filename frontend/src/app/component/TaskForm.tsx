"use client";

import { z } from "zod";
import { FieldError, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { forwardRef } from "react";
import { addTask } from "../action/task";

const TaskFormSchema = z.object({
  name: z.string().min(5),
  description: z.string(),
  date: z.string().min(10).max(10),
});
type TaskFormSchemaType = z.infer<typeof TaskFormSchema>;

function TaskForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormSchemaType>({
    resolver: zodResolver(TaskFormSchema),
  });

  const handleSuccess = async (data: TaskFormSchemaType) => {
    console.log("let call");
    await addTask(data.name, data.description, data.date);
  };

  const handleError = (errors: any) => {
    console.log(errors);
  };

  return (
    <form
      className="flex flex-col justify-center items-center gap-2"
      onSubmit={handleSubmit(handleSuccess, handleError)}
    >
      <Input
        {...register("name")}
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
        className="w-full"
        placeholder="Date"
        error={errors.date}
      />

      <button
        type="submit"
        className="bg-slate-500 text-white px-2 py-1 rounded-lg"
      >
        Add Task
      </button>
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
    return (
      <div className="w-full">
        {multiline ? (
          <textarea {...props} ref={ref as React.Ref<HTMLTextAreaElement>} />
        ) : (
          <input
            {...props}
            className="w-full"
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
