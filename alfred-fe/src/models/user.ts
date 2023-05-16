type UserModel = {
  name: string;
  isLogged: boolean;
  isGuest: boolean;
  token?: TokenModel;
};

type TokenModel = {
  token: string;
};

const defaultUser: UserModel = {
  name: "",
  isLogged: false,
  isGuest: true,
};

export type { UserModel };
export { defaultUser };
