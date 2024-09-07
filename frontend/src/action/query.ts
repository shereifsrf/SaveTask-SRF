import { useInfiniteQuery } from "@tanstack/react-query";
import { TaskModel, TaskStatus } from "@/model/task";
import { constant } from "@/util/constant";
import { helper } from "@/util/helper";
import { redirect } from "next/navigation";
import { ApiError } from "@/model/error";

const taskApi = process.env.NEXT_PUBLIC_TASK_API_URL;

const useQueryTasks = (limit: number, status: TaskStatus | undefined) => {
  return useInfiniteQuery({
    enabled: status !== undefined,
    queryKey: ["tasks", { limit, status }],
    queryFn: async ({ pageParam = 0 }) => {
      const query = new URLSearchParams({
        page: pageParam.toString(),
        limit: limit.toString(),
        status: status!,
      });

      const response = await fetch(`${taskApi}/task?${query}`, {
        headers: {
          [constant.Authorization]: helper.getLocalStorage(constant.TOKEN, ""),
        },
      });
      if (!response.ok)
        throw new ApiError(
          response.status,
          `Failed to fetch tasks: ${response.statusText}`
        );

      let data = await response.json();
      data = data ? (data as TaskModel[]) : [];
      return data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      if (lastPage.length < limit) return undefined;
      return lastPageParam + 1;
    },
    retry: (failureCount, error) => {
      if (error instanceof ApiError) {
        if (error.status === 401) {
          return false;
        }
      }
      return failureCount < 3;
    },
  });
};

export { useQueryTasks };
