import { api } from "..";

// 미션 조회
export const getMissions = async () => {
  const res = await api.get("/missions/today");

  return res;
};

// 미션 생성
export const createMissions = async ({
  lat,
  lon,
}: {
  lat: number;
  lon: number;
}) => {
  const res = await api.post("/missions/generate", { params: { lat, lon } });

  return res;
};
