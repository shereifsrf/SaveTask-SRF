import { Avatar, Box, Button, TextField, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm, Resolver } from "react-hook-form";
import useUserStore from "../../store/user-store";

type guestForm = {
  guestName: string;
};

const resolver: Resolver<guestForm> = async (values) => {
  return {
    values: values.guestName.length > 0 ? values : {},
    errors: !values.guestName
      ? {
          guestName: {
            type: "required",
            message: "Guest name is required",
          },
        }
      : {},
  };
};

const Guest = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<guestForm>({
    resolver,
  });

  const location = useLocation();
  const nagivate = useNavigate();
  const from = location.state?.from?.pathname || "/";
  const login = useUserStore((state) => state.guestLogin);

  const handleLogin = (form: guestForm) => {
    // console.log({ form });
    login(form.guestName);
    nagivate(from, { replace: true });
  };

  return (
    <Box
      component={"form"}
      onSubmit={handleSubmit(handleLogin)}
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
      ></Avatar>
      <Typography component="h1" variant="h5">
        Guest Login
      </Typography>
      <Box
        sx={{
          mt: 1,
          // children with mb:2
          "& > :not(:last-child)": { mb: 2 },
        }}
      >
        <TextField
          label="Name"
          fullWidth
          {...register("guestName")}
          error={!!errors.guestName}
          helperText={errors.guestName?.message}
        />
        {/* button with spinner when loading */}
        <Button type="submit" variant="contained" fullWidth>
          Access as Guest
        </Button>
      </Box>
    </Box>
  );
};

export default Guest;
