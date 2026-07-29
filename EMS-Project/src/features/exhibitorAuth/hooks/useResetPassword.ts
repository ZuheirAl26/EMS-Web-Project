import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import { resetPasswordApi } from "../api/Authapi";
import type { ResetPasswordPayload } from "../types/authType";
import type { PasswordErrors } from "../types/validationType";
import { getApiErrorMessage } from "../../../utils/apiError";
import {
  calculatePasswordStrength,
  validatePasswordConfirmation,
} from "../utils/validation";

export function useResetPassword() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<PasswordErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const mutation = useMutation({
    mutationFn: (data: ResetPasswordPayload) => resetPasswordApi(data),
    onSuccess: (response) => {
      if (response.status) {
        setIsSuccess(true);
        setTimeout(() => {
          window.open("", "_self");
          window.close();
        }, 1500);
      } else {
        setApiError(response.message || t("resetPassword.errorMsg"));
      }
    },
    onError: (error: unknown) => {
      setApiError(
        getApiErrorMessage(error, t("resetPassword.errorMsg")),
      );
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    const newErrors = validatePasswordConfirmation(
      password,
      confirmPassword,
      t,
      "resetPassword",
    );
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    mutation.mutate({
      token,
      email,
      password,
      password_confirmation: confirmPassword,
    });
  };

  const passwordStrength = calculatePasswordStrength(password);

  const isLinkValid = Boolean(token && email);

  return {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    errors,
    setErrors,
    apiError,
    isLoading: mutation.isPending,
    isSuccess,
    isLinkValid,
    passwordStrength,
    handleSubmit,
    t,
  };
}
