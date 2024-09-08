import LogForm from "@/component/LogForm";
import { LogFormAction } from "@/model/enum";
import React from "react";

export default function LoginPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center align-middle">
      <LogForm action={LogFormAction.Login} />
    </div>
  );
}
