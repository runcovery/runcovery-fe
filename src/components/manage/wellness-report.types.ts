export type PrescriptionTone = "nutrition" | "skin" | "stretching";

export interface Prescription {
  id: string;
  category: string;
  tone: PrescriptionTone;
  title: string;
  description: string;
  actionLabel?: string;
}

export interface WellnessCenter {
  id: string;
  name: string;
  description: string;
}
