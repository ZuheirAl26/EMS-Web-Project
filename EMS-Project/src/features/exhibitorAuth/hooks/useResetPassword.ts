import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import { resetPasswordApi, type ResetPasswordPayload } from "../api/Authapi";

export function useResetPassword() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{
    password?: string;
    confirmPassword?: string;
  }>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const mutation = useMutation({
    mutationFn: (data: ResetPasswordPayload) => resetPasswordApi(data),
    onSuccess: (response) => {
      if (response.status) {
        setIsSuccess(true);
        setTimeout(() => {
          navigate("/login", { replace: true });

          if (window.opener && !window.opener.closed) {
            window.opener.close();
          }
        }, 2500);
      } else {
        setApiError(response.message || t("resetPassword.errorMsg"));
      }
    },
    onError: (error: any) => {
      setApiError(error.response?.data?.message || t("resetPassword.errorMsg"));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    const newErrors: typeof errors = {};

    if (!password || password.length < 8) {
      newErrors.password = t("resetPassword.passwordShort");
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = t("resetPassword.passwordMismatch");
    }
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

  const passwordStrength = (() => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  })();

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
