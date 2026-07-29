import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import { changePasswordApi } from "../api/Authapi";
import type { ChangePasswordPayload } from "../types/authType";
import type { PasswordErrors } from "../types/validationType";
import { getApiErrorMessage } from "../utils/apiError";
import {
  calculatePasswordStrength,
  validatePasswordConfirmation,
} from "../utils/validation";

export function useChangePassword(onSuccess?: () => void) {
  const { t } = useTranslation();

  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<PasswordErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const mutation = useMutation({
    mutationFn: (data: ChangePasswordPayload) => changePasswordApi(data),
    onSuccess: (response) => {
      if (response.status) {
        setIsSuccess(true);
        setCurrentPassword("");
        setPassword("");
        setConfirmPassword("");
        onSuccess?.();
      } else {
        setApiError(response.message || t("changePassword.errorMsg"));
      }
    },
    onError: (error: unknown) => {
      setApiError(
        getApiErrorMessage(error, t("changePassword.errorMsg")),
      );
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    setIsSuccess(false);
    const newErrors = validatePasswordConfirmation(
      password,
      confirmPassword,
      t,
      "changePassword",
      currentPassword,
    );
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    mutation.mutate({
      current_password: currentPassword,
      password,
      password_confirmation: confirmPassword,
    });
  };

  const passwordStrength = calculatePasswordStrength(password);

  return {
    currentPassword,
    setCurrentPassword,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    errors,
    setErrors,
    apiError,
    isLoading: mutation.isPending,
    isSuccess,
    passwordStrength,
    handleSubmit,
    t,
  };
}
