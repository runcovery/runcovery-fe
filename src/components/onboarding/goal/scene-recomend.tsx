import Button from "@/components/ui/Button";
import OptionCard from "@/components/ui/option-card";
import { useState } from "react";
import { Text, View } from "react-native";
import TitleSection from "../title-section";
import FormInputField from "./form-input-field";
import PreviewCard from "./preview-card";

export default function SceneRecomendScreen({
  selectedId,
  onNext,
}: {
  selectedId: number;
  onNext: () => void;
}) {
  const [customScene, setCustomScene] = useState("");

  return (
    <View className="flex-1 justify-between">
      <View>
        <View className="mt-3">
          <TitleSection
            title="00님에게 맞는 장면을 찾았어요."
            subTitle="기존에 입력한 정보를 참고해 장면을 찾았어요."
          />
        </View>
        <View className="mt-5">
          <PreviewCard />
        </View>
        <View className="mt-5">
          <Text className="text-[16px] font-semibold text-black">
            다른 장면도 있어요
          </Text>
          <View className="gap-3 mt-3">
            <OptionCard />
            <OptionCard />
          </View>
        </View>
        {selectedId === 2 && (
          <View className="mt-5 gap-3">
            <Text className="text-[16px] font-semibold text-black">
              직접 입력할게요
            </Text>
            <FormInputField
              placeholder="00님에게 맞는 장면을 입력해주세요."
              value={customScene}
              onChangeText={setCustomScene}
            />
          </View>
        )}
      </View>
      <View className="gap-4">
        <Button onPress={onNext}>다음</Button>
        {selectedId === 1 && (
          <Button isWhite={true}>다른 장면 추천 받기</Button>
        )}
      </View>
    </View>
  );
}
