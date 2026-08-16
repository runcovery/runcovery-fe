import { Pressable, Text, View } from "react-native";
import type { Prescription, PrescriptionTone } from "./wellness-report.types";

const BADGE_CLASS: Record<PrescriptionTone, string> = {
  nutrition: "bg-primary-500",
  skin: "bg-[#FFB74D]",
  stretching: "bg-[#298DFF]",
};

interface PrescriptionCardProps {
  prescription: Prescription;
}

export default function PrescriptionCard({
  prescription,
}: PrescriptionCardProps) {
  return (
    <View className="rounded-[22px] border border-primary-440 bg-white px-5 py-4 shadow-[0_2px_4px_rgba(0,0,0,0.08)]">
      <View
        className={[
          "self-start rounded-lg px-4 py-1",
          BADGE_CLASS[prescription.tone],
        ].join(" ")}
      >
        <Text className="text-[10px] font-semibold text-white">
          {prescription.category}
        </Text>
      </View>

      <Text className="mt-5 text-[16px] font-semibold leading-7 text-neutral-950">
        {prescription.title}
      </Text>
      <Text className="mt-3 text-[12px] font-medium leading-5 text-neutral-300">
        {prescription.description}
      </Text>

      {prescription.actionLabel ? (
        <Pressable
          className="mt-3 self-end"
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={prescription.actionLabel}
        >
          <Text className="text-[12px] font-medium text-primary-500">
            {prescription.actionLabel} {">"}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}
