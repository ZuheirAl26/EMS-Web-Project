import { apiClient } from "../../../api/ApiClient";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface UserData {
  id: number;
  name: string;
  email: string;
  google_id: string | null;
  type: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface GoogleAuthPayload {
  token: string;
}

export interface SystemUser {
  id: number;
  name: string;
  email: string;
  role: "admin" | "exhibitor";
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  status: boolean;
  message: string;
  data: {
    user: UserData;
    token?: string;
    access_token?: string;
  };
}
export interface AuthStatusResponse {
  status: boolean;
  message: string;
  data?: {
    is_verified: boolean;
    user?: UserData;
  };
}

export interface ResendVerificationPayload {
  email: string;
}

export interface GoogleAuthResponse {
  token: string;
  user: SystemUser;
}

export const loginApi = async (data: LoginPayload): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>(
    "/v1/exhibitor/login",
    data,
  );
  return response.data;
};

export const registerApi = async (
  data: RegisterPayload,
): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>(
    "/v1/exhibitor/register",
    data,
  );
  return response.data;
};

export const checkAuthStatusApi = async (): Promise<AuthStatusResponse> => {
  const response = await apiClient.get<AuthStatusResponse>(
    "/v1/exhibitor/auth/status",
  );
  return response.data;
};

export const verifyEmailApi = async (
  id: string,
  hash: string,
  query: string,
): Promise<AuthResponse> => {
  const response = await apiClient.get<AuthResponse>(
    `/v1/exhibitor/email/verify/${id}/${hash}${query}`,
  );
  return response.data;
};

export const resendVerificationApi = async (
  data: ResendVerificationPayload,
): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>(
    "/v1/exhibitor/email/resend-verification",
    data,
  );
  return response.data;
};

export const googleAuthApi = async (
  data: GoogleAuthPayload,
): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>(
    "/v1/exhibitor/auth/system/google",
    data,
  );
  return response.data;
};
