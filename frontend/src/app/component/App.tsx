"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { createContext, useContext } from "react";
import TaskForm from "./TaskForm";
import ShowTasks from "./ShowTasks";
import { TaskModel } from "../model/task";

const queryClient = new QueryClient();

interface ITask {
  selected: TaskModel | undefined;
  setSelected: React.Dispatch<React.SetStateAction<TaskModel | undefined>>;
}

const TaskContext = createContext({} as ITask);
export const useTask = () => useContext(TaskContext);

function TaskProvider({ children }: { children: React.ReactNode }) {
  const [selected, setSelected] = React.useState<TaskModel>();

  return (
    <TaskContext.Provider value={{ selected, setSelected }}>
      {children}
    </TaskContext.Provider>
  );
}

function App() {
  return (
    <TaskProvider>
      <QueryClientProvider client={queryClient}>
        <div className="flex w-full flex-col sm:flex-row gap-x-2 gap-y-4 overflow-hidden">
          <div className="sm:w-1/3 flex justify-center">
            <TaskForm />
          </div>
          <div className="sm:w-full">
            <ShowTasks />
          </div>
        </div>
      </QueryClientProvider>
    </TaskProvider>
  );
}

export default App;
