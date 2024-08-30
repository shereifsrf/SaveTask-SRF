"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { createContext, useContext, useEffect, useRef } from "react";
import TaskForm from "./TaskForm";
import { TaskModel, TaskStatus } from "@/model/task";
import ShowTasks from "./tasks/ShowTasks";
import TaskStatuses from "./tasks/TaskStatus";

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
    localStorage.setItem("selectedStatus", status);
  };

  useEffect(() => {
    // get status from localStorage
    const status = localStorage.getItem("selectedStatus");
    if (status) {
      setSelectedStatusExtra(status as TaskStatus);
    } else setSelectedStatusExtra(TaskStatus.Pending);
  }, []);

  return (
    <TaskContext.Provider
      value={{
        selectedTask,
        setSelectedTask,
        nameInputRef,
        selectedStatus,
        setSelectedStatus: setSelectedStatusExtra,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

function App() {
  return (
    <TaskProvider>
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
    </TaskProvider>
  );
}

export default App;
