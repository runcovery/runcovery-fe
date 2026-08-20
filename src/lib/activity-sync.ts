import type { ActivitySyncPayload } from "@/types/activity";
import { DEFAULT_LOCATION } from "@/constants/location";

const toLocalDate = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

export const createDemoActivitySyncPayload = (
  now = new Date(),
): ActivitySyncPayload => {
  // 백엔드의 '오늘 활동' 조회와 날짜가 어긋나지 않도록 기기 로컬 날짜를 사용한다.
  const recordDate = toLocalDate(now);

  // 실제 헬스 플랫폼 연동 전까지 화면 전체 흐름을 검증하기 위한 고정 시연 기록이다.
  return {
    recordDate,
    runningDuration: 1200,
    distanceM: 5200,
    avgPace: 360,
    avgHeartRate: 145,
    maxHeartRate: 172,
    calories: 420,
    cadence: 168,
    startTime: `${recordDate}T07:00:00`,
    endTime: `${recordDate}T07:40:00`,
    ...DEFAULT_LOCATION,
  };
};
