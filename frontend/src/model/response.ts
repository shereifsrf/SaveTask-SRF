import { ApiError } from "./error";

export interface IModel {
  toMap(): { [key: string]: any };
}

export class ApiResponse<T extends IModel> implements IModel {
  data: T | null;
  error: ApiError | null;

  constructor(data: T | null, error: ApiError | null) {
    this.data = data ?? null;
    this.error = error ?? null;
  }

  toMap(): { [key: string]: any } {
    return {
      data: this.data?.toMap() ?? null,
      error: this.error?.toMap() ?? null,
    };
  }

  static instanceOf<T extends IModel>(obj: any): obj is ApiResponse<T> {
    if (!obj) {
      return false;
    }
    return "data" in obj && "error" in obj;
  }

  static convert(obj: any): ApiResponse<IModel> {
    if (!ApiResponse.instanceOf(obj)) {
      throw new Error("Invalid object");
    }

    return new ApiResponse(obj.data, obj.error);
  }
}
