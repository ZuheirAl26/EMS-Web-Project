import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { forgotPasswordApi } from "../../ExhibitorAuth/api/Authapi";
import { getApiErrorMessage } from "../../../utils/apiError";

export function useSendPasswordResetLink(email: string) {
  const { t } = useTranslation("dashboard");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: () => forgotPasswordApi({ email }),
    onMutate: () => {
      setErrorMessage(null);
    },
    onSuccess: (response) => {
      if (!response.status) {
        setErrorMessage(
          response.message || t("profile.edit.password.errorMsg"),
        );
      }
    },
    onError: (error: unknown) => {
      setErrorMessage(
        getApiErrorMessage(error, t("profile.edit.password.errorMsg")),
      );
    },
  });

  return {
    sendResetLink: () => mutation.mutate(),
    isPending: mutation.isPending,
    isSent: mutation.isSuccess && !errorMessage,
    errorMessage,
  };
}
