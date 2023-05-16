import { useState } from "react";
import { useTaskStore } from "../../store/store";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
  Container,
} from "@mui/material";
import { LockOutlined } from "@mui/icons-material";
import { useForm, Resolver } from "react-hook-form";
import LoginFooter from "./login-footer";

type loginForm = {
  username: string;
  password: string;
};

const resolver: Resolver<loginForm> = async (values) => {
  return {
    values:
      values.username.length > 0 && values.password.length > 0 ? values : {},
    errors: !values.username
      ? {
          username: {
            type: "required",
            message: "Username is required",
          },
        }
      : !values.password
      ? {
          password: {
            type: "required",
            message: "Password is required",
          },
        }
      : {},
  };
};

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<String | undefined>();

  const login = useTaskStore((state) => state.login);
  const {
    handleSubmit,
    register,
    formState: { errors },
    resetField,
  } = useForm<loginForm>({
    resolver,
  });

  const location = useLocation();
  const nagivate = useNavigate();
  const from = location.state?.from?.pathname || "/";

  const handleLogin = async (loginForm: loginForm) => {
    setIsLoading(true);
    setError("");
    console.log("before login");
    const err = await login(loginForm.username, loginForm.password);
    console.log("after login");
    if (!err) {
      nagivate(from, { replace: true });
      return;
    }
    resetField("password");
    setIsLoading(false);
    setError(err);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          mt: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar
          sx={{
            m: 1,
            bgcolor: "secondary.main",
          }}
        >
          <LockOutlined />
        </Avatar>
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit(handleLogin)}
          sx={{
            mt: 1,
            // children with mb:2
            "& > :not(:last-child)": { mb: 2 },
          }}
        >
          <TextField
            label="Username"
            fullWidth
            {...register("username")}
            error={!!errors.username}
            helperText={errors.username?.message}
          />
          <TextField
            label="password"
            type="password"
            fullWidth
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          {/* button with spinner when loading */}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isLoading}
          >
            Login
            {/* circular progress bar without changing button size */}
            {isLoading && (
              <CircularProgress
                sx={{
                  position: "absolute",
                }}
                size={24}
              />
            )}
          </Button>
          {/* error typography to show error is its not empty */}

          <Typography color="error" variant="body2">
            {error}
          </Typography>

          <LoginFooter isLogin={true} />
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
