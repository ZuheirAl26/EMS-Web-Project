import type { TFunction } from "i18next";
import type {
  LoginErrors,
  LoginFormData,
  PasswordErrors,
  RegisterErrors,
  RegisterFormData,
} from "../types/validationType";

const EMAIL_PATTERN = /\S+@\S+\.\S+/;
const MINIMUM_PASSWORD_LENGTH = 8;

export function validateLoginForm(
  { email, password }: LoginFormData,
  t: TFunction,
): { isValid: boolean; errors: LoginErrors } {
  const errors: LoginErrors = {};

  if (!email) {
    errors.email = t("login.validation.emailRequired", "Email is required");
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = t(
      "login.validation.emailInvalid",
      "Please enter a valid email address",
    );
  }

  if (!password) {
    errors.password = t(
      "login.validation.passwordRequired",
      "Password is required",
    );
  } else if (password.length < MINIMUM_PASSWORD_LENGTH) {
    errors.password = t(
      "login.validation.passwordShort",
      "Password must be at least 8 characters",
    );
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}

export function validateRegisterForm(
  { fullName, email, password, confirmPassword }: RegisterFormData,
  t: TFunction,
): { isValid: boolean; errors: RegisterErrors } {
  const errors: RegisterErrors = {};

  if (!fullName.trim()) {
    errors.fullName = t(
      "register.validation.nameRequired",
      "Full name is required",
    );
  }

  if (!email) {
    errors.email = t("login.validation.emailRequired", "Email is required");
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = t(
      "login.validation.emailInvalid",
      "Please enter a valid email address",
    );
  }

  if (!password) {
    errors.password = t(
      "login.validation.passwordRequired",
      "Password is required",
    );
  } else if (password.length < MINIMUM_PASSWORD_LENGTH) {
    errors.password = t(
      "login.validation.passwordShort",
      "Password must be at least 8 characters",
    );
  }

  if (password !== confirmPassword) {
    errors.confirmPassword = t(
      "register.form.passwordMismatch",
      "Passwords do not match. Please try again.",
    );
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}

export function validatePasswordConfirmation(
  password: string,
  confirmPassword: string,
  t: TFunction,
  namespace: "changePassword" | "resetPassword",
  currentPassword?: string,
): PasswordErrors {
  const errors: PasswordErrors = {};

  if (currentPassword !== undefined && !currentPassword) {
    errors.currentPassword = t("changePassword.currentRequired");
  }

  if (!password || password.length < MINIMUM_PASSWORD_LENGTH) {
    errors.password =
      namespace === "changePassword"
        ? t("changePassword.passwordShort")
        : t("resetPassword.passwordShort");
  }

  if (password !== confirmPassword) {
    errors.confirmPassword =
      namespace === "changePassword"
        ? t("changePassword.passwordMismatch")
        : t("resetPassword.passwordMismatch");
  }

  return errors;
}

export function validateEmail(email: string): boolean {
  return EMAIL_PATTERN.test(email.trim());
}

export function calculatePasswordStrength(password: string): number {
  if (!password) {
    return 0;
  }

  return [
    password.length >= MINIMUM_PASSWORD_LENGTH,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ].filter(Boolean).length;
}
