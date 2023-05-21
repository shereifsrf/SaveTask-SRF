import { Container } from "@mui/material";
import Grid from "@mui/material/Grid";
import { ShowTasks } from "./show-tasks";
import AddTask from "./add-task";
import { useLayoutEffect } from "react";
import { useTaskStore } from "../../store/store";

function Dashboard() {
  const { getTasks } = useTaskStore((state) => state);

  // use layout effect to get tasks from server as async
  useLayoutEffect(() => {
    (async () => {
      await getTasks();
    })();
  }, []);
  return (
    <Container
      maxWidth="xl"
      sx={{
        mt: 2,
      }}
    >
      <Grid container spacing={2}>
        <Grid item md={4}>
          <AddTask />
        </Grid>
        <Grid item md={8}>
          <ShowTasks />
        </Grid>
      </Grid>
    </Container>
  );
}

export default Dashboard;
