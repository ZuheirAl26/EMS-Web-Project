import type { ChangeEvent, ReactNode } from "react";

export interface TextInputProps {
  id: string;
  label: string;
  type?: "text" | "email";
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
}

export interface PasswordInputProps {
  id: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
}

export interface GoogleButtonProps {
  onClick: () => void;
  isLoading?: boolean;
}

export interface ModalOverlayProps {
  children: ReactNode;
  onClose?: () => void;
}

export interface PasswordStrengthBarProps {
  strength: number;
  password: string;
  confirmPassword?: string;
}

export interface LogoutDialogProps {
  errorMessage: string | null;
  isPending: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  open: boolean;
}
