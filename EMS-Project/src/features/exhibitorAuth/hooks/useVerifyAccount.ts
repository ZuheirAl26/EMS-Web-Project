import { useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../store/AuthStore";
import { verifyEmailApi } from "../api/Authapi";

export function useVerifyAccount() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    "verifying",
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const hasAttempted = useRef(false);

  useEffect(() => {
    if (hasAttempted.current) return;
    hasAttempted.current = true;

    const id = searchParams.get("id");
    const hash = searchParams.get("hash");
    const expires = searchParams.get("expires");
    const signature = searchParams.get("signature");

    const confirmAccount = async () => {
      if (!id || !hash || !expires || !signature) {
        setStatus("error");
        setErrorMessage(
          "Invalid verification link. Security parameters are missing.",
        );
        return;
      }

      try {
        const cleanQuery = `?expires=${expires}&signature=${signature}`;
        const res = await verifyEmailApi(id, hash, cleanQuery);

        if (res.status === true || res.data?.user?.is_verified === true) {
          if (res.data?.user) {
            login(res.data.user, res.data.token);
          }

          setStatus("success");
        } else {
          setStatus("error");
          setErrorMessage(res.message || "Verification failed.");
        }
      } catch (err: any) {
        setStatus("error");
        setErrorMessage(
          err.response?.data?.message ||
            "This verification link has expired or is invalid.",
        );
      }
    };

    confirmAccount();
  }, [searchParams, navigate, login]);

  return { status, errorMessage };
}
