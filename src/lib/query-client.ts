import { QueryClient } from "@tanstack/react-query";
import { ApiError } from "@/apis";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      // 잘못된 요청인 4xx는 반복하지 않고, 일시적인 서버 오류만 두 번까지 재시도한다.
      retry: (failureCount, error) =>
        !(error instanceof ApiError && error.status && error.status < 500) &&
        failureCount < 2,
    },
    mutations: { retry: false },
  },
});
