import axios from "axios";

import { useProfileStore } from "@/stores/useProfileStore";

const commonConfig = {
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
  headers: {
    Accept: "application/json",
  },
};

export const publicApi = axios.create(commonConfig);
export const api = axios.create(commonConfig);

api.interceptors.request.use((config) => {
  const userId = useProfileStore.getState().userId;

  if (!userId) {
    return Promise.reject(new Error("Public ID has not been initialized."));
  }

  config.headers.set("X-Public-Id", userId);

  return config;
});
