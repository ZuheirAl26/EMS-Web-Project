import type { TFunction } from "i18next";

interface LoginData {
  email: string;
  password: string;
}

interface LoginErrors {
  email?: string;
  password?: string;
}

export const validateLoginForm = (
  { email, password }: LoginData,
  t: TFunction,
): { isValid: boolean; errors: LoginErrors } => {
  const errors: LoginErrors = {};

  // Email Validation
  if (!email) {
    errors.email = t("login.validation.emailRequired", "Email is required");
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    errors.email = t(
      "login.validation.emailInvalid",
      "Please enter a valid email address",
    );
  }

  // Password Validation
  if (!password) {
    errors.password = t(
      "login.validation.passwordRequired",
      "Password is required",
    );
  } else if (password.length < 6) {
    errors.password = t(
      "login.validation.passwordShort",
      "Password must be at least 6 characters",
    );
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
