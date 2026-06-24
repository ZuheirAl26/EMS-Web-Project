import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../../../store/AuthStore";
import { checkAuthStatusApi, resendVerificationApi } from "../api/Authapi";
import { authKeys } from "../api/authKeys";

export function useCheckEmail() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const user = useAuthStore((state) => state.user);
  const login = useAuthStore((state) => state.login);
  const token = useAuthStore((state) => state.token);

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const { data: authStatus } = useQuery({
    queryKey: authKeys.status(),
    queryFn: checkAuthStatusApi,
    refetchInterval: (query) => {
      const verified = query.state.data?.data?.is_verified;
      return verified ? false : 5000;
    },
    refetchIntervalInBackground: true,
  });

  const isVerified = authStatus?.data?.is_verified === true;

  useEffect(() => {
    if (isVerified) {
      if (user && token) {
        const verifiedUser = authStatus?.data?.user || {
          ...user,
          is_verified: true,
        };
        login(verifiedUser, token);
      }
      navigate("/dashboard", { replace: true });
    }
  }, [isVerified, authStatus, user, token, login, navigate]);

  useEffect(() => {
    const channel = new BroadcastChannel("AUTH_SUCCESS_CHANNEL");
    channel.onmessage = (event) => {
      if (event.data?.type === "SUCCESS") {
        if (event.data.user && event.data.token) {
          login(event.data.user, event.data.token);
        } else if (user && token) {
          login({ ...user, is_verified: true }, token);
        }
        queryClient.invalidateQueries({ queryKey: authKeys.status() });
        navigate("/dashboard", { replace: true });
      }
    };
    return () => channel.close();
  }, [login, navigate, queryClient, user, token]);

  const resendMutation = useMutation({
    mutationFn: (email: string) => resendVerificationApi({ email }),
    onSuccess: () => {
      setSuccessMessage(t("checkEmail.emailSent"));
    },
    onError: (err: any) => {
      setApiError(err?.response?.data?.message || t("checkEmail.errorMsg"));
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
