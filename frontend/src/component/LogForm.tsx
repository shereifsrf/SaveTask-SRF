"use client";

import { LogFormAction } from "@/model/enum";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const LogFormSchema = z.object({
  username: z.string().min(5),
  password: z
    .string()
    .min(6)
    .refine((p) => /[A-Z]/.test(p), {
      message: "Password must contain at least one uppercase letter",
    })
    .refine((p) => /\d/.test(p), {
      message: "Password must contain at least one digit",
    }),
  email: z.string().email().optional(),
});

const defaultValues = {
  username: "",
  password: "",
  email: "",
};

type LogFormSchemaType = z.infer<typeof LogFormSchema>;

export default function LogForm({ action }: { action: LogFormAction }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  }: any = useForm<LogFormSchemaType>({
    resolver: zodResolver(LogFormSchema),
    defaultValues,
  });

  return <div>{action}</div>;
}
