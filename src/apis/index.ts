import axios, { AxiosError } from "axios";

import { useProfileStore } from "@/stores/useProfileStore";

const commonConfig = {
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
  headers: {
    Accept: "application/json",
  },
};

export const publicApi = axios.create(commonConfig);
export const api = axios.create(commonConfig);

export class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

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

api.interceptors.request.use((config) => {
  const userId = useProfileStore.getState().userId;

  if (!userId) {
    return Promise.reject(new Error("Public ID has not been initialized."));
  }

  config.headers.set("X-Public-Id", userId);

  return config;
});
