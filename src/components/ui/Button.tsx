import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  Text,
} from "react-native";

interface ButtonProps {
  children: React.ReactNode;
  isMid?: boolean;
  isWhite?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
  onPress?: PressableProps["onPress"];
}

export default function Button({
  children,
  isMid = false,
  isWhite = false,
  disabled = false,
  isLoading = false,
  onPress,
}: ButtonProps) {
  const midClass = isMid ? "h-12" : "h-13";
  const isDisabled = disabled || isLoading;
  const whitePress = isWhite
    ? "border-primary-500 bg-white border"
    : "bg-primary-500";

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={typeof children === "string" ? children : undefined}
      accessibilityState={{ disabled: isDisabled, busy: isLoading }}
      className={`${midClass} ${whitePress} ${disabled ? "opacity-40" : ""} rounded-xl w-full items-center justify-center`}
    >
      {isLoading ? (
        <ActivityIndicator
          color={isWhite ? "#725AF5" : "#FFFFFF"}
          size="small"
        />
      ) : (
        <Text
          className={`${isWhite ? "text-primary-500" : "text-white"} text-[16px] font-medium leading-8.75 text-center`}
        >
          {children}
        </Text>
      )}
    </Pressable>
  );
}
