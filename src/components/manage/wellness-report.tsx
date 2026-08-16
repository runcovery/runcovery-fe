import { ScrollView, Text, View } from "react-native";
import PrescriptionCard from "./prescription-card";
import WellnessCenterCard from "./wellness-center-card";
import type { Prescription, WellnessCenter } from "./wellness-report.types";

const PRESCRIPTIONS: Prescription[] = [
  {
    id: "hydration",
    category: "수분/영양",
    tone: "nutrition",
    title: "땀 배출량이 최고 수준입니다.",
    description:
      "땀 배출량이 많기 때문에 지금 즉시 수분 500ml와 전해질을 보충해 근손실을 막으세요.",
  },
  {
    id: "skin",
    category: "피부/두피",
    tone: "skin",
    title: "야외 러닝으로 자외선 노출 및 열감이 심합니다.",
    description: "모공 확장을 막기 위해 즉각적인 쿨링 세안이 필요합니다.",
    actionLabel: "피부 진단 보기",
  },
  {
    id: "stretching",
    category: "스트레칭",
    tone: "stretching",
    title: "허벅지 부분이 계속적으로 불편합니다.",
    description: "아픈 부위에 폼롤러로 스트레칭을 근육을 풀어주면 좋습니다.",
    actionLabel: "영상 보러 가기",
  },
];

const WELLNESS_CENTERS: WellnessCenter[] = [
  {
    id: "derna",
    name: "DERNA 수분팩",
    description: "열감 즉각 쿨링",
  },
  {
    id: "amred",
    name: "AMRED 크라이오 테라피",
    description: "근육 피로 리셋",
  },
  {
    id: "balance",
    name: "웰니스 밸런스랩",
    description: "맞춤 회복 케어",
  },
];

export default function WellnessReport() {
  return (
    <ScrollView
      className="flex-1 w-full"
      showsVerticalScrollIndicator={false}
    >
      <Text className="mt-3 text-[20px] font-semibold text-neutral-950">
        맞춤형 웰니스 처방전
      </Text>

      <View className="mt-4 gap-4">
        {PRESCRIPTIONS.map((prescription) => (
          <PrescriptionCard key={prescription.id} prescription={prescription} />
        ))}
      </View>

      <Text className="mt-7 text-[18px] font-semibold text-neutral-950">
        더 완벽하고 빠른 회복을 원한다면?
      </Text>

      <ScrollView
        className="-mx-8 mt-5"
        horizontal
        contentContainerStyle={{
          gap: 16,
          paddingHorizontal: 32,
          paddingRight: 48,
        }}
        showsHorizontalScrollIndicator={false}
      >
        {WELLNESS_CENTERS.map((center) => (
          <WellnessCenterCard key={center.id} center={center} />
        ))}
      </ScrollView>
    </ScrollView>
  );
}
