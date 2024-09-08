import LogForm from "@/component/LogForm";
import { LogFormAction } from "@/model/enum";
import React from "react";

export default function RegisterPage() {
  return (
    <div className="w-full flex justify-center align-middle h-screen items-center">
      <LogForm action={LogFormAction.Register} />
    </div>
  );
}
