import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  validateRegisterForm,
  type RegisterErrors,
} from "../utils/authValidation";
import { useAuthStore } from "../../../store/AuthStore";
import { registerApi } from "../api/Authapi";

export function useRegisterForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<RegisterErrors>({});

  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    const { isValid, errors: validationErrors } = validateRegisterForm(
      { fullName, email, password, confirmPassword },
      t,
    );

    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        name: fullName,
        email: email,
        password: password,
      };

      const response = await registerApi(payload);

      if (response.status) {
        login(response.data.user, response.data.token);
        console.log("Success", response.data.user);
        navigate("/check-email", { replace: true });
      } else {
        setApiError(response.message || "Registration Failed.");
      }
    } catch (error: any) {
      console.log("Faild");
      setApiError(
        error.response?.data?.message ||
          "An error occurred during registration. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
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
    isLoading,
    apiError,
    setApiError,
    handleSubmit,
    t,
  };
}
