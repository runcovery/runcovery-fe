import { api } from "..";
import type { ApiResponse } from "@/types/api";
import type { MissionResponse } from "@/types/mission";

// 미션 조회
export const getMissions = async () => {
  const { data } = await api.get<ApiResponse<MissionResponse>>(
    "/missions/today",
  );
  return data.data;
};

// 미션 생성
export const createMissions = async ({
  lat,
  lon,
}: {
  lat: number;
  lon: number;
}) => {
  const { data } = await api.post<ApiResponse<MissionResponse>>(
    "/missions/generate",
    undefined,
    { params: { lat, lon } },
  );
  return data.data;
};
