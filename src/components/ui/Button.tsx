import { Pressable, PressableProps, Text } from "react-native";

interface ButtonProps {
  children: React.ReactNode;
  isMid?: boolean;
  isWhite?: boolean;
  onPress?: PressableProps["onPress"];
}

export default function Button({
  children,
  isMid = false,
  isWhite = false,
  onPress,
}: ButtonProps) {
  const midClass = isMid ? "h-12" : "h-13";
  const whitePress = isWhite
    ? "border-neutral-200 bg-white border"
    : "bg-primary-500";

  return (
    <Pressable
      onPress={onPress}
      className={`${midClass} ${whitePress}  rounded-xl w-full items-center justify-center`}
    >
      <Text
        className={`${isWhite ? "text-neutral-300" : "text-white"} text-[16px] font-medium  leading-8.75 text-center`}
      >
        {children}
      </Text>
    </Pressable>
  );
}
