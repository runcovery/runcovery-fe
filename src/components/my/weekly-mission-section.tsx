import type { WeekdayCode } from "@/types/user";
import { Text, View } from "react-native";

const DAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"] as const;
const DAY_CODES: WeekdayCode[] = [
  "SUN",
  "MON",
  "TUE",
  "WED",
  "THU",
  "FRI",
  "SAT",
];

export default function WeeklyMissionSection({
  successCount,
  successDays,
}: {
  successCount: number;
  successDays: WeekdayCode[];
}) {
  const today = new Date();
  const mondayOffset = (today.getDay() + 6) % 7;
  const completedDays = new Set(successDays);
  const weekDays = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - mondayOffset + index);
    const dayIndex = date.getDay();

    return {
      code: DAY_CODES[dayIndex],
      day: DAY_LABELS[dayIndex],
      date: date.getDate(),
      completed: completedDays.has(DAY_CODES[dayIndex]),
    };
  });
  const successMessage =
    successCount > 0
      ? `🥳 ${successCount}번 성공했어요!`
      : "이번 주 미션 성공 기록이 아직 없어요.";

  return (
    <View>
      {/* 섹션 타이틀 */}
      <Text className="text-[16px] font-semibold text-neutral-400">
        이번 주 미션 현황
      </Text>

      {/* 이번 주 날짜별 미션 달성 여부 */}
      <View className="mt-4 rounded-[22px] bg-primary-390 px-5 pb-5 pt-4 shadow-[0_4px_8px_rgba(75,57,180,0.18)]">
        <Text className="text-[14px] font-semibold text-white">
          {successMessage}
        </Text>

        <View className="mt-3 flex-row gap-1.5">
          {weekDays.map(({ code, day, date, completed }) => (
            <View
              key={code}
              className={`h-15 flex-1 items-center justify-center rounded-[14px] ${completed ? "bg-character" : "bg-white"}`}
              accessibilityLabel={`${day}요일 ${date}일${completed ? ", 미션 완료" : ""}`}
            >
              <Text className="text-[11px] font-semibold text-neutral-500">
                {day}
              </Text>
              <Text className="mt-1 text-[13px] font-semibold text-neutral-500">
                {date}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
