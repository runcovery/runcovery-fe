import { QueryClient } from "@tanstack/react-query";
import { ApiError } from "@/apis";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: (failureCount, error) =>
        !(error instanceof ApiError && error.status && error.status < 500) &&
        failureCount < 2,
    },
    mutations: { retry: false },
  },
});
