import { useState } from "react";
import type { useTeamManagement } from "../hooks/useTeamManagement";
import type { LookupEntity, TeamInvitation } from "../types/teamsType";
import { HugeiconsIcon } from "@hugeicons/react";
import { UserGroupIcon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { CustomSelect } from "../../../components";
import type { SelectOption } from "../../../components/CustomSelect/CustomSelect";
import { CancelInvitationDialog } from "./CancelInvitationDialog";
import "./CurrentTeamList.scss";

type TeamListProps = ReturnType<typeof useTeamManagement>;

export default function CurrentTeamList({
  invitations,
  isInvitationsLoading,
  booths,
  companies,
  role,
  selectedScopeKey,
  setSelectedScopeKey,
  handleDeleteInvitation,
  isDeletingInvitation,
  t,
}: TeamListProps) {
  const [invitationToDelete, setInvitationToDelete] =
    useState<TeamInvitation | null>(null);

  const isCompanyRole = role === "company_manager";

  const scopeOptions: SelectOption<string>[] = isCompanyRole
    ? companies.map((c: LookupEntity) => ({
        value: `company:${c.id}`,
        label: c.label || c.name || `Company #${c.id}`,
      }))
    : booths.map((b: LookupEntity) => ({
        value: `booth:${b.id}`,
        label:
          b.label ||
          b.name ||
          (b.number ? `${t("team.form.boothLabel", "Booth")} #${b.number}` : `Booth #${b.id}`),
      }));

  const invitationList: TeamInvitation[] = Array.isArray(invitations)
    ? invitations
    : Array.isArray(
        (invitations as unknown as { data?: TeamInvitation[] })?.data,
      )
    ? (invitations as unknown as { data: TeamInvitation[] }).data
    : [];

  const getInitials = (name?: string, email?: string) => {
    const text = name || email || "?";
    return text.substring(0, 2).toUpperCase();
  };

  const capitalize = (str?: string) => {
    if (!str) return "";
    const formatted = str.replace(/_/g, " ");
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  };

  return (
    <>
      <div className="card team-list-card">
        <div className="card-header">
          <h2>
            {t("team.list.title", "Current Team ({{count}})", {
              count: invitationList.length,
            })}
          </h2>
          {scopeOptions.length > 0 && (
            <div className="scope-select-wrapper">
              <CustomSelect<string>
                options={scopeOptions}
                value={selectedScopeKey}
                onChange={(val) => setSelectedScopeKey(val)}
                placeholder={t("team.list.selectCategory", "Select scope...")}
              />
            </div>
          )}
        </div>

        <div className="members-list">
          {isInvitationsLoading ? (
            <div className="loading-state">
              <p>{t("team.list.loading", "Loading invitations...")}</p>
            </div>
          ) : invitationList.length === 0 ? (
            <div className="empty-state">
              <HugeiconsIcon
                icon={UserGroupIcon}
                size={42}
                strokeWidth={1.5}
                className="empty-icon"
              />
              <p>{t("team.list.empty", "No team members invited yet.")}</p>
            </div>
          ) : (
            invitationList.map((item: TeamInvitation) => {
              const isPending =
                item.status?.toLowerCase() === "pending" || !item.status;
              const displayName = item.name || item.sender?.name;
              const roleText = capitalize(item.role || item.type);
              const statusText = capitalize(item.status || "pending");

              return (
                <div key={item.id} className="member-row">
                  <div className="member-info">
                    <div className="avatar">
                      {item.initials || getInitials(displayName, item.email)}
                    </div>
                    <div className="details">
                      {displayName && <span className="name">{displayName}</span>}
                      <span className="email">{item.email}</span>
                    </div>
                  </div>

                  <div className="member-meta">
                    {roleText && <span className="role">{roleText}</span>}

                    <span
                      className={`status-badge status-${(
                        item.status || "pending"
                      ).toLowerCase()}`}
                    >
                      {item.status?.toLowerCase() === "rejected"
                        ? "⊗ "
                        : isPending
                        ? "⏱ "
                        : "✓ "}
                      {statusText}
                    </span>

                    {isPending && (
                      <button
                        type="button"
                        className="action-btn cancel-btn"
                        title={t("team.list.cancelInvitation", "Decline / Cancel Invitation")}
                        onClick={() => setInvitationToDelete(item)}
                        disabled={isDeletingInvitation}
                      >
                        <HugeiconsIcon icon={Cancel01Icon} size={16} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <CancelInvitationDialog
        invitation={invitationToDelete}
        isPending={isDeletingInvitation}
        onCancel={() => setInvitationToDelete(null)}
        onConfirm={() => {
          if (invitationToDelete) {
            const token =
              invitationToDelete.invitation ||
              invitationToDelete.token ||
              invitationToDelete.invitation_token ||
              invitationToDelete.code ||
              invitationToDelete.uuid ||
              String(invitationToDelete.id);

            handleDeleteInvitation(token);
            setInvitationToDelete(null);
          }
        }}
        open={Boolean(invitationToDelete)}
      />
    </>
  );
}
