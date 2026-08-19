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
  const res = await publicApi.post<ApiResponse<UserCreateResponse>>(
    "/users",
    payload,
  );

  return res;
};

export const getMyStats = async () => {
  const { data } = await api.get<ApiResponse<MyStatsResponse>>("/users/mypage");
  return data.data;
};
