export type PrescriptionTone = "nutrition" | "skin" | "stretching";

export interface Prescription {
  id: string | number;
  category: string;
  tone: PrescriptionTone;
  title: string;
  description: string;
  actionLabel?: string;
  onPress?: () => void;
}

export interface WellnessCenter {
  id: string;
  name: string;
  description: string;
}
