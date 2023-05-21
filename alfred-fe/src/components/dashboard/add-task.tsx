import { Box, Button, TextField, Typography } from "@mui/material";
import { TaskModel, defaultTask } from "../../models/task";
import { useTaskStore } from "../../store/store";
import { useForm, Controller } from "react-hook-form";
import BasicDatePicker from "../input/date-picker";
import dayjs from "dayjs";
import { useState } from "react";

const AddTask = () => {
  const [err, setErr] = useState<String | undefined>();

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
  });

  const addNewTask = async (task: TaskModel) => {
    task.id = Date.now().toString();
    // if response has error, then try again after 1s

    let count = 0;
    while (count < 2) {
      console.log("trying to add task");
      const error = await addTask(task);
      console.log("added task");
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
  };

  return (
    // box with contents spacing
    <form onSubmit={handleSubmit(addNewTask)}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          boxShadow: 1,
          p: 2,
          borderRadius: 5,
        }}
      >
        <TextField
          required
          variant="outlined"
          label="Todo"
          fullWidth
          {...register("todoName", { required: true })}
          error={!!errors.todoName}
          helperText={
            errors.todoName?.type === "required" && "Name is required"
          }
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

        <Button variant="contained" fullWidth type="submit">
          Add
        </Button>
        {/* error typography to show error is its not empty */}

        <Typography color="error" variant="body2">
          {err}
        </Typography>
      </Box>
    </form>
  );
};

export default AddTask;
