import axios from "axios";
import type { ApiErrorResponse } from "../types/apiType";

export function getApiErrorMessage(
  error: unknown,
  fallbackMessage: string,
): string {
  if (axios.isAxiosError<ApiErrorResponse | string>(error)) {
    const data = error.response?.data;

    // 1. Direct string response body from server
    if (typeof data === "string" && data.trim()) {
      return data;
    }

    if (data && typeof data === "object") {
      // 2. Validation errors (object / array / string)
      if (data.errors) {
        if (typeof data.errors === "string" && data.errors.trim()) {
          return data.errors;
        }
        if (Array.isArray(data.errors) && data.errors.length > 0) {
          const first = data.errors[0];
          if (typeof first === "string" && first.trim()) return first;
        }
        if (typeof data.errors === "object") {
          const firstVal = Object.values(data.errors)[0];
          if (
            Array.isArray(firstVal) &&
            firstVal.length > 0 &&
            typeof firstVal[0] === "string"
          ) {
            return firstVal[0];
          }
          if (typeof firstVal === "string" && firstVal.trim()) {
            return firstVal;
          }
        }
      }

      // 3. Server message field
      if (typeof data.message === "string" && data.message.trim()) {
        return data.message;
      }

      // 4. Server error field
      if (typeof data.error === "string" && data.error.trim()) {
        return data.error;
      }
    }

    // Fall back to localized fallbackMessage (avoids raw English "Request failed with status code 422")
    return fallbackMessage;
  }

  if (error instanceof Error && error.message && !error.message.startsWith("Request failed")) {
    return error.message;
  }

  return fallbackMessage;
}

