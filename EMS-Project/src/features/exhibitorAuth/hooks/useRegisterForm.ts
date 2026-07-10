import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import {
  validateRegisterForm,
  type RegisterErrors,
} from "../utils/authValidation";
import { useAuthStore } from "../../../store/AuthStore";
import {
  registerApi,
  type RegisterPayload,
  type AuthResponse,
} from "../api/Authapi";

export function useRegisterForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);

  const registerMutation = useMutation({
    mutationFn: (payload: RegisterPayload) => registerApi(payload),
    onSuccess: (response: AuthResponse) => {
      if (response.status) {
        const validToken = response.data.token || response.data.access_token;

        if (validToken) {
          login(response.data.user, validToken);
          navigate("/check-email", { replace: true });
        } else {
          setApiError("No token received from server.");
        }
      } else {
        setApiError(response.message || "Registration Failed.");
      }
    },
    onError: (error: any) => {
      setApiError(
        error.response?.data?.message ||
          "An error occurred during registration.",
      );
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    const { isValid, errors: valErrors } = validateRegisterForm(
      { fullName, email, password, confirmPassword },
      t,
    );

    if (!isValid) {
      setErrors(valErrors);
      return;
    }

    registerMutation.mutate({ name: fullName, email, password });
  };

  return {
    fullName,
    setFullName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    errors,
    setErrors,
    isLoading: registerMutation.isPending,
    apiError,
    setApiError,
    handleSubmit,
    t,
  };
}
