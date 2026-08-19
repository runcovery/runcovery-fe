import { Pressable, Text } from "react-native";

export default function OptionCard({
  py = "py-4",
  content,
  selected = false,
  onPress,
}: {
  py?: string;
  content: string;
  selected?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable
      accessibilityRole={onPress ? "button" : undefined}
      accessibilityState={onPress ? { selected } : undefined}
      disabled={!onPress}
      onPress={onPress}
      className={`${py} border rounded-2xl px-6 ${selected ? "border-primary-500 bg-primary-50" : "border-primary-440 bg-white"}`}
    >
      <Text
        className={`${selected ? "text-primary-500" : "text-black"} text-[14px] font-semibold`}
      >
        {content}
      </Text>
    </Pressable>
  );
}
