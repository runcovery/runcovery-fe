import CareCenterCard from "@/components/home/care-center";
import CareTipCard from "@/components/home/care-tip";
import ConditionOverviewCard from "@/components/home/condition-overview";
import GradientScreenLayout from "@/components/shared/gradient-screen-layout";
import { Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <View className="justify-center flex-1 px-8">
      <GradientScreenLayout offsetY={120}>
        <View className="mt-7">
          {/* 타이틀 */}
          <View>
            <Text className="text-[22px] font-semibold text-black">
              00님의 현재 상태입니다.
            </Text>
            <Text className="text-[10px] font-medium text-neutral-300">
              오늘도 나를 위한 작은 습관을 이어나가요.
            </Text>
          </View>

          {/* 카드 컨텐츠 */}
          <View className="mt-5 gap-5">
            <ConditionOverviewCard />
            <CareTipCard />
          </View>

          {/* 매장 */}
          <View className="mt-5">
            <Text className="text-[16px] font-semibold text-black">
              오프라인에서도 관리 할 수 있어요!
            </Text>
            <View className="flex flex-row gap-4 mt-5">
              <CareCenterCard />
              <CareCenterCard />
              <CareCenterCard />
            </View>
          </View>
        </View>
      </GradientScreenLayout>
    </View>
  );
}
