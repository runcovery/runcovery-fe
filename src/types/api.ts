export interface ApiResponse<Data> {
  code: number;
  success: boolean;
  data: Data;
  message: string;
}

export interface ApiPayload<Payload> {
  payload: Payload;
}

export type AsyncStatus = "idle" | "loading" | "success" | "error";
