import { api } from "..";
import type {
  PrescriptionCategory,
  PrescriptionCompletion,
  PrescriptionDetail,
  PrescriptionSummary,
  ReportPayload,
  ReportPreview,
  ReportResponse,
  SkinComparisonResponse,
  SkinRecordResponse,
  WellnessReportSummary,
} from "@/types/wellness";
import type { ApiResponse } from "@/types/api";
import { Platform } from "react-native";

// 러닝 직후 또는 관리 후 피부 이미지 분석
export const scanSkin = async (
  image:
    | string
    | { uri: string; fileName?: string | null; mimeType?: string },
  type: "AFTER_RUN" | "AFTER_CARE",
) => {
  const uri = typeof image === "string" ? image : image.uri;
  const fileName =
    typeof image === "string" ? "skin.jpg" : image.fileName || "skin.jpg";
  const mimeType =
    typeof image === "string" ? "image/jpeg" : image.mimeType || "image/jpeg";
  const formData = new FormData();
  // 웹 FormData는 Blob을 요구하지만 React Native는 파일 메타데이터 객체를 받는다.
  if (Platform.OS === "web") {
    const blob = await fetch(uri).then((response) => response.blob());
    formData.append("file", blob, fileName);
  } else {
    formData.append("file", {
      uri,
      name: fileName,
      type: mimeType,
    } as unknown as Blob);
  }
  const { data } = await api.post<ApiResponse<SkinRecordResponse>>(
    "/wellness/skin/scan",
    formData,
    { params: { type } },
  );
  return data.data;
};

// 관리 후 측정값과 이전 기록 비교
export const getSkinComparison = async (date: string) => {
  const { data } = await api.get<ApiResponse<SkinComparisonResponse>>(
    "/wellness/skin/comparison",
    { params: { date } },
  );
  return data.data;
};

// 리포트 생성 전 활동 요약 조회
export const getReportPreview = async (activityRecordId: number) => {
  const { data } = await api.get<ReportPreview>("/wellness/reports/preview", {
    params: { activityRecordId },
  });
  return data;
};

// 설문과 통증 부위를 기반으로 웰니스 리포트 생성
export const generateReport = async (payload: ReportPayload) => {
  const { data } = await api.post<ReportResponse>(
    "/wellness/reports",
    payload,
  );
  return data;
};

// 가장 최근 웰니스 리포트 조회
export const getLatestReport = async () => {
  const { data } = await api.get<WellnessReportSummary>("/wellness/reports");
  return data;
};

// 리포트별 맞춤 처방 목록 조회
export const getPrescriptions = async (reportId?: number) => {
  const { data } = await api.get<PrescriptionSummary[]>(
    "/wellness/prescriptions",
    { params: reportId ? { reportId } : undefined },
  );
  return data;
};

// 개별 처방 상세 조회
export const getPrescriptionDetail = async (prescriptionId: number) => {
  const { data } = await api.get<PrescriptionDetail>(
    `/wellness/prescriptions/${prescriptionId}`,
  );
  return data;
};

// 피부·스트레칭 처방의 완료 상태 저장
export const updatePrescriptionCompletion = async ({
  category,
  reportId,
  isCompleted,
}: {
  category: Extract<PrescriptionCategory, "SKIN" | "STRETCH">;
  reportId?: number;
  isCompleted: boolean;
}) => {
  const { data } = await api.patch<PrescriptionCompletion>(
    `/wellness/prescriptions/${category}/complete`,
    { isCompleted },
    { params: reportId ? { reportId } : undefined },
  );
  return data;
};
