import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getInvitationDetailsApi,
  acceptInvitationApi,
} from "../api/teamApi";
import {
  registerInvitationApi,
  type RegisterInvitationPayload,
} from "../../ExhibitorAuth/api/Authapi";
import type { AuthResponse } from "../../ExhibitorAuth/types/authType";
import { teamKeys } from "./useTeamManagement";

export function useInvitationDetails(token: string) {
  return useQuery({
    queryKey: ["invitation-details", token],
    queryFn: () => getInvitationDetailsApi(token),
    enabled: Boolean(token),
    retry: 1,
    staleTime: 5000,
  });
}

export function useAcceptInvitation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (token: string) => acceptInvitationApi(token),
    onSuccess: (_, token) => {
      queryClient.invalidateQueries({ queryKey: ["invitation-details", token] });
      queryClient.invalidateQueries({ queryKey: teamKeys.all });
    },
  });
}



export function useRegisterInvitation() {
  return useMutation<
    AuthResponse,
    Error,
    { token: string; payload: RegisterInvitationPayload }
  >({
    mutationFn: ({ token, payload }) => registerInvitationApi(token, payload),
  });
}
