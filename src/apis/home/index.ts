import { api } from "..";

import type { ApiResponse } from "@/types/api";
import type { HomeQuery, HomeResponse } from "@/types/home";

// 홈 화면 정보 요청
export const getHome = async ({ lat, lon }: HomeQuery) => {
  const res = await api.get<ApiResponse<HomeResponse>>("/home", {
    params: { lat, lon },
  });

  return res;
};
