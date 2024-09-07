import LogForm from "@/component/LogForm";
import { LogFormAction } from "@/model/enum";
import React from "react";

export default function RegisterPage() {
  return (
    <div>
      <LogForm action={LogFormAction.Register} />
    </div>
  );
}
