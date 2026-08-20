import { apiClient } from "../../../api/ApiClient";
import type {
  AuthResponse,
  AuthStatusResponse,
  ChangePasswordPayload,
  ForgotPasswordPayload,
  GoogleAuthPayload,
  LoginPayload,
  LogoutResponse,
  PasswordResponse,
  RegisterPayload,
  ResendVerificationPayload,
  ResetPasswordPayload,
} from "../types/authType";

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

export interface RegisterInvitationPayload {
  name: string;
  password: string;
  password_confirmation: string;
}

export const registerInvitationApi = async (
  invitationToken: string,
  data: RegisterInvitationPayload,
): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>(
    `/v1/exhibitor/register/${invitationToken}`,
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

export const logoutApi = async (): Promise<LogoutResponse> => {
  const response = await apiClient.post<LogoutResponse>(
    "/v1/exhibitor/logout",
  );

  if (!response.data.status) {
    throw new Error(response.data.message || "Logout failed.");
  }

  return response.data;
};
