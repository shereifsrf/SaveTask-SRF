import { Grid, IconButton, Paper, Typography } from "@mui/material";
import { TaskModel } from "../../models/task";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTaskStore } from "../../store/task-store";
import { ModeEdit } from "@mui/icons-material";
import { useState } from "react";
import UpdateTask from "./update-task";

interface TaskProps {
  task: TaskModel;
}

const Task = ({ task }: TaskProps) => {
  const removeTask = useTaskStore((state) => state.removeTask);
  const [openModal, setOpenModal] = useState(false);

  return (
    task && (
      <Paper
        sx={{
          p: 2,
          pb: 1,
          mb: 1,
          boxShadow: 1,
          borderRadius: 5,
          display: "flex",
          justifyItems: "space-between",
          justifyContent: "space-between",
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={7} sm={9}>
            <Typography variant="h6">{task.todoName ?? ""}</Typography>
            <Typography>{task.details ?? ""}</Typography>
          </Grid>
          <Grid item xs={3} sm={2}>
            <Typography>
              {new Date(task.dueDate).toLocaleDateString() ?? ""}
            </Typography>
            <Typography>
              {task.isCompleted ?? false ? "Done" : "Pending"}
            </Typography>
          </Grid>
          <Grid item xs={2} sm={1}>
            <IconButton
              color="primary"
              aria-label="edit"
              size="small"
              onClick={() => setOpenModal(true)}
            >
              <ModeEdit fontSize="inherit" />
            </IconButton>
            <IconButton
              aria-label="delete"
              size="small"
              color="error"
              onClick={() => {
                removeTask(task.id ?? "");
              }}
            >
              <DeleteIcon fontSize="inherit" />
            </IconButton>
          </Grid>
        </Grid>
        <UpdateTask task={task} open={openModal} setOpen={setOpenModal} />
      </Paper>
    )
  );
};

export default Task;
