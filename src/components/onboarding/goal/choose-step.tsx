import Button from "@/components/ui/Button";
import { CardData } from "@/types/onboarding/cardData";
import { useProfileStore } from "@/stores/useProfileStore";
import { Text, View } from "react-native";
import SelectCard from "../select-card";

const getDetailData = (nickname: string): CardData[] => [
  {
    id: 1,
    title: "AI가 추천해줘요.",
    content: `내 상황에 맞는 목표를 \n${nickname}님에 맞게 찾아드려요.`,
  },
  {
    id: 2,
    title: "직접 입력할게요.",
    content: "달성하고 싶은 목표가 이미 있어요!",
  },
];

interface ChooseStepScreenProps {
  selectedId: number;
  onSelect: (id: number) => void;
  onNext: () => void;
}

export default function ChooseStepScreen({
  selectedId,
  onSelect,
  onNext,
}: ChooseStepScreenProps) {
  const nickname = useProfileStore((state) => state.profile.nickname);
  const detailData = getDetailData(nickname);

  return (
    <View className="flex-1 justify-between">
      <View>
        {/* 타이틀 */}
        <View className="items-start w-full mt-3 gap-1">
          <Text className="text-[22px] font-semibold text-black whitespace-pre-wrap">
            {nickname}님의 미래 목표를 어떻게 정할까요?
          </Text>
          <Text className="text-neutral-300 will-change-variable text-[14px] font-medium whitespace-pre-wrap">
            나에게 맞는 미래 목표를 설정해보고, 시작해보세요!
          </Text>
        </View>

        {/* 리스트 */}
        <View className="gap-4 w-full mt-5">
          {detailData.map((item) => (
            <SelectCard
              key={item.id}
              item={item}
              onPress={() => onSelect(selectedId === item.id ? 0 : item.id)}
              selected={selectedId === item.id}
            />
          ))}
        </View>
      </View>

      {/* 버튼 */}
      <View>
        <Button onPress={onNext}>다음</Button>
      </View>
    </View>
  );
}
