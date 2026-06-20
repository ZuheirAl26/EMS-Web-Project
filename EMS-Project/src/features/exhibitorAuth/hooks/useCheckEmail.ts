import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../../../store/AuthStore";
import {
  checkAuthStatusApi,
  getUserProfileApi,
  resendVerificationApi,
} from "../api/Authapi";

export function useCheckEmail() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);
  const login = useAuthStore((state) => state.login);

  const [isResending, setIsResending] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    const checkVerificationStatus = async () => {
      try {
        const statusResponse = await checkAuthStatusApi();
        console.log("Polling tick! Status:", statusResponse);
        if (statusResponse?.data?.is_verified === true) {
          console.log("User is verified! Redirecting...");
          navigate("/dashboard", { replace: true });
        }
      } catch (error: any) {
        console.log("Polling check error:", error?.message);
      }
    };

    const intervalId = setInterval(checkVerificationStatus, 5000);
    return () => clearInterval(intervalId);
  }, [navigate]);

  const handleResendClick = async () => {
    if (!user?.email) return;

    setIsResending(true);
    setSuccessMessage(null);
    setApiError(null);

    try {
      await resendVerificationApi({ email: user.email });
      setSuccessMessage(t("checkEmail.emailSent"));
    } catch (error: any) {
      setApiError(error.response?.data?.message || t("checkEmail.errorMsg"));
    } finally {
      setIsResending(false);
      console.log("Faild");
    }
  };

  return {
    user,
    isResending,
    successMessage,
    apiError,
    handleResendClick,
    t,
  };
}
