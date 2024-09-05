"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, {
  createContext,
  use,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import TaskForm from "./TaskForm";
import { TaskModel, TaskStatus } from "@/model/task";
import ShowTasks from "./tasks/ShowTasks";
import TaskStatuses from "./tasks/TaskStatus";
import { helper } from "@/util/helper";

function App() {
  return (
    <TaskProvider>
      <AppClient />
    </TaskProvider>
  );
}

const queryClient = new QueryClient();

interface ITask {
  selectedTask: TaskModel | undefined;
  setSelectedTask: React.Dispatch<React.SetStateAction<TaskModel | undefined>>;

  nameInputRef: React.RefObject<HTMLInputElement>;

  selectedStatus: TaskStatus | undefined;
  setSelectedStatus: (status: TaskStatus) => void;
}

const TaskContext = createContext({} as ITask);
export const useTask = () => useContext(TaskContext);

function TaskProvider({ children }: { children: React.ReactNode }) {
  const [selectedTask, setSelectedTask] = React.useState<TaskModel>();
  const [selectedStatus, setSelectedStatus] = React.useState<TaskStatus>();
  const nameInputRef = useRef<HTMLInputElement>(null);

  const setSelectedStatusExtra = (status: TaskStatus) => {
    setSelectedStatus(status);
    // add to the localStorage as well
    helper.setLocalStorage("selectedStatus", status);
  };

  useEffect(() => {
    // get status from localStorage
    setSelectedStatusExtra(
      helper.getLocalStorage("selectedStatus", TaskStatus.Pending) as TaskStatus
    );
  }, []);

  const value = {
    selectedTask,
    setSelectedTask,
    selectedStatus,
    setSelectedStatus: setSelectedStatusExtra,
    nameInputRef,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

const AppClient = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex w-full flex-col sm:flex-row gap-x-2 gap-y-4">
        <div className="sm:w-1/3 flex justify-center">
          <TaskForm />
        </div>
        <div className="sm:w-full flex flex-col gap-2 overflow-hidden">
          <div className="flex justify-center p-1">
            <TaskStatuses />
          </div>
          <ShowTasks />
        </div>
      </div>
    </QueryClientProvider>
  );
};

export default App;
