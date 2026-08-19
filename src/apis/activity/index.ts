import { api } from "..";
import type { ApiResponse } from "@/types/api";
import type {
  ActivityRecord,
  ActivitySyncPayload,
  ActivitySyncResponse,
} from "@/types/activity";

export const getTodayActivity = async () => {
  const { data } = await api.get<ApiResponse<ActivityRecord>>(
    "/activities/today",
  );
  return data.data;
};

export const syncActivity = async (payload: ActivitySyncPayload) => {
  const { data } = await api.post<ApiResponse<ActivitySyncResponse>>(
    "/activities/sync",
    payload,
  );
  return data.data;
};
