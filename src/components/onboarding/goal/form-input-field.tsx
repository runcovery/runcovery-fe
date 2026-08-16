import { KeyboardTypeOptions, Text, TextInput, View } from "react-native";

interface FormInputFieldProps {
  label?: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: KeyboardTypeOptions;
}

export default function FormInputField({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType,
}: FormInputFieldProps) {
  const hasValue = value.trim().length > 0;

  return (
    <View className="gap-5">
      {label && (
        <Text className="will-change-variable text-[14px] font-semibold text-[#373737]">
          {label}
        </Text>
      )}
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        style={{
          paddingHorizontal: 24,
          paddingVertical: 12,
          textAlignVertical: "center",
        }}
        className={`shadow-[0_2px_4px_rgba(0,0,0,0.08)] rounded-2xl border focus:border-primary-500 py-5 px-5 text-[14px] font-medium text-neutral-500 placeholder:text-neutral-200 border-neutral-200`}
      />
    </View>
  );
}
