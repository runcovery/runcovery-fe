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

export const getSkinComparison = async (date: string) => {
  const { data } = await api.get<ApiResponse<SkinComparisonResponse>>(
    "/wellness/skin/comparison",
    { params: { date } },
  );
  return data.data;
};

export const getReportPreview = async (activityRecordId: number) => {
  const { data } = await api.get<ReportPreview>("/wellness/reports/preview", {
    params: { activityRecordId },
  });
  return data;
};

export const generateReport = async (payload: ReportPayload) => {
  const { data } = await api.post<ReportResponse>(
    "/wellness/reports",
    payload,
  );
  return data;
};

export const getLatestReport = async () => {
  const { data } = await api.get<WellnessReportSummary>("/wellness/reports");
  return data;
};

export const getPrescriptions = async (reportId?: number) => {
  const { data } = await api.get<PrescriptionSummary[]>(
    "/wellness/prescriptions",
    { params: reportId ? { reportId } : undefined },
  );
  return data;
};

export const getPrescriptionDetail = async (prescriptionId: number) => {
  const { data } = await api.get<PrescriptionDetail>(
    `/wellness/prescriptions/${prescriptionId}`,
  );
  return data;
};

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
