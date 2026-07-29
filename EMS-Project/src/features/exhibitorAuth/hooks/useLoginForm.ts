import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../../../store/AuthStore";
import { loginApi } from "../api/Authapi";
import type {
  AuthResponse,
  LoginPayload,
} from "../types/authType";
import type { LoginErrors } from "../types/validationType";
import { getApiErrorMessage } from "../utils/apiError";
import { validateLoginForm } from "../utils/validation";

export function useLoginForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<LoginErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginPayload) => loginApi(credentials),
    onMutate: () => {},
    onSuccess: (response: AuthResponse) => {
      if (response.status && response.data) {
        const receivedToken = response.data.token || response.data.access_token;
        if (!receivedToken) {
          setApiError(
            "System Error: No authorization token recived from the server",
          );
          return;
        }
        login(response.data.user, receivedToken);
        if (!response.data.user.is_verified) {
          navigate("/check-email", { replace: true });
        } else {
          navigate("/dashboard", { replace: true });
        }
      } else {
        setApiError(response.message || "Login failed.");
      }
    },
    onError: (error: unknown) => {
      setApiError(getApiErrorMessage(error, t("login.errorMsg")));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    const { isValid, errors: validationErrors } = validateLoginForm(
      { email, password },
      t,
    );
    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    loginMutation.mutate({ email, password });
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    errors,
    setErrors,
    isLoading: loginMutation.isPending,
    apiError,
    setApiError,
    handleSubmit,
    t,
  };
}
