import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../../../store/AuthStore";
import { checkAuthStatusApi, resendVerificationApi } from "../api/Authapi";
import { authKeys } from "../api/AuthKeys";
import { getApiErrorMessage } from "../../../utils/apiError";

const COOLDOWN_SECONDS = 120;

export function useCheckEmail() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const user = useAuthStore((state) => state.user);
  const login = useAuthStore((state) => state.login);
  const token = useAuthStore((state) => state.token);

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startCooldown = () => {
    setCooldown(COOLDOWN_SECONDS);
    timerRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setSuccessMessage(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

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
      navigate("/dashboard/profile", { replace: true });
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
        navigate("/dashboard/profile", { replace: true });
      }
    };
    return () => channel.close();
  }, [login, navigate, queryClient, user, token]);

  const resendMutation = useMutation({
    mutationFn: (email: string) => resendVerificationApi({ email }),
    onSuccess: () => {
      setSuccessMessage(t("checkEmail.emailSent"));
      startCooldown();
    },
    onError: (error: unknown) => {
      setApiError(getApiErrorMessage(error, t("checkEmail.errorMsg")));
    },
  });

  const handleResendClick = () => {
    if (!user?.email || cooldown > 0) return;
    setSuccessMessage(null);
    setApiError(null);
    resendMutation.mutate(user.email);
  };

  return {
    user,
    isResending: resendMutation.isPending,
    successMessage,
    apiError,
    cooldown,
    handleResendClick,
    t,
  };
}
