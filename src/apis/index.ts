import axios, { AxiosError, type AxiosInstance } from "axios";

import { useProfileStore } from "@/stores/useProfileStore";

const commonConfig = {
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
  headers: {
    Accept: "application/json",
  },
};

export const publicApi = axios.create(commonConfig);
export const api = axios.create(commonConfig);

// 화면에서는 Axios의 응답 구조를 몰라도 되도록 HTTP 상태와 메시지만 노출한다.
export class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

const normalizeApiError = (error: unknown) => {
  if (error instanceof ApiError) return error;
  if (!(error instanceof AxiosError)) return error;

  const responseData = error.response?.data;
  const responseMessage =
    responseData && typeof responseData === "object" && "message" in responseData
      ? responseData.message
      : undefined;
  const message =
    typeof responseMessage === "string" && responseMessage.trim()
      ? responseMessage
      : error.response
        ? "요청을 처리하지 못했습니다."
        : "네트워크 연결을 확인해 주세요.";

  return new ApiError(message, error.response?.status);
};

const attachErrorInterceptor = (client: AxiosInstance) => {
  client.interceptors.response.use(
    (response) => response,
    (error: unknown) => Promise.reject(normalizeApiError(error)),
  );
};

export const getApiErrorMessage = (
  error: unknown,
  fallback = "요청을 처리하지 못했습니다.",
) => {
  if (error instanceof ApiError) return error.message;
  if (error instanceof AxiosError) {
    const message = error.response?.data?.message;
    if (typeof message === "string" && message.trim()) return message;
    if (!error.response) return "네트워크 연결을 확인해 주세요.";
  }
  if (error instanceof Error && error.message) return error.message;
  return fallback;
};

attachErrorInterceptor(publicApi);
attachErrorInterceptor(api);

api.interceptors.request.use((config) => {
  // Zustand 훅을 React 바깥에서 직접 읽어 모든 보호 API에 런타임 식별자를 붙인다.
  const userId = useProfileStore.getState().userId;

  if (!userId) {
    return Promise.reject(new Error("Public ID has not been initialized."));
  }

  config.headers.set("X-Public-Id", userId);

  return config;
});
