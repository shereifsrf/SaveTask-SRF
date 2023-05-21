import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { TaskModel, defaultTask } from "../../models/task";
import { useTaskStore } from "../../store/task-store";
import { useForm, Controller } from "react-hook-form";
import BasicDatePicker from "../input/date-picker";
import dayjs from "dayjs";
import { useState } from "react";

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

const AddTask = () => {
  const [err, setErr] = useState<String | undefined>();
  const [loading, setLoading] = useState(false);

  const addTask = useTaskStore((state) => state.addTask);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    control,
  } = useForm<TaskModel>({
    defaultValues: defaultTask,
    resolver,
  });

  const addNewTask = async (task: TaskModel) => {
    setLoading(true);
    setErr(undefined);
    task.id = Date.now().toString();
    // if response has error, then try again after 1s

    let count = 0;
    while (count < 3) {
      const error = await addTask(task);
      console.log({ error });
      if (error) {
        count++;
        // wait for 1s before trying again
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } else {
        setErr(undefined);
        break;
      }

      if (count === 3) {
        setErr(error);
        break;
      }
    }

    reset(defaultTask);
    setLoading(false);
  };

  return (
    // box with contents spacing
    <form onSubmit={handleSubmit(addNewTask)}>
      <Box
        sx={{
          height: "100%",
          flexDirection: "column",
          display: "flex",
          gap: 2,
          boxShadow: 1,
          p: 2,
          borderRadius: 5,
        }}
      >
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
              defaultValue={dayjs(defaultTask.dueDate) as any}
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

        <Button variant="contained" fullWidth type="submit" disabled={loading}>
          Add
          {loading && (
            <CircularProgress sx={{ position: "absolute" }} size={20} />
          )}
        </Button>
      </Box>
    </form>
  );
};

export default AddTask;
