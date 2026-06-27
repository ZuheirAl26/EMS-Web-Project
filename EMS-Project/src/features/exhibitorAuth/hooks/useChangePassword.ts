import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import { changePasswordApi, type ChangePasswordPayload } from "../api/Authapi";

export function useChangePassword(onSuccess?: () => void) {
  const { t } = useTranslation();

  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{
    currentPassword?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
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
    onError: (error: any) => {
      setApiError(
        error.response?.data?.message || t("changePassword.errorMsg"),
      );
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    setIsSuccess(false);
    const newErrors: typeof errors = {};

    if (!currentPassword) {
      newErrors.currentPassword = t("changePassword.currentRequired");
    }
    if (!password || password.length < 8) {
      newErrors.password = t("changePassword.passwordShort");
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = t("changePassword.passwordMismatch");
    }
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

  const passwordStrength = (() => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  })();

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
