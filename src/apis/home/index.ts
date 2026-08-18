import { api } from "..";

// 홈 화면 정보 요청
export const getInfos = async ({ lat, lon }: { lat: number; lon: number }) => {
  const res = await api.get("/home", {
    params: { lat, lon },
  });

  return res;
};
