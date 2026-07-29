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

export interface ApiErrorResponse {
  message?: string;
}
