import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import { forgotPasswordApi, type ForgotPasswordPayload } from "../api/Authapi";

export function useForgotPassword() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (data: ForgotPasswordPayload) => forgotPasswordApi(data),
    onSuccess: (response) => {
      if (response.status) {
        setSuccessMessage(t("forgotPassword.emailSent"));
        setApiError(null);
      } else {
        setApiError(response.message || t("forgotPassword.errorMsg"));
      }
    },
    onError: (error: any) => {
      setApiError(
        error.response?.data?.message || t("forgotPassword.errorMsg"),
      );
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    setSuccessMessage(null);
    if (!email.trim()) {
      setApiError(t("forgotPassword.emailRequired"));
      return;
    }
    mutation.mutate({ email });
  };

  return {
    email,
    setEmail,
    apiError,
    successMessage,
    isLoading: mutation.isPending,
    emailSent: !!successMessage,
    handleSubmit,
    t,
  };
}
