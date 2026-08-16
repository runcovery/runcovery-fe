import { CardData } from "@/types/onboarding/cardData";
import { Pressable, Text, View } from "react-native";

interface SelectCardProps {
  item: CardData;
  selected?: boolean;
  onPress?: () => void;
}

export default function SelectCard({
  item,
  selected = false,
  onPress,
}: SelectCardProps) {
  return (
    <Pressable
      className={`will-change-variable flex flex-row justify-between px-5 items-center rounded-[18px] ${selected ? "bg-primary-50 shadow-[0_4px_4px_rgba(0,0,0,0.1)]" : "bg-white"} ${selected ? "border-primary-500" : "border-neutral-100"} border py-5 min-h-35`}
      onPress={onPress}
    >
      <View className="flex flex-row gap-3">
        <View className="rounded-[50%] w-6.75 h-6.75 justify-center items-center bg-primary-500 mt-0.5">
          <Text className="text-white text-[14px] font-medium">{item.id}</Text>
        </View>
        <View className="gap-2">
          <Text className="text-[18px] font-semibold text-black">
            {item.title}
          </Text>
          <Text className="will-change-variable text-[14px] font-medium text-neutral-300">
            {item.content}
          </Text>
        </View>
      </View>
      <View
        className={`bg-white ${selected ? "border-primary-500" : "border-neutral-100"} border  w-6 h-6 rounded-[50%] items-center justify-center`}
      >
        {selected && <View className="w-4 h-4 bg-primary-500 rounded-[50%]" />}
      </View>
    </Pressable>
  );
}
