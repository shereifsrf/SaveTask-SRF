import { Box, Button, TextField } from "@mui/material";
import { TaskModel, defaultTask } from "../../models/task";
import { useTaskStore } from "../../store/store";
import { useForm, Controller } from "react-hook-form";
import BasicDatePicker from "../input/date-picker";
import dayjs from "dayjs";

const AddTask = () => {
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

  const addNewTask = (task: TaskModel) => {
    task.id = Date.now();
    addTask(task);
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
          {...register("name", { required: true })}
          error={!!errors.name}
          helperText={errors.name?.type === "required" && "Name is required"}
        />
        <TextField
          variant="outlined"
          label="Notes"
          multiline
          fullWidth
          rows={2}
          {...register("description")}
        />
        {/* <TextField
          variant="outlined"
          label="Due"
          type="date"
          fullWidth
          InputLabelProps={{ shrink: true }}
          defaultValue={defaultTask.dueDate?.toISOString().split("T")[0]}
          onChange={(e) => {
            console.log(e.target.value);
            setValue("dueDate", new Date(e.target.value));
          }}
        /> */}
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
      </Box>
    </form>
  );
};

export default AddTask;
