import { api, publicApi } from "..";

import type { ApiPayload, ApiResponse } from "@/types/api";
import type {
  MyStatsResponse,
  UserCreatePayload,
  UserCreateResponse,
} from "@/types/user";

// 유저 등록
export const createUser = async ({
  payload,
}: ApiPayload<UserCreatePayload>) => {
  const { data } = await publicApi.post<ApiResponse<UserCreateResponse>>(
    "/users",
    payload,
  );

  return data.data;
};

// 마이페이지 통계 조회
export const getMyStats = async () => {
  const { data } = await api.get<ApiResponse<MyStatsResponse>>("/users/mypage");
  return data.data;
};
