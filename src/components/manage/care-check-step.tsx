import { CheckType } from "@/types/careStep";
import { ScrollView, Text, View } from "react-native";
import Button from "../ui/Button";
import OptionCard from "../ui/option-card";

const CHECK_DATA = {
  running: {
    title: "오늘의 러닝은 어떠셨나요?",
    list: [
      { id: 1, content: "너무 좋았어요!" },
      { id: 2, content: "보통이에요." },
      { id: 3, content: "너무 힘들었어요." },
    ],
  },
  energy: {
    title: "현재 남아 있는 체력은 어느 정도예요?",
    list: [
      { id: 1, content: "완전 방전이에요." },
      { id: 2, content: "적당히 지쳤어요." },
      { id: 3, content: "에너지가 넘쳐요!" },
    ],
  },
  sweat: {
    title: "오늘 땀을 얼마나 흘리셨나요?",
    list: [
      { id: 1, content: "쾌적해요! (거의 안 흘림)" },
      { id: 2, content: "적당히 났어요." },
      { id: 3, content: "흠뻑 젖었어요. (옷이 다 젖을 정도)" },
    ],
  },
};

export default function CareCheckStepScreen({
  step,
  onNext,
}: {
  step: CheckType;
  onNext: () => void;
}) {
  return (
    <ScrollView
      className="w-full mt-3 flex-1"
      contentContainerStyle={{ flexGrow: 1, justifyContent: "space-between" }}
      showsVerticalScrollIndicator={false}
    >
      <View>
        {/* 타이틀 */}
        <Text className="text-[20px] font-semibold text-neutral-950">
          {CHECK_DATA[step].title}
        </Text>

        {/* 리스트 */}
        <View className="gap-9 mt-6">
          {CHECK_DATA[step].list.map((item) => (
            <OptionCard py="py-6" key={item.id} content={item.content} />
          ))}
        </View>
      </View>

      <Button onPress={onNext}>다음</Button>
    </ScrollView>
  );
}
