import type { MissionResponse } from "@/types/mission";
import { Image, Text, View } from "react-native";
import OutlineCard from "../shared/outline-card";
import Label from "../ui/label";

const GoalItem = ({ children }: { children: string }) => {
  return (
    <View className="flex flex-row items-center gap-2">
      <Image
        source={require("../../../assets/images/mission/d-calendar.png")}
        className="w-6 h-6"
      />
      <Text className="text-[12px] font-medium text-neutral-600">
        {children}
      </Text>
    </View>
  );
};

export default function DailyGoalCard({
  mission,
}: {
  mission?: MissionResponse;
}) {
  return (
    <View>
      {/* 카드 타이틀 */}
      <Text className="text-[14px] font-semibold text-black ml-4">
        일일 목표
      </Text>
      <View className="mt-3">
        <OutlineCard py="py-5">
          {/* 오늘의 추천 강도 */}
          <Label text="일일 미션" bg="bg-secondary-400" />
          <Text className="text-[14px] font-semibold text-black mt-2 ml-4 text-center">
            {mission?.isRest
              ? "오늘은 회복에 집중해요"
              : (mission?.recommendedIntensity ??
                "오늘의 미션을 받으려면 컨디션 체크를 \n받아야해요")}
          </Text>
          {/* 시간·심박 구간·상세 안내 */}
          <View className="mt-3 gap-3">
            {mission ? (
              <>
                <GoalItem>{mission.recommendedTime}</GoalItem>
                <GoalItem>
                  {mission.recommendedZone === "오늘은 휴식을 취하세요."
                    ? mission.recommendedZoneDesc
                    : `${mission.recommendedZone} · ${mission.recommendedZoneDesc}`}
                </GoalItem>
                <GoalItem>{mission.detailComment}</GoalItem>
              </>
            ) : null}
          </View>
        </OutlineCard>
      </View>
    </View>
  );
}
