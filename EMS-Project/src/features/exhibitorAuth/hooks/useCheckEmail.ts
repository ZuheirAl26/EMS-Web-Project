import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../../../store/AuthStore";
import { checkAuthStatusApi, resendVerificationApi } from "../api/Authapi";
import { authKeys } from "../api/authKeys";

export function useCheckEmail() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const { data: authStatus } = useQuery({
    queryKey: authKeys.status(),
    queryFn: checkAuthStatusApi,
    refetchInterval: (query) => {
      const isVerified = query.state.data?.data?.is_verified;
      return isVerified ? false : 5000;
    },
  });

  useEffect(() => {
    if (authStatus?.data?.is_verified === true) {
      navigate("/dashboard", { replace: true });
    }
  }, [authStatus, navigate]);

  const resendMutation = useMutation({
    mutationFn: (email: string) => resendVerificationApi({ email }),
    onSuccess: () => {
      setSuccessMessage(t("checkEmail.emailSent"));
    },
    onError: (err: any) => {
      setApiError(err.response?.data?.message || t("checkEmail.errorMsg"));
    },
  });

  const handleResendClick = () => {
    if (!user?.email) return;
    setSuccessMessage(null);
    setApiError(null);
    resendMutation.mutate(user.email);
  };

  return {
    user,
    isResending: resendMutation.isPending,
    successMessage,
    apiError,
    handleResendClick,
    t,
  };
}
