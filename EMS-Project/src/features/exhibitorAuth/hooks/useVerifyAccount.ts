import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../../../store/AuthStore";
import { verifyEmailApi } from "../api/Authapi";
import { authKeys } from "../api/AuthKeys";
import { useTranslation } from "react-i18next";
import { getApiErrorMessage } from "../../../utils/apiError";

export function useVerifyAccount() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const login = useAuthStore((state) => state.login);

  const id = searchParams.get("id");
  const hash = searchParams.get("hash");
  const expires = searchParams.get("expires");
  const signature = searchParams.get("signature");

  const isLinkValidShape = Boolean(id && hash && expires && signature);

  const { data, isPending, isError, error } = useQuery({
    queryKey: authKeys.verification(id || "no-id", hash || "no-hash"),
    queryFn: () => {
      const cleanQuery = `?expires=${expires}&signature=${signature}`;
      return verifyEmailApi(id!, hash!, cleanQuery);
    },
    enabled: isLinkValidShape,
    retry: false,
  });

  const isSuccess =
    data?.status === true || data?.data?.user?.is_verified === true;
  const errorMessage = !isLinkValidShape
    ? t("checkEmail.invalidLink", "Invalid verification link. Security parameters missing.")
    : isError
      ? getApiErrorMessage(error, t("checkEmail.verifyFailed", "Verification failed."))
      : data && !data.status
        ? data.message
        : null;

  useEffect(() => {
    if (!isSuccess) {
      return;
    }

    if (data?.data?.user && data?.data?.token) {
      login(data.data.user, data.data.token);
    }

    const channel = new BroadcastChannel("AUTH_SUCCESS_CHANNEL");
    channel.postMessage({
      type: "SUCCESS",
      user: data?.data?.user,
      token: data?.data?.token,
    });
    channel.close();

    const killTimer = setTimeout(() => {
      window.open("", "_self");
      window.close();
    }, 3000);

    return () => clearTimeout(killTimer);
  }, [isSuccess, data, login]);

  return {
    isPending,
    isError: Boolean(!isLinkValidShape || isError || (data && !data.status)),
    isSuccess,
    errorMessage,
  };
}
