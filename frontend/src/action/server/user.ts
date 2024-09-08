"use server";

import { ApiError } from "@/model/error";
import { RegisterModel, UserModel } from "@/model/user";
import { ApiResponse } from "@/model/response";

const url = process.env.NEXT_PUBLIC_USER_BACKEND_URL;

export const userLogin = async (username: string, password: string) => {
  const response = await fetch(`${url}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });

  const result: ApiResponse<UserModel> = new ApiResponse<UserModel>(null, null);

  if (!response.ok) {
    result.error = new ApiError(response.status, "Failed to login");
  } else {
    const data = await response.json();
    result.data = new UserModel(data.token);
  }

  return result.toMap();
};

export const userRegister = async (
  username: string,
  password: string,
  email: string,
) => {
  const response = await fetch(`${url}/user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
      email,
    }),
  });
  const result: ApiResponse<RegisterModel> = new ApiResponse<RegisterModel>(
    null,
    null,
  );
  const data = await response.json();
  console.log(data, response);
  if (!response.ok) {
    result.error = new ApiError(response.status, data.error);
  }

  result.data = new RegisterModel(true);
  return result.toMap();
};

// const useLogin = () => {
//   return useMutation({
//     mutationKey: ["login"],
//     mutationFn: async ({
//       username,
//       password,
//     }: {
//       username: string;
//       password: string;
//     }) => {
//       const response = await fetch(`${url}/login`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ username, password }),
//       });
//       if (!response.ok) {
//         throw new ApiError(response.status, "Failed to login");
//       }
//       const data = await response.json();
//       helper.setLocalStorage(constant.TOKEN, data.token);

//       return;
//     },
//   });
// };
