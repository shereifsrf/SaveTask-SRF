import { Box } from "@mui/material";
import Task from "./task";
import { useTaskStore } from "../../store/store";

export function ShowTasks() {
  const tasks = useTaskStore((state) => state.tasks);

  return (
    <Box>
      {/* show task from the end */}
      {tasks
        .slice(0)
        .reverse()
        .map((task) => (
          <Task key={task.id} task={task} />
        ))}
    </Box>
  );
}
