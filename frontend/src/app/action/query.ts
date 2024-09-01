import { useInfiniteQuery } from "@tanstack/react-query";
import { TaskModel, TaskStatus } from "../model/task";
import { constant } from "@/util/constant";

const taskApi = process.env.NEXT_PUBLIC_TASK_API_URL;

const useQueryTasks = (
  limit: number,
  status: TaskStatus | undefined,
  pass: string
) => {
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
          [constant.ADMIN_PASS_MUST_REMOVE]: pass,
        },
      });
      let data = await response.json();
      data = data ? (data as TaskModel[]) : [];
      return data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      if (lastPage.length < limit) return undefined;
      return lastPageParam + 1;
    },
  });
};

export { useQueryTasks };
