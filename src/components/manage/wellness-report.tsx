import { ScrollView, Text, View } from "react-native";
import PrescriptionCard from "./prescription-card";
import WellnessCenterCard from "./wellness-center-card";
import type { Prescription, WellnessCenter } from "./wellness-report.types";
import type { ReportResponse } from "@/types/wellness";
import { useQuery } from "@tanstack/react-query";
import { getPrescriptions } from "@/apis/wellness";
import { router } from "expo-router";
import { getApiErrorMessage } from "@/apis";
import { queryKeys } from "@/lib/query-keys";

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

export default function WellnessReport({ report }: { report: ReportResponse }) {
  const prescriptionsQuery = useQuery({
    queryKey: queryKeys.wellness.prescriptionList(),
    queryFn: () => getPrescriptions(),
  });
  const fallbackPrescriptions: Prescription[] = [
    { id: "hydration", category: "수분/영양", tone: "nutrition", title: report.hydration.title, description: report.hydration.solution },
    { id: "skin", category: "피부/두피", tone: "skin", title: report.skin.title, description: report.skin.solution },
    { id: "stretching", category: "스트레칭", tone: "stretching", title: report.stretching.title, description: report.stretching.solution },
  ];
  const prescriptions: Prescription[] = prescriptionsQuery.data?.map((item) => {
    const hasDetailScreen = item.category !== "NUTRITION";

    return {
      id: item.prescriptionId,
      category: item.categoryName,
      tone: item.category === "NUTRITION" ? "nutrition" : item.category === "SKIN" ? "skin" : "stretching",
      title: item.title,
      description: item.summary,
      actionLabel: hasDetailScreen
        ? item.isCompleted
          ? "관리 완료됨"
          : "자세히 보기"
        : undefined,
      onPress: hasDetailScreen
        ? () => router.push({
            pathname: "/manage/prescriptions/[prescriptionId]",
            params: { prescriptionId: String(item.prescriptionId) },
          })
        : undefined,
    };
  }) ?? fallbackPrescriptions;
  return (
    <ScrollView
      className="flex-1 w-full"
      contentContainerStyle={{ paddingBottom: 24 }}
      showsVerticalScrollIndicator={false}
    >
      {/* 타이틀 */}
      <Text className="mt-3 text-[20px] font-semibold text-neutral-950">
        맞춤형 웰니스 처방전
      </Text>

      {/* 맞춤 처방 리스트 */}
      <View className="mt-4 gap-4">
        {prescriptions.map((prescription) => (
          <PrescriptionCard key={prescription.id} prescription={prescription} />
        ))}
      </View>
      {prescriptionsQuery.isError ? (
        <Text className="mt-3 text-center text-[12px] text-error">
          {getApiErrorMessage(prescriptionsQuery.error, "상세 처방전 정보를 불러오지 못했습니다.")}
        </Text>
      ) : null}

      {/* 오프라인 웰니스 센터 */}
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
