import { TaskStatus } from "@/model/task";
import { helper } from "@/util/helper";
import React from "react";
import { useTask } from "../App";

function TaskStatuses() {
  const { selectedStatus } = useTask();

  const status = Object.values(TaskStatus).map(
    (status) => status as TaskStatus
  );
  return (
    <div className="flex ring ring-secondary rounded-lg divide-x text-center">
      {status.map((status) => (
        <div
          key={status}
          className={helper.cn("px-3 py-2 text-secondary font-bold", {
            "bg-secondary text-primary": selectedStatus === status,
          })}
        >
          <Status status={status} />
        </div>
      ))}
    </div>
  );
}

const Status = ({ status }: { status: TaskStatus }) => {
  const { setSelectedStatus } = useTask();

  return (
    <button onClick={() => setSelectedStatus(status)} key={status}>
      {helper.capitalize(status)}
    </button>
  );
};

export default TaskStatuses;
