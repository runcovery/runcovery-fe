import type { HomeQuery } from "@/types/home";

// 위치 권한 기능이 복구되기 전까지 위치 기반 API가 공통으로 사용하는 서울 좌표다.
export const DEFAULT_LOCATION: HomeQuery = {
  lat: 37.5665,
  lon: 126.978,
};
