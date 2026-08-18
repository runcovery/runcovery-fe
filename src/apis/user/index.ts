import { publicApi } from "..";

import type { ApiPayload, ApiResponse } from "@/types/api";
import type { UserCreatePayload, UserCreateResponse } from "@/types/user";

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
