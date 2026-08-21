import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../store/AuthStore";
import { getApiErrorMessage } from "../../../utils/apiError";
import { logoutApi } from "../api/Authapi";
import { clearCachedExhibitorProfile } from "../../ExhibitorProfile/utils/profileCache";
import { clearFcmRegistration } from "../../Notifications/hooks/useNotifications";

export function useLogout() {
  const { t } = useTranslation("dashboard");
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const clearAuth = useAuthStore((state) => state.logout);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: logoutApi,
    onMutate: () => {
      setErrorMessage(null);
    },
    onSuccess: () => {
      clearAuth();
      clearCachedExhibitorProfile();
      clearFcmRegistration();
      navigate("/login", { replace: true });
    },
    onError: (error: unknown) => {
      setErrorMessage(
        getApiErrorMessage(error, t("account.logoutDialog.error")),
      );
    },
    onSettled: (_data, error) => {
      if (!error) {
        queryClient.clear();
      }
    },
  });

  return {
    errorMessage,
    isPending: mutation.isPending,
    logout: mutation.mutate,
    reset: mutation.reset,
  };
}
