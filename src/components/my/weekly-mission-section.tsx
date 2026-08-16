import { Text, View } from "react-native";

const WEEK_DAYS = [
  { day: "월", date: 28, completed: false },
  { day: "화", date: 29, completed: false },
  { day: "수", date: 30, completed: false },
  { day: "목", date: 31, completed: true },
  { day: "금", date: 1, completed: false },
  { day: "토", date: 2, completed: false },
  { day: "일", date: 3, completed: true },
] as const;

export default function WeeklyMissionSection() {
  const completedCount = WEEK_DAYS.filter(({ completed }) => completed).length;

  return (
    <View>
      <Text className="text-[16px] font-semibold text-neutral-400">
        이번 주 미션 현황
      </Text>

      <View className="mt-4 rounded-[22px] bg-primary-390 px-5 pb-5 pt-4 shadow-[0_4px_8px_rgba(75,57,180,0.18)]">
        <Text className="text-[14px] font-semibold text-white">
          🥳 {completedCount}번 성공했어요!
        </Text>

        <View className="mt-3 flex-row gap-1.5">
          {WEEK_DAYS.map(({ day, date, completed }) => (
            <View
              key={`${day}-${date}`}
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
