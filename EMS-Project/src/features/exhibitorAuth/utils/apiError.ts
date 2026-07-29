import axios from "axios";
import type { ApiErrorResponse } from "../types/authType";

export function getApiErrorMessage(
  error: unknown,
  fallbackMessage: string,
): string {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return error.response?.data?.message || error.message || fallbackMessage;
  }

  return error instanceof Error ? error.message : fallbackMessage;
}
