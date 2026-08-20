export const queryKeys = {
  home: {
    all: ["home"] as const,
    detail: (lat: number, lon: number) => ["home", lat, lon] as const,
  },
  activity: {
    all: ["activity"] as const,
    today: ["activity", "today"] as const,
  },
  condition: {
    all: ["condition"] as const,
    latest: ["condition", "latest"] as const,
  },
  mission: {
    all: ["mission"] as const,
    today: ["mission", "today"] as const,
  },
  goal: {
    all: ["goal"] as const,
    weekly: ["goal", "weekly"] as const,
    weeklyCurrent: ["goal", "weekly", "current"] as const,
  },
  user: {
    all: ["user"] as const,
    myPage: ["user", "mypage", "stats-v2"] as const,
  },
  wellness: {
    all: ["wellness"] as const,
    preview: (activityRecordId?: number) =>
      ["wellness", "preview", activityRecordId] as const,
    prescriptions: ["wellness", "prescriptions"] as const,
    prescriptionList: (reportId?: number) =>
      ["wellness", "prescriptions", reportId ?? "latest"] as const,
    prescription: (prescriptionId: number) =>
      ["wellness", "prescription", prescriptionId] as const,
    skinComparison: (date?: string) =>
      ["wellness", "skin", "comparison", date] as const,
  },
} as const;
