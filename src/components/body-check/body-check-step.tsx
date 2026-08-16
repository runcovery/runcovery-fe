import Button from "@/components/ui/Button";
import { ScrollView, Text, useWindowDimensions, View } from "react-native";
import { BodyPartId } from "./body-part-data";
import BodyFigure from "./body-figure";
import { useBodySelection } from "./use-body-selection";

interface BodyCheckStepProps {
  selectedParts: BodyPartId[];
  onChange: (parts: BodyPartId[]) => void;
  onNext: (parts: BodyPartId[]) => void;
}

export default function BodyCheckStep({
  selectedParts,
  onChange,
  onNext,
}: BodyCheckStepProps) {
  const { width: screenWidth } = useWindowDimensions();
  const figureWidth = Math.min(145, Math.max(80, (screenWidth - 80) / 2));
  const { selectedPartSet, togglePart, clearSelection } = useBodySelection(
    selectedParts,
    onChange,
  );

  const handleNoPain = () => {
    clearSelection();
    onNext([]);
  };

  return (
    <ScrollView
      className="flex-1 w-full"
      contentContainerStyle={{ flexGrow: 1, justifyContent: "space-between" }}
      showsVerticalScrollIndicator={false}
    >
      <View>
        <Text className="text-[20px] font-semibold text-neutral-950 mt-3">
          러닝 중 불편하거나 아픈 부위가 있었나요?
        </Text>

        <View className="w-full flex-row items-start justify-between mt-8">
          <BodyFigure
            side="front"
            width={figureWidth}
            selectedParts={selectedPartSet}
            onToggle={togglePart}
          />
          <BodyFigure
            side="back"
            width={figureWidth}
            selectedParts={selectedPartSet}
            onToggle={togglePart}
          />
        </View>
      </View>

      <View className="gap-4 w-full">
        <Button onPress={() => onNext(selectedParts)}>다음</Button>
        <Button isWhite onPress={handleNoPain}>
          없었어요
        </Button>
      </View>
    </ScrollView>
  );
}
