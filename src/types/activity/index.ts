export interface ActivityRecord {
  userId: number;
  recordId: number;
  runningDuration: number;
  recordDate: string;
  distanceM: number;
  avgPace: number;
  avgHeartRate: number;
  maxHeartRate: number;
  calories: number;
  cadence: number;
  startTime: string;
  endTime: string;
}

export interface ActivitySyncPayload {
  runningDuration: number;
  recordDate: string;
  distanceM: number;
  avgPace: number;
  avgHeartRate: number;
  maxHeartRate: number;
  calories: number;
  cadence: number;
  startTime: string;
  endTime: string;
  lat: number;
  lon: number;
}

export interface ActivitySyncResponse {
  recordId: number;
  mission: {
    missionId: number;
    isCompleted: boolean;
  } | null;
}
