import { Pressable, Text } from "react-native";

interface ButtonProps {
  children: React.ReactNode;
  isMid?: boolean;
}

export default function Button({ children, isMid }: ButtonProps) {
  const midClass = isMid ? "max-w-41 h-11.5" : "max-w-84 h-12.5";

  return (
    <Pressable
      className={`${midClass} bg-primary-500 rounded-xl w-full  flex items-center justify-center`}
    >
      <Text className="text-[16px] font-medium text-white leading-8.75 text-center">
        {children}
      </Text>
    </Pressable>
  );
}
