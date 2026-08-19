import { api } from "..";
import type { ApiResponse } from "@/types/api";
import type { ConditionPayload, ConditionResponse } from "@/types/condition";

// 컨디션 조회
export const getConditions = async () => {
  const { data } = await api.get<ApiResponse<ConditionResponse>>(
    "/conditions/latest",
  );
  return data.data;
};

// 컨디션 분석 및 저장
export const analyzeCondition = async (payload: ConditionPayload) => {
  const { data } = await api.post<ApiResponse<ConditionResponse>>(
    "/conditions",
    payload,
  );
  return data.data;
};
