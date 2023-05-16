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
  CssBaseline,
  Container,
} from "@mui/material";
import { PersonAdd } from "@mui/icons-material";
import { useForm, Resolver } from "react-hook-form";
import LoginFooter from "./login-footer";

type registerForm = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const resolver: Resolver<registerForm> = async (values) => {
  return {
    values:
      values.username.length > 0 &&
      values.email.length > 0 &&
      values.password.length > 0
        ? values
        : {},
    errors: !values.username
      ? {
          username: {
            type: "required",
            message: "Username is required",
          },
        }
      : !values.email
      ? {
          email: {
            type: "required",
            message: "Email is required",
          },
        }
      : !values.password
      ? {
          password: {
            type: "required",
            message: "Password is required",
          },
        }
      : !values.confirmPassword
      ? {
          confirmPassword: {
            type: "required",
            message: "Confirm Password is required",
          },
        }
      : values.password !== values.confirmPassword
      ? {
          confirmPassword: {
            type: "validate",
            message: "Passwords do not match",
          },
        }
      : {},
  };
};

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<String | undefined>();

  const registerUser = useTaskStore((state) => state.register);
  const {
    handleSubmit,
    register,
    formState: { errors },
    resetField,
  } = useForm<registerForm>({
    resolver,
  });

  const location = useLocation();
  const nagivate = useNavigate();
  const from = location.state?.from?.pathname || "/";

  const handleRegister = async (form: registerForm) => {
    setIsLoading(true);
    setError("");
    const err = await registerUser(form.username, form.email, form.password);
    if (!err) {
      nagivate(from, { replace: true });
      return;
    }
    resetField("password");
    resetField("confirmPassword");
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
        <CssBaseline />
        <Avatar
          sx={{
            m: 1,
            bgcolor: "secondary.main",
          }}
        >
          <PersonAdd />
        </Avatar>
        <Typography component="h1" variant="h5">
          Register
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit(handleRegister)}
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
            label="email"
            fullWidth
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            label="password"
            type="password"
            fullWidth
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <TextField
            label="confirm password"
            type="password"
            fullWidth
            {...register("confirmPassword")}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
          />

          {/* button with spinner when loading */}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isLoading}
          >
            Register
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

          <LoginFooter isLogin={false} />
        </Box>
      </Box>
    </Container>
  );
};

export default Register;
