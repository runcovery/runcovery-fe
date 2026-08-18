export type UserGender = "male" | "female";

export interface UserProfile {
  nickname: string;
  age: number;
  gender: UserGender | "";
  height: number;
  weight: number;
  runningExperience: string;
}

export interface UserCreatePayload extends Omit<UserProfile, "gender"> {
  userId: string;
  gender: UserGender;
}

export interface UserCreateResponse {
  userId: number;
  nickname: string;
}
