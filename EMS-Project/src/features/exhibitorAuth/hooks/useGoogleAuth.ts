import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { useAuthStore } from "../../../store/AuthStore";
import { googleAuthApi } from "../api/Authapi";
import type {
  AuthResponse,
  GoogleAuthPayload,
} from "../types/authType";
import { getApiErrorMessage } from "../utils/apiError";

export function useGoogleAuth() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const mutation = useMutation<AuthResponse, Error, GoogleAuthPayload>({
    mutationKey: ["auth", "google"],
    mutationFn: googleAuthApi,
    onSuccess: (response) => {
      if (response.status && response.data) {
        const validToken = response.data.access_token || response.data.token;

        if (validToken) {
          login(response.data.user, validToken);
          navigate("/dashboard", { replace: true });
        }
      }
    },
    onError: (error) => {
      console.error("Google Auth System Exception:", error);
    },
  });

  const triggerGooglePopup = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      mutation.mutate({ token: tokenResponse.access_token });
      console.log(tokenResponse);
    },
    onError: () => {
      console.error("Google OAuth popup closed or failed.");
    },
  });

  return {
    triggerGoogleFlow: triggerGooglePopup,
    isGoogleLoading: mutation.isPending,
    isGoogleError: mutation.isError,
    googleErrorMessage: mutation.error
      ? getApiErrorMessage(mutation.error, mutation.error.message)
      : null,
  };
}
