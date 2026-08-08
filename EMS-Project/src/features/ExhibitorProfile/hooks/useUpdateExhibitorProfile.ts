import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { updateExhibitorProfile } from "../api/ProfileApi";
import { profileKeys } from "../api/ProfileKeys";
import type {
  ExhibitorProfileResponse,
  UpdateExhibitorProfilePayload,
} from "../types/profileType";
import { getApiErrorMessage } from "../../../utils/apiError";
import { writeCachedExhibitorProfile } from "../utils/profileCache";

export function useUpdateExhibitorProfile(onSuccess?: () => void) {
  const { t } = useTranslation("dashboard");
  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (payload: UpdateExhibitorProfilePayload) =>
      updateExhibitorProfile(payload),

    onMutate: async (payload: UpdateExhibitorProfilePayload) => {
      setErrorMessage(null);

      await queryClient.cancelQueries({ queryKey: profileKeys.exhibitor });

      const previous = queryClient.getQueryData<ExhibitorProfileResponse>(
        profileKeys.exhibitor,
      );

      if (previous) {
        queryClient.setQueryData<ExhibitorProfileResponse>(
          profileKeys.exhibitor,
          {
            ...previous,
            data: {
              ...previous.data,
              name: payload.name,
              avatar: payload.avatarPreviewUrl ?? previous.data.avatar,
            },
          },
        );
      }

      // TypeScript infers TContext from this return shape — no explicit type needed.
      return { previous };
    },

    onError: (error, _payload, context) => {
      if (context?.previous) {
        queryClient.setQueryData(profileKeys.exhibitor, context.previous);
      }
      setErrorMessage(getApiErrorMessage(error, t("profile.edit.errorMsg")));
    },

    onSuccess: (response) => {
      queryClient.setQueryData(profileKeys.exhibitor, response);
      writeCachedExhibitorProfile(response.data);
      onSuccess?.();
    },
  });

  return {
    errorMessage,
    isPending: mutation.isPending,
    submit: mutation.mutate,
    reset: mutation.reset,
  };
}
