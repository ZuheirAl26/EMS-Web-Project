import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../../../store/AuthStore";
import { validateLoginForm } from "../utils/authValidation";
import { loginApi, type AuthResponse, type LoginPayload } from "../api/Authapi";

export function useLoginForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );
  const [apiError, setApiError] = useState<string | null>(null);

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginPayload) => loginApi(credentials),
    onSuccess: (response: AuthResponse) => {
      if (response.status) {
        login(response.data.user, response.data.token);

        if (!response.data.user.is_verified) {
          navigate("/check-email", { replace: true });
        } else {
          navigate("/dashboard", { replace: true });
        }
      } else {
        setApiError(response.message);
      }
    },
    onError: (error: any) => {
      setApiError(error.response?.data?.message);
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
    setApiError,
    handleSubmit,
    t,
  };
}
