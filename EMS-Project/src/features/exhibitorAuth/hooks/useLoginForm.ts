import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../store/AuthStore";
import { useState } from "react";
import { validateLoginForm } from "../utils/authValidation";
import { loginApi } from "../api/Authapi";

export function useLoginForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );

  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
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

    setIsLoading(true);
    try {
      const response = await loginApi({ email, password });

      if (response.status) {
        login(response.data.user, response.data.token);
        console.log("Success!", response.data.user, response.data.token);

        if (response.data.user.is_verified === false) {
          navigate("/check-email", { replace: true });
        } else {
          navigate("/dashboard", { replace: true });
        }
      } else {
        setApiError(response.message || "Login failed.");
      }
    } catch (error: any) {
      setApiError(
        error.response?.data?.message ||
          "An error occurred during login. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    errors,
    setErrors,
    isLoading,
    apiError,
    setApiError,
    handleSubmit,
    t,
  };
}
