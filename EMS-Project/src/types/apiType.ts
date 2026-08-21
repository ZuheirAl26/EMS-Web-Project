export interface ApiErrorResponse {
  message?: string;
  error?: string;
  errors?: Record<string, string[] | string> | string[] | string;
  status?: boolean;
}
