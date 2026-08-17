import { useTeamManagement } from "../hooks/useTeamManagement";
import InviteMemberForm from "../components/InviteMemberForm";
import CurrentTeamList from "../components/CurrentTeamList";
import TeamSkeleton from "../components/TeamSkeleton";
import { HugeiconsIcon } from "@hugeicons/react";
import { Alert01Icon, Refresh01Icon } from "@hugeicons/core-free-icons";
import "./TeamPage.scss";

export default function TeamPage() {
  const hookState = useTeamManagement();
  const { t, isPageLoading, isPageError, handleRefetch } = hookState;

  if (isPageLoading) return <TeamSkeleton />;

  if (isPageError) {
    return (
      <div className="team-page-layout">
        <div className="error-state-card">
          <HugeiconsIcon icon={Alert01Icon} size={48} className="error-icon" />
          <h2>{t("team.error.title", "Failed to Load Target Data")}</h2>
          <p>
            {t(
              "team.error.desc",
              "We couldn't fetch your booths and companies. Please verify your connection.",
            )}
          </p>
          <button
            className="primary-btn mt-3 retry-btn"
            onClick={handleRefetch}
          >
            <HugeiconsIcon icon={Refresh01Icon} size={18} />
            {t("common.retry", "Retry Connection")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="team-page-layout">
      <header className="page-header">
        <h1>{t("team.title", "Team & Staff")}</h1>
        <p className="subtitle">
          {t(
            "team.subtitle",
            "Invite colleagues to co-manage your pavilion with the same dashboard access.",
          )}
        </p>
      </header>

      <div className="team-content-grid">
        <InviteMemberForm {...hookState} />
        <CurrentTeamList {...hookState} />
      </div>
    </div>
  );
}
