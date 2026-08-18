import type { FocusEvent, KeyboardTypeOptions } from "react-native";
import { Text, TextInput, View } from "react-native";

interface InputFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: KeyboardTypeOptions;
  onFocus?: (event: FocusEvent) => void;
  onPressIn?: () => void;
}

export default function InputField({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType,
  onFocus,
  onPressIn,
}: InputFieldProps) {
  const hasValue = value.trim().length > 0;

  return (
    <View className="gap-5">
      <Text className="will-change-variable text-[16px] font-semibold text-[#373737]">
        {label}
      </Text>
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        onFocus={onFocus}
        onPressIn={onPressIn}
        style={{
          paddingHorizontal: 20,
          paddingVertical: 14,
          textAlignVertical: "center",
        }}
        className={`rounded-2xl border text-[14px] font-medium text-neutral-500 shadow-[0_2px_4px_rgba(0,0,0,0.08)] placeholder:text-neutral-200 focus:border-primary-500 ${
          hasValue ? "border-primary-500" : "border-neutral-200"
        }`}
      />
    </View>
  );
}
