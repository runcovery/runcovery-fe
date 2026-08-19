import { Text, View } from "react-native";
import Button from "../ui/Button";
import AnimatedPinkCat from "./animated-pink-cat";

interface LoadingScreenProps {
  title: string;
  subTitle: string;
  text: string;
  error?: string | null;
  onRetry?: () => void;
}

export default function LoadingScreen({
  title,
  subTitle,
  text,
  error,
  onRetry,
}: LoadingScreenProps) {
  if (error) {
    return (
      <View className="w-full flex-1 justify-center gap-6">
        <View className="items-center gap-2">
          <Text className="text-[20px] font-semibold text-neutral-950">
            요청을 완료하지 못했어요.
          </Text>
          <Text className="text-center text-[14px] font-medium text-neutral-300">
            {error}
          </Text>
        </View>
        {onRetry ? <Button onPress={onRetry}>다시 시도하기</Button> : null}
      </View>
    );
  }

  return (
    <View className="w-full flex-1">
      <View className="mt-3">
        <View className="w-full gap-1">
          <Text className="whitespace-pre-wrap text-[20px] font-semibold text-black">
            {title}
          </Text>
          <Text className="whitespace-pre-wrap text-[14px] font-medium text-neutral-300 will-change-variable">
            {subTitle}
          </Text>
        </View>
      </View>
      <View className="w-full flex-1 items-center justify-center gap-12 py-8">
        <AnimatedPinkCat width={172} />
        <Text className="text-[14px] font-medium text-neutral-700">{text}</Text>
      </View>
    </View>
  );
}
