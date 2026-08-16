import { router } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";

interface ScreenHeaderProps {
  title?: string;
  onBack?: () => void;
}

export default function ScreenHeader({ title, onBack }: ScreenHeaderProps) {
  return (
    <View className="relative h-10 w-full flex-row items-center">
      <Pressable
        onPress={onBack ?? router.back}
        className="z-10 h-10 w-10 -ml-3"
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel="뒤로 가기"
      >
        <Image
          source={require("../../../assets/images/shared/prev.png")}
          className="h-full w-full"
        />
      </Pressable>

      {title ? (
        <View pointerEvents="none" className="absolute inset-x-0 items-center">
          <Text className="text-[16px] font-semibold text-black">{title}</Text>
        </View>
      ) : null}
    </View>
  );
}
