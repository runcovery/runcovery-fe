import { api } from "..";

// 컨디션 조회
export const getConditions = async () => {
  const res = await api.get("/conditions/latest");

  return res;
};

// 컨디션 분석 및 재조회
export const anaylCondition = async () => {
  const res = await api.post("/conditions");

  return res;
};
