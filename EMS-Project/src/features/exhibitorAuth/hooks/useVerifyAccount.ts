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

  useEffect(() => {
    if (!isLinkValidShape) {
      setErrorMessage(
        "Invalid verification link. Security parameters missing.",
      );
      return;
    }

    if (data?.status === true || data?.data?.user?.is_verified === true) {
      if (data.data?.user) {
        login(data.data.user, data.data.token);
      }
    } else if (isError) {
      const axiosErr = error as any;
      setErrorMessage(
        axiosErr.response?.data?.message || "Verification failed.",
      );
    }
  }, [data, isError, error, isLinkValidShape, login]);

  let status: "verifying" | "success" | "error" = "verifying";
  if (!isLinkValidShape || isError || (data && !data.status)) status = "error";
  if (data?.status) status = "success";

  return {
    status: isPending ? "verifying" : status,
    errorMessage,
  };
}
