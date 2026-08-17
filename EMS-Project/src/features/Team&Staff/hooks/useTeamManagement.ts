import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import {
  getBoothLookupApi,
  inviteCompanyManagerApi,
  inviteBoothManagerApi,
} from "../api/teamApi";
import { getApiErrorMessage } from "../../../utils/apiError";
import { getCompanyLookup } from "../../ExhibitorProfile/api/ProfileApi";
import type { InvitePayload, LookupEntity, TeamMember } from "../types/teamsType";

export const teamKeys = {
  all: ["team-management"] as const,
  companies: () => [...teamKeys.all, "lookup-companies"] as const,
  booths: () => [...teamKeys.all, "lookup-booths"] as const,
};

export type RoleType = "company_manager" | "booth_manager" | null;

export function useTeamManagement() {
  const { t } = useTranslation();

  // Initialize role as null so no dropdown is shown initially
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<RoleType>(null);
  const [selectedEntityId, setSelectedEntityId] = useState<number | "">("");
  const [formError, setFormError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Lookup Queries
  const companiesQuery = useQuery({
    queryKey: teamKeys.companies(),
    queryFn: getCompanyLookup,
  });
  const boothsQuery = useQuery({
    queryKey: teamKeys.booths(),
    queryFn: getBoothLookupApi,
  });

  const isPageLoading = companiesQuery.isLoading || boothsQuery.isLoading;
  const isPageError = companiesQuery.isError || boothsQuery.isError;

  const handleRefetch = () => {
    companiesQuery.refetch();
    boothsQuery.refetch();
  };

  const inviteMutation = useMutation({
    mutationFn: async (payload: InvitePayload) => {
      if (!selectedEntityId)
        throw new Error(
          t("team.validation.entityRequired", "Please select a target entity."),
        );
      if (role === "company_manager") {
        return inviteCompanyManagerApi(Number(selectedEntityId), payload);
      } else {
        return inviteBoothManagerApi(Number(selectedEntityId), payload);
      }
    },
    onSuccess: () => {
      setEmail("");
      setSelectedEntityId("");
      setRole(null);
      setFormError(null);
      setSuccessMsg(t("team.inviteSuccess", "Invitation sent successfully!"));
      setTimeout(() => setSuccessMsg(null), 4000);
    },
    onError: (error: unknown) => {
      setFormError(
        getApiErrorMessage(
          error,
          t("team.inviteError", "Failed to send invitation."),
        ),
      );
      setSuccessMsg(null);
    },
  });

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSuccessMsg(null);

    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setFormError(
        t("team.invalidEmail", "Please enter a valid email address."),
      );
      return;
    }

    if (!role) {
      setFormError(t("team.roleRequired", "Please select a role first."));
      return;
    }

    if (!selectedEntityId) {
      setFormError(
        t("team.entityRequired", "Please select a specific booth or company."),
      );
      return;
    }

    inviteMutation.mutate({ email: email.trim() });
  };

  const handleRoleChange = (newRole: RoleType) => {
    setRole(newRole);
    setSelectedEntityId("");
  };
  const companiesList: LookupEntity[] =
    (companiesQuery.data as { data?: LookupEntity[] } | undefined)?.data ||
    (Array.isArray(companiesQuery.data) ? companiesQuery.data : []);
  const boothsList: LookupEntity[] = boothsQuery.data || [];
  const membersList: TeamMember[] = [];

  return {
    members: membersList,
    companies: companiesList,
    booths: boothsList,
    isPageLoading,
    isPageError,
    handleRefetch,
    email,
    setEmail,
    role,
    handleRoleChange,
    selectedEntityId,
    setSelectedEntityId,
    formError,
    successMsg,
    isInviting: inviteMutation.isPending,
    handleInviteSubmit,
    t,
  };
}
