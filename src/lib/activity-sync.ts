import type { ActivitySyncPayload } from "@/types/activity";

const DEFAULT_LOCATION = {
  lat: 37.5665,
  lon: 126.978,
};

const toLocalDate = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

export const createDemoActivitySyncPayload = (
  now = new Date(),
): ActivitySyncPayload => {
  const recordDate = toLocalDate(now);

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
