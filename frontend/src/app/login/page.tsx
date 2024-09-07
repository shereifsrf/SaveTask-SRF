import LogForm from "@/component/LogForm";
import { LogFormAction } from "@/model/enum";
import React from "react";

export default function LoginPage() {
  return (
    <div>
      <LogForm action={LogFormAction.Login} />
    </div>
  );
}
