import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useTaskStore } from "../store/store";
import { useNavigate } from "react-router-dom";
import { capitalize } from "../util/helper";

const Header = () => {
  const isLoggedIn = useTaskStore((state) => state.user.isLogged);
  const logout = useTaskStore((state) => state.logout);
  const user = useTaskStore((state) => state.user);
  const navigate = useNavigate();

  const handleLogin = () => {
    if (isLoggedIn) {
      logout();
    } else {
      navigate("/login");
    }
  };
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            SaveTask
          </Typography>
          <Box
            sx={{
              display: "flex",
            }}
          >
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {capitalize(user.name)}
            </Typography>
            <Button color="inherit" onClick={handleLogin}>
              {isLoggedIn ? "Logout" : "Login"}
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;
