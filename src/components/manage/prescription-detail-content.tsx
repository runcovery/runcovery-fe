import { Image, Linking, Text, View } from "react-native";

import type { SkinDetail, StretchingDetail } from "@/types/wellness";
import Button from "@/components/ui/Button";
import StatProgressBar from "./stat-progress-bar";

const SKIN_METRICS: Array<{ key: keyof SkinDetail; label: string }> = [
  { key: "redness", label: "홍조" },
  { key: "oiliness", label: "유분" },
  { key: "texture", label: "피부결" },
  { key: "pores", label: "모공" },
  { key: "blemishes", label: "잡티" },
  { key: "hydration", label: "보습" },
  { key: "pigment", label: "색소침착" },
];

const getYoutubeThumbnail = (url: string) => {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([^?&/]+)/,
  );
  return match?.[1]
    ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`
    : null;
};

export function SkinPrescriptionContent({ detail }: { detail: SkinDetail }) {
  return (
    <View>
      {/* 피부 처방 타이틀 */}
      <Text className="mt-3 text-[20px] font-semibold text-neutral-950">
        데일리 피부 진단
      </Text>
      <Text className="mt-2 text-[13px] font-medium text-neutral-300">
        {detail.description}
      </Text>
      {/* 피부 항목별 점수 */}
      <View className="mt-7 gap-6">
        {SKIN_METRICS.map(({ key, label }) => {
          const score = Number(detail[key]);
          return (
            <View key={key}>
              <Text className="text-[14px] font-medium text-neutral-500">
                {label}
              </Text>
              <View className="mt-3">
                <StatProgressBar
                  progress={score}
                  accessibilityLabel={`${label} ${score}점`}
                />
              </View>
              <Text className="mt-2 self-end text-[12px] font-medium text-neutral-500">
                {score}점
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

export function StretchingPrescriptionContent({
  detail,
}: {
  detail: StretchingDetail;
}) {
  const video = detail.recoveryVideos?.[0];
  const videoUrl = video?.videoUrl || detail.recommendedLink;
  const thumbnail = videoUrl ? getYoutubeThumbnail(videoUrl) : null;

  return (
    <View>
      {/* 스트레칭 처방 타이틀 */}
      <Text className="mt-3 text-[20px] font-semibold leading-8 text-neutral-950">
        {video?.title ?? "오늘 무리한 근육을 위한 회복 스트레칭"}
      </Text>
      {/* 추천 영상 썸네일과 재생 버튼 */}
      {thumbnail ? (
        <View className="mt-5 overflow-hidden rounded-[22px] bg-neutral-100">
          <Image
            source={{ uri: thumbnail }}
            className="h-55 w-full"
            resizeMode="cover"
          />
        </View>
      ) : null}
      {videoUrl ? (
        <View className="mt-4">
          <Button isWhite onPress={() => Linking.openURL(videoUrl)}>
            추천 영상 재생하기
          </Button>
        </View>
      ) : null}
      <Text className="mt-7 text-[18px] font-semibold text-neutral-950">
        AI 영상 추천
      </Text>
      {/* 스트레칭 단계별 안내 */}
      <View className="mt-4 rounded-[20px] border border-primary-440 bg-white px-5 py-5">
        <Text className="text-[13px] font-medium leading-6 text-neutral-500">
          {detail.description}
        </Text>
        {detail.steps?.map((step, index) => (
          <View key={`${step.label}-${index}`} className="mt-5">
            <View className="self-start rounded-lg bg-primary-200 px-3 py-1">
              <Text className="text-[10px] font-semibold text-white">
                {step.label}
              </Text>
            </View>
            <Text className="mt-2 text-[13px] font-medium leading-6 text-neutral-500">
              {step.description}
            </Text>
          </View>
        ))}
        {video?.recommendationReason ? (
          <Text className="mt-5 text-[13px] font-medium leading-6 text-neutral-500">
            {video.recommendationReason}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
