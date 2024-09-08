import { IModel } from "./response";

export class RegisterModel implements IModel {
  ok: boolean;

  constructor(ok: boolean) {
    this.ok = ok;
  }

  toMap() {
    return {
      ok: this.ok,
    };
  }

  static instanceOf(obj: any): obj is RegisterModel {
    if (!obj) {
      return false;
    }

    return "ok" in obj;
  }

  static convert(obj: any): RegisterModel {
    if (!RegisterModel.instanceOf(obj)) {
      throw new Error("Invalid object");
    }

    return new RegisterModel(obj.ok);
  }
}

export class UserModel implements IModel {
  token: string;

  constructor(token: string) {
    this.token = token;
  }

  toMap() {
    return {
      token: this.token,
    };
  }

  static instanceOf(obj: any): obj is UserModel {
    if (!obj) {
      return false;
    }

    return "token" in obj;
  }

  static convert(obj: any): UserModel {
    if (!UserModel.instanceOf(obj)) {
      throw new Error("Invalid object");
    }

    return new UserModel(obj.token);
  }
}
