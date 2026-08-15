import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { boothKeys } from "../api/BoothKeys";
import { myBoothsKeys } from "../../MyBooths/api/MyBoothsKeys";
import { requestBooth } from "../api/RequestBoothApi";
import { useCreatePlanStore } from "../store/useCreatePlanStore";
import type { RequestBoothDraft } from "../types/requestBoothType";
import { buildRequestBoothPayload } from "../utils/requestBoothPayload";
import { getApiErrorMessage } from "../../../utils/apiError";

export function useRequestBooth() {
  const { t } = useTranslation("createBoothPlan");
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const resetDraft = useCreatePlanStore((state) => state.resetDraft);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async (draft: RequestBoothDraft) => {
      const payload = await buildRequestBoothPayload(draft);
      return requestBooth(payload);
    },
    onMutate: () => {
      setErrorMessage(null);
    },
    onSuccess: (data) => {
      resetDraft();
      navigate("/dashboard/booths", {
        replace: true,
        state: {
          requestMessage: data.message || t("review.success"),
        },
      });
    },
    onError: (error: unknown) => {
      setErrorMessage(
        getApiErrorMessage(error, t("review.errors.submit")),
      );
    },
    onSettled: () => {
      void Promise.all([
        queryClient.invalidateQueries({ queryKey: boothKeys.all }),
        queryClient.invalidateQueries({ queryKey: myBoothsKeys.all }),
      ]);
    },

  });

  return {
    errorMessage,
    isPending: mutation.isPending,
    submit: mutation.mutate,
  };
}
