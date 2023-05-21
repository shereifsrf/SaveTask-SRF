import {
  Box,
  Button,
  CircularProgress,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { TaskModel } from "../../models/task";
import { Controller, useForm } from "react-hook-form";
import BasicDatePicker from "../input/date-picker";
import dayjs from "dayjs";
import { useTaskStore } from "../../store/task-store";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  height: "100%",
  flexDirection: "column",
  display: "flex",
  gap: 2,
  borderRadius: 5,
};
const resolver = async (values: TaskModel) => {
  return {
    values: values.todoName.length > 0 ? values : {},
    errors: !values.todoName
      ? {
          todoName: {
            type: "required",
            message: "Todo is required",
          },
        }
      : {},
  };
};

type UpdateTaskProps = {
  task: TaskModel;
  open: boolean;
  setOpen: (open: boolean) => void;
};

const UpdateTask = ({ task, open, setOpen }: UpdateTaskProps) => {
  //   console.log({ task });
  const [err, setErr] = useState<String | undefined>();
  const [loading, setLoading] = useState(false);
  const updateTask = useTaskStore((state) => state.updateTask);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = useForm<TaskModel>({
    defaultValues: task,
    resolver,
  });

  const handleUpdate = async (updatedTask: TaskModel) => {
    setLoading(true);
    setErr(undefined);
    // if response has error, then try again after 1s

    let count = 0;
    while (count < 3) {
      const error = await updateTask(updatedTask.id ?? "", {
        ...task,
        ...updatedTask,
      });
      console.log({ error });
      if (error) {
        count++;
        // wait for 1s before trying again
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } else {
        setErr(undefined);
        setOpen(false);
      }

      if (count === 3) {
        setErr(error);
        break;
      }
    }
    setLoading(false);
  };
  return (
    <div>
      {open && (
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <form onSubmit={handleSubmit(handleUpdate)}>
            <Box sx={style}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="h6" component="h2" id="modal-modal-title">
                  Update Task
                </Typography>
                <Button
                  onClick={() => {
                    setOpen(false);
                  }}
                >
                  Close
                </Button>
              </Box>

              <TextField
                variant="outlined"
                label="Todo"
                fullWidth
                {...register("todoName", { required: true })}
                error={!!errors.todoName}
                helperText={errors.todoName?.message}
              />
              <TextField
                variant="outlined"
                label="Notes"
                multiline
                fullWidth
                rows={2}
                {...register("details")}
              />
              <Controller
                name="dueDate"
                control={control}
                render={({}) => (
                  <BasicDatePicker
                    label="Due"
                    format="ddd, DD MMM YYYY hh:mm A"
                    defaultValue={dayjs(task.dueDate) as any}
                    onChange={(date) => {
                      console.log({ date });
                      setValue("dueDate", date ?? new Date());
                    }}
                  />
                )}
              />
              {/* error typography to show error is its not empty */}

              <Typography color="error" variant="body2">
                {err}
              </Typography>

              <Button
                variant="contained"
                fullWidth
                type="submit"
                disabled={loading}
              >
                Add
                {loading && (
                  <CircularProgress sx={{ position: "absolute" }} size={20} />
                )}
              </Button>
            </Box>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default UpdateTask;
