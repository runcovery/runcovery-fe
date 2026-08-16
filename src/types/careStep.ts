export type CheckType = "running" | "energy" | "sweat";

export type StepType =
  | CheckType
  | "pain"
  | "summary"
  | "loading"
  | "intensity"
  | "report";
