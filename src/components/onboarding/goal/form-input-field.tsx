import { useRef, useState } from "react";
import type { KeyboardTypeOptions, TextInputProps } from "react-native";
import {
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

interface FormInputFieldProps {
  label?: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: KeyboardTypeOptions;
  prefix?: string;
  suffix?: string;
  onFocus?: TextInputProps["onFocus"];
}

export default function FormInputField({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType,
  prefix,
  suffix,
  onFocus,
}: FormInputFieldProps) {
  const hasValue = value.trim().length > 0;
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  return (
    <View className="gap-5">
      {/* 입력 라벨 */}
      {label && (
        <Text className="will-change-variable text-[14px] font-semibold text-[#373737]">
          {label}
        </Text>
      )}
      {/* 접두사·입력값·단위가 한 줄로 이어지는 목표 입력창 */}
      <Pressable
        onPress={() => inputRef.current?.focus()}
        className={`shadow-[0_2px_4px_rgba(0,0,0,0.08)] flex-row items-center rounded-2xl border px-6 py-5 ${
          isFocused ? "border-primary-500" : "border-neutral-200"
        }`}
      >
        {hasValue && prefix && (
          <Text className="text-[14px] font-medium text-neutral-500">
            {prefix}
          </Text>
        )}
        <TextInput
          ref={inputRef}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          onFocus={(event) => {
            setIsFocused(true);
            onFocus?.(event);
          }}
          onBlur={() => setIsFocused(false)}
          style={
            hasValue ? { width: Math.max(10, value.length * 8.5) } : { flex: 1 }
          }
          className="p-0 text-[14px] font-medium text-neutral-500 placeholder:text-neutral-200"
        />
        {hasValue && suffix && (
          <Text className="text-[14px] font-semibold text-neutral-500">
            {suffix}
          </Text>
        )}
      </Pressable>
    </View>
  );
}
