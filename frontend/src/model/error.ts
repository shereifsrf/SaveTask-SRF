import { IModel } from "./response";

export class ApiError extends Error implements IModel {
  constructor(
    public status: number,
    public message: string,
  ) {
    super(message);
  }

  toMap() {
    return {
      status: this.status,
      message: this.message,
    };
  }

  static instanceOf(obj: any): obj is ApiError {
    if (!obj) {
      return false;
    }

    return "status" in obj && "message" in obj;
  }

  static convert(obj: any): ApiError {
    if (!ApiError.instanceOf(obj)) {
      throw new Error("Invalid object");
    }

    return new ApiError(obj.status, obj.message);
  }
}
