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

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface ChangePasswordPayload {
  current_password: string;
  password: string;
  password_confirmation: string;
}

export interface PasswordResponse {
  status: boolean;
  message: string;
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

export const forgotPasswordApi = async (
  data: ForgotPasswordPayload,
): Promise<PasswordResponse> => {
  const response = await apiClient.post<PasswordResponse>(
    "/v1/exhibitor/forgot-password",
    data,
  );
  return response.data;
};

export const resetPasswordApi = async (
  data: ResetPasswordPayload,
): Promise<PasswordResponse> => {
  const response = await apiClient.post<PasswordResponse>(
    "/v1/exhibitor/reset-password",
    data,
  );
  return response.data;
};

export const changePasswordApi = async (
  data: ChangePasswordPayload,
): Promise<PasswordResponse> => {
  const response = await apiClient.post<PasswordResponse>(
    "/v1/exhibitor/change-password",
    data,
  );
  return response.data;
};
