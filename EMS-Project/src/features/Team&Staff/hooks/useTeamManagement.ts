import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import {
  getBoothLookupApi,
  getCompanyInvitationsApi,
  getBoothInvitationsApi,
  inviteCompanyManagerApi,
  inviteBoothManagerApi,
  deleteInvitationApi,
} from "../api/teamApi";
import { getApiErrorMessage } from "../../../utils/apiError";
import { getCompanyLookup } from "../../ExhibitorProfile/api/ProfileApi";
import type {
  InvitePayload,
  LookupEntity,
  TeamInvitation,
} from "../types/teamsType";

export const teamKeys = {
  all: ["team-management"] as const,
  companies: () => [...teamKeys.all, "lookup-companies"] as const,
  booths: () => [...teamKeys.all, "lookup-booths"] as const,
  invitations: (type?: string, id?: number) =>
    [...teamKeys.all, "invitations", type, id] as const,
};

export type RoleType = "company_manager" | "booth_manager" | null;

export function useTeamManagement() {
  const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [role, setRole] = useState<RoleType>("booth_manager");
  const [selectedEntityId, setSelectedEntityId] = useState<number | "">("");
  const [selectedScopeKey, setSelectedScopeKey] = useState<string>("");
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

  const companiesList: LookupEntity[] = useMemo(
    () =>
      (companiesQuery.data as { data?: LookupEntity[] } | undefined)?.data ||
      (Array.isArray(companiesQuery.data) ? companiesQuery.data : []),
    [companiesQuery.data],
  );
  const boothsList: LookupEntity[] = useMemo(
    () => boothsQuery.data || [],
    [boothsQuery.data],
  );

  const defaultScopeKey = useMemo(() => {
    if (boothsList.length > 0) return `booth:${boothsList[0].id}`;
    if (companiesList.length > 0) return `company:${companiesList[0].id}`;
    return "";
  }, [boothsList, companiesList]);

  const activeScopeKey = selectedScopeKey || defaultScopeKey;

  // Parse scope key (e.g. "booth:83" or "company:1")
  const parsedScope = useMemo(() => {
    if (!activeScopeKey) return null;
    const [type, idStr] = activeScopeKey.split(":");
    const id = Number(idStr);
    if (!id || (type !== "booth" && type !== "company")) return null;
    return { type: type as "booth" | "company", id };
  }, [activeScopeKey]);

  // Fetch Invitations query
  const invitationsQuery = useQuery({
    queryKey: teamKeys.invitations(parsedScope?.type, parsedScope?.id),
    queryFn: async () => {
      if (!parsedScope?.id) return [];
      if (parsedScope.type === "company") {
        return getCompanyInvitationsApi(parsedScope.id);
      } else {
        return getBoothInvitationsApi(parsedScope.id);
      }
    },
    enabled: Boolean(parsedScope?.id),
  });

  const isPageLoading = companiesQuery.isLoading || boothsQuery.isLoading;
  const isPageError = companiesQuery.isError || boothsQuery.isError;

  const handleRefetch = () => {
    companiesQuery.refetch();
    boothsQuery.refetch();
    invitationsQuery.refetch();
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
      setRole("booth_manager");
      setFormError(null);
      setSuccessMsg(t("team.inviteSuccess", "Invitation sent successfully!"));
      invitationsQuery.refetch();
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

  const deleteMutation = useMutation({
    mutationFn: (invitation: string | number) =>
      deleteInvitationApi(invitation),
    onSuccess: () => {
      invitationsQuery.refetch();
      setFormError(null);
      setSuccessMsg(t("team.deleteSuccess", "Invitation canceled."));
      setTimeout(() => setSuccessMsg(null), 3000);
    },
    onError: (error: unknown) => {
      setFormError(
        getApiErrorMessage(
          error,
          t("team.deleteError", "Failed to cancel invitation."),
        ),
      );
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
    if (newRole === "booth_manager" && boothsList.length > 0) {
      setSelectedScopeKey(`booth:${boothsList[0].id}`);
    } else if (newRole === "company_manager" && companiesList.length > 0) {
      setSelectedScopeKey(`company:${companiesList[0].id}`);
    }
  };

  const handleSelectEntityChange = (id: number | "") => {
    setSelectedEntityId(id);
    if (id) {
      const type = role === "company_manager" ? "company" : "booth";
      setSelectedScopeKey(`${type}:${id}`);
    }
  };

  const handleDeleteInvitation = (invitation: string | number) => {
    deleteMutation.mutate(invitation);
  };

  const rawInvitations = invitationsQuery.data;
  const invitations: TeamInvitation[] = Array.isArray(rawInvitations)
    ? rawInvitations
    : Array.isArray(
        (rawInvitations as unknown as { data?: TeamInvitation[] })?.data,
      )
    ? (rawInvitations as unknown as { data: TeamInvitation[] }).data
    : [];

  return {
    invitations,
    isInvitationsLoading: invitationsQuery.isLoading,
    companies: companiesList,
    booths: boothsList,
    selectedScopeKey: activeScopeKey,
    setSelectedScopeKey,
    isPageLoading,
    isPageError,
    handleRefetch,
    email,
    setEmail,
    role,
    handleRoleChange,
    selectedEntityId,
    setSelectedEntityId: handleSelectEntityChange,
    formError,
    successMsg,
    isInviting: inviteMutation.isPending,
    isDeletingInvitation: deleteMutation.isPending,
    handleInviteSubmit,
    handleDeleteInvitation,
    t,
  };
}
