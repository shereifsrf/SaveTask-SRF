import { Stack, Tooltip, Typography } from "@mui/material";
import HelpIcon from "@mui/icons-material/Help";
import { NavLink } from "react-router-dom";

type loginFooterProps = {
  isLogin: boolean;
};

const LoginFooter = ({ isLogin }: loginFooterProps) => {
  const routeTo = isLogin ? "/register" : "/login";
  const text = isLogin
    ? "No account? Register here"
    : "Have account? Login here";

  return (
    <Stack direction="row" justifyContent="space-between">
      <Stack direction="row" gap={1} alignItems="center">
        <NavLink to="/guest">
          <Typography variant="body2">Login as guest</Typography>
        </NavLink>
        <Tooltip
          title="
            As guest, the data is stored in the browser.
            So you wont see your data anywhere else 
            other than this device browser"
        >
          <HelpIcon />
        </Tooltip>
      </Stack>
      <NavLink to={routeTo}>
        <Typography variant="body2">{text}</Typography>
      </NavLink>
    </Stack>
  );
};

export default LoginFooter;
