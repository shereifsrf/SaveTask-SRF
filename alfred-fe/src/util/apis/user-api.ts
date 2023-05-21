import { UserModel } from "../../models/user";
import axios from "axios";

const server = import.meta.env.VITE_SERVER_URL;

type userResponse = {
  user?: UserModel;
  err?: String;
};

type loginResponse = {
  userName: string;
  email: string;
  token: {
    token: string;
  };
};

// interface with login
interface userAPI {
  login: (username: string, password: string) => Promise<userResponse>;
  logout: () => Promise<void>;
  register: (
    username: string,
    password: string,
    email: string
  ) => Promise<userResponse>;
  guestLogin: (guestName: string) => void;
}

// login user
const userAPI: userAPI = {
  login: async (username, password) => {
    // try catch api call
    try {
      var response = await axios.post(`${server}/user/login`, {
        username: username,
        password: password,
      });
      if (response.status === 200) {
        // convert data to loginResponse model
        // if not, throw error
        // convert
        const rsp: loginResponse = response.data;
        return {
          user: {
            name: rsp.userName,
            isLogged: true,
            isGuest: false,
            token: {
              token: rsp.token.token,
            },
          },
        };
      }
    } catch (error) {
      console.log(error);
    }

    return {
      user: {
        name: "",
        isLogged: false,
        isGuest: false,
      },
      err: "Invalid username or password",
    };
  },
  logout: async () => {},
  guestLogin: (guestName) => {
    axios.post(`${server}/session`, {
      username: guestName,
    });
  },
  register: async (username, password, email) => {
    try {
      var response = await axios.post(`${server}/user/register`, {
        username: username,
        password: password,
        email: email,
      });
      if (response.status === 200) {
        const rsp: loginResponse = response.data;
        return {
          user: {
            name: rsp.userName,
            isLogged: true,
            isGuest: false,
            token: {
              token: rsp.token.token,
            },
          },
        };
      }
    } catch (error) {
      console.log(error);
    }
    return {
      user: {
        name: "",
        isLogged: false,
        isGuest: true,
      },
      err: "Server error or username already exists",
    };
  },
};

export default userAPI;
