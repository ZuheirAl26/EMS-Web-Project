import type { useTeamManagement } from "../hooks/useTeamManagement";
import type { TeamMember } from "../types/teamsType";
import { HugeiconsIcon } from "@hugeicons/react";
import { UserGroupIcon } from "@hugeicons/core-free-icons";
import "./CurrentTeamList.scss";

type TeamListProps = ReturnType<typeof useTeamManagement>;

export default function CurrentTeamList({ members, t }: TeamListProps) {
  return (
    <div className="card team-list-card">
      <div className="card-header">
        <h2>
          {t("team.list.title", "Current Team ({{count}})", {
            count: members.length,
          })}
        </h2>
      </div>

      <div className="members-list">
        {members.length === 0 ? (
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
          members.map((member: TeamMember) => (
            <div key={member.id} className="member-row">
              <div className="member-info">
                <div className="avatar">{member.initials}</div>
                <div className="details">
                  <span className="name">{member.name}</span>
                  <span className="email">{member.email}</span>
                </div>
              </div>
              <div className="member-meta">
                <span className="role">{member.role}</span>
                {member.status !== "Active" && (
                  <span
                    className={`status-badge status-${member.status.toLowerCase()}`}
                  >
                    {member.status === "Rejected" ? "⊗ " : "⏱ "}
                    {member.status}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
