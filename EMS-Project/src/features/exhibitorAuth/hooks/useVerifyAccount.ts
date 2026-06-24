import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../../../store/AuthStore";
import { verifyEmailApi } from "../api/Authapi";
import { authKeys } from "../api/authKeys";

export function useVerifyAccount() {
  const [searchParams] = useSearchParams();
  const login = useAuthStore((state) => state.login);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

  useEffect(() => {
    if (!isLinkValidShape) {
      setErrorMessage(
        "Invalid verification link. Security parameters missing.",
      );
      return;
    }

    if (isSuccess) {
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
    } else if (isError) {
      const axiosErr = error as any;
      setErrorMessage(
        axiosErr?.response?.data?.message || "Verification failed.",
      );
    }
  }, [isSuccess, data, isError, error, isLinkValidShape, login]);

  return {
    isPending,
    isError: !isLinkValidShape || isError || (data && !data.status),
    isSuccess,
  };
}
