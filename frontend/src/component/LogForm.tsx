"use client";

import { LogFormAction } from "@/model/enum";
import { helper } from "@/util/helper";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z, ZodSchema } from "zod";
import Input from "@/component/form/Input";
import Button from "@/component/form/Button";
import ResetIcon from "@/icon/ResetIcon";
import { constant } from "@/util/constant";
import { useRouter } from "next/navigation";
import { userLogin, userRegister } from "@/action/server/user";
import { ApiResponse } from "@/model/response";
import { RegisterModel, UserModel } from "@/model/user";
import toast from "react-hot-toast";

const LoginSchema = z.object({
  username: z.string().min(6),
  password: z.string().min(6),
  email: z.string().optional(),
});

const RegisterSchema = z.object({
  username: z
    .string()
    .min(6)
    .refine((u) => /^\w+$/.test(u), {
      message: "Username must be alphanumeric and/or underscore",
    }),
  password: z
    .string()
    .min(6)
    .refine((p) => /[A-Z]/.test(p), {
      message: "Password must contain at least one uppercase letter",
    })
    .refine((p) => /\d/.test(p), {
      message: "Password must contain at least one digit",
    }),
  email: z.string().email(),
});

const getSchema = (action: LogFormAction): ZodSchema => {
  return action === LogFormAction.Login ? LoginSchema : RegisterSchema;
};

const defaultValues = {
  username: "",
  password: "",
  email: "",
};

type LogFormSchemaType = z.infer<typeof RegisterSchema>;

export default function LogForm({ action }: { action: LogFormAction }) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  }: any = useForm<LogFormSchemaType>({
    resolver: zodResolver(getSchema(action)),
    defaultValues,
  });

  const handleLogAction = async (data: LogFormSchemaType) => {
    if (action === LogFormAction.Login) {
      const response = await userLogin(data.username, data.password);

      if (!ApiResponse.instanceOf<UserModel>(response)) {
        toast.error("unknown error");
        return;
      }
      if (response.error) {
        toast.error(response.error.message);
        return;
      }

      if (!response.data || !response.data.token) {
        toast.error("unknown data error");
        return;
      }

      helper.setLocalStorage(constant.TOKEN, `Bearer ${response.data.token}`);
      router.push("/");
      return;
    }

    const response = await userRegister(
      data.username,
      data.password,
      data.email,
    );

    if (!ApiResponse.instanceOf<RegisterModel>(response)) {
      toast.error("unknown error");
      return;
    }

    console.log(response);

    if (response.error) {
      toast.error(response.error.message);
      return;
    }

    if (!response.data || !response.data.ok) {
      toast.error("unknown data error");
      return;
    }

    toast.success("Registered successfully, please login", {
      duration: 5000,
    });
    router.push("/login");
  };

  const handleLogError = (error: any) => {
    console.log(error);
  };

  const handleReset = () => {
    reset(defaultValues);
  };

  return (
    <div className="w-full xs:w-2/3 md:w-[400px]">
      <div className="flex justify-center">
        <h1 className="mb-3 rounded-lg px-4 py-1 text-center text-lg font-bold text-secondary underline shadow-title">
          {helper.capitalize(action)}
        </h1>
      </div>
      <form
        className="flex flex-col gap-2"
        onSubmit={handleSubmit(handleLogAction, handleLogError)}
      >
        <Input
          {...register("username")}
          placeholder="Username"
          error={errors.username}
        />
        <Input
          {...register("password")}
          type="password"
          placeholder="Password"
          error={errors.password}
        />
        {action === LogFormAction.Register && (
          <Input
            {...register("email")}
            placeholder="Email"
            error={errors.email}
          />
        )}
        <div className="flex w-full justify-center gap-2">
          <Button type="submit" className="w-full px-3">
            {helper.capitalize(action)}
          </Button>
          <Button
            type="button"
            onClick={handleReset}
            className="flex-1 bg-slate-600 px-2"
          >
            <ResetIcon />
          </Button>
        </div>
        <Footer action={action} />
      </form>
    </div>
  );
}

const Footer = ({ action }: { action: LogFormAction }) => {
  const router = useRouter();

  const redirectTo = (): string => {
    return action === LogFormAction.Login ? "/register" : "/login";
  };

  const msg =
    action === LogFormAction.Login
      ? "Don't have an account?"
      : "Already have an account?";

  const buttonText = action === LogFormAction.Login ? "Register" : "Login";

  return (
    <div className="flex items-center">
      <p className="text-sm text-slate-300">{msg}&nbsp;</p>
      <a href={redirectTo()} className="text-white underline">
        {buttonText}
      </a>
    </div>
  );
};
