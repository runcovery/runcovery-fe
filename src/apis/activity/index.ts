import { api } from "..";
import type { ApiResponse } from "@/types/api";
import type {
  ActivityRecord,
  ActivitySyncPayload,
  ActivitySyncResponse,
} from "@/types/activity";

// 오늘 활동 기록 조회
export const getTodayActivity = async () => {
  const { data } = await api.get<ApiResponse<ActivityRecord>>(
    "/activities/today",
  );
  return data.data;
};

// 기기 활동 기록 동기화
export const syncActivity = async (payload: ActivitySyncPayload) => {
  const { data } = await api.post<ApiResponse<ActivitySyncResponse>>(
    "/activities/sync",
    payload,
  );
  return data.data;
};
