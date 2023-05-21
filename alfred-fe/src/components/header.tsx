import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { capitalize } from "../util/helper";
import useUserStore from "../store/user-store";

const Header = () => {
  const isLoggedIn = useUserStore((state) => state.user.isLogged);
  const logout = useUserStore((state) => state.logout);
  const user = useUserStore((state) => state.user);
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
              {isLoggedIn ? "Logout" : "Acount"}
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;
