"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import TaskForm from "./TaskForm";
import ShowTasks from "./ShowTasks";

const queryClient = new QueryClient();

function App() {
  return (
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
  );
}

export default App;
