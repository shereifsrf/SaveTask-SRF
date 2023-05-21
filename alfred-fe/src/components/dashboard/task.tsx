import {
  Grid,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import { TaskModel } from "../../models/task";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTaskStore } from "../../store/store";
// get task and key from props
interface TaskProps {
  task: TaskModel;
}

const Task = ({ task }: TaskProps) => {
  const removeTask = useTaskStore((state) => state.removeTask);

  return (
    task && (
      <Paper
        sx={{
          p: 2,
          mb: 2,
          boxShadow: 1,
          borderRadius: 5,
          width: "100%",
        }}
      >
        <Grid container spacing={2}>
          <Grid item md={9}>
            <Typography variant="h5">{task.todoName ?? ""}</Typography>
            <Typography>{task.details ?? ""}</Typography>
          </Grid>
          <Grid item md={2}>
            <Typography>
              {new Date(task.dueDate).toLocaleDateString() ?? ""}
            </Typography>
            <Typography>
              {task.isCompleted ?? false ? "Done" : "Pending"}
            </Typography>
          </Grid>
          <Grid item md={1}>
            <IconButton
              aria-label="delete"
              size="small"
              onClick={() => {
                removeTask(task.id ?? "");
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Paper>
    )
  );
};

export default Task;
