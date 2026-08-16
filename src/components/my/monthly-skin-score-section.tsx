import { Text, View } from "react-native";
import FitnessScoreChart from "./fitness-score-chart";

export default function MonthlySkinScoreSection() {
  return (
    <View>
      <Text className="mb-4 text-[16px] font-semibold text-neutral-400">
        이번 달 내 피부 점수
      </Text>
      <FitnessScoreChart />
    </View>
  );
}
