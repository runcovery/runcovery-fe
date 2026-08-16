import { View } from "react-native";
import TitleSection from "../onboarding/title-section";
import StatItem from "./stat-item";

export default function ComparisonResultScreen() {
  return (
    <>
      {/* 타이틀 */}
      <View className="items-start w-full mt-3">
        <TitleSection
          title="관리 후 비교한 피부 상태"
          subTitle="전체적으로 좋아졌어요!"
        />
      </View>

      {/* 리스트 */}
      <View className="mt-5 w-full">
        <StatItem />
        <StatItem />
        <StatItem />
        <StatItem />
        <StatItem />
        <StatItem />
        <StatItem />
      </View>
    </>
  );
}
