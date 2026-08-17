import type { useTeamManagement } from "../hooks/useTeamManagement";
import type { LookupEntity } from "../types/teamsType";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Store01Icon,
  UserMultipleIcon,
  SentIcon,
  Mail01Icon,
} from "@hugeicons/core-free-icons";
import "./InviteMemberForm.scss";

type InviteProps = ReturnType<typeof useTeamManagement>;

export default function InviteMemberForm({
  email,
  setEmail,
  role,
  handleRoleChange,
  selectedEntityId,
  setSelectedEntityId,
  companies,
  booths,
  formError,
  successMsg,
  isInviting,
  handleInviteSubmit,
  t,
}: InviteProps) {
  return (
    <div className="card invite-card">
      <h2>{t("team.form.title", "Invite a Team Member")}</h2>

      <form onSubmit={handleInviteSubmit} className="invite-form">
        {formError && <div className="error-banner">{formError}</div>}
        {successMsg && <div className="success-banner">{successMsg}</div>}

        <div className="input-group">
          <label htmlFor="invite-email">
            {t("team.form.emailLabel", "Email Address")}
          </label>
          <div className="input-with-icon">
            <span className="icon">
              {/* Forced gray icon color */}
              <HugeiconsIcon icon={Mail01Icon} size={20} color="#9ca3af" />
            </span>
            <input
              id="invite-email"
              type="email"
              placeholder={t(
                "team.form.emailPlaceholder",
                "colleague@company.com",
              )}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isInviting}
              required
            />
          </div>
        </div>

        <div className="input-group">
          <label>{t("team.form.roleLabel", "ROLE")}</label>
          <div className="role-selector">
            <button
              type="button"
              className={`role-btn ${role === "booth_manager" ? "active" : ""}`}
              onClick={() => handleRoleChange("booth_manager")}
            >
              <HugeiconsIcon icon={Store01Icon} size={24} />
              <span className="role-title">
                {t("team.roles.boothManager", "Booth Manager")}
              </span>
              <span className="role-desc">
                {t("team.roles.boothDesc", "Manages a specific booth")}
              </span>
            </button>
            <button
              type="button"
              className={`role-btn ${role === "company_manager" ? "active" : ""}`}
              onClick={() => handleRoleChange("company_manager")}
            >
              <HugeiconsIcon icon={UserMultipleIcon} size={24} />
              <span className="role-title">
                {t("team.roles.companyManager", "Company Manager")}
              </span>
              <span className="role-desc">
                {t("team.roles.companyDesc", "Full company-wide access")}
              </span>
            </button>
          </div>
        </div>

        {/* Conditionally rendered ONLY if Booth Manager is selected */}
        {role === "booth_manager" && (
          <div className="input-group slide-down">
            <label htmlFor="booth-select">
              {t("team.form.assignBooth", "ASSIGN TO BOOTH")}
            </label>
            <select
              id="booth-select"
              value={selectedEntityId}
              onChange={(e) => setSelectedEntityId(Number(e.target.value))}
              disabled={isInviting}
              required
            >
              <option value="" disabled>
                {t("team.form.selectBooth", "Select a booth...")}
              </option>
              {booths.map((b: LookupEntity) => (
                <option key={b.id} value={b.id}>
                  {b.label ||
                    b.name ||
                    (b.number
                      ? `${t("team.form.boothLabel", "Booth")} #${b.number}`
                      : `${t("team.form.boothLabel", "Booth")} #${b.id}`)}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Conditionally rendered ONLY if Company Manager is selected */}
        {role === "company_manager" && (
          <div className="input-group slide-down">
            <label htmlFor="company-select">
              {t("team.form.assignCompany", "ASSIGN TO COMPANY")}
            </label>
            <select
              id="company-select"
              value={selectedEntityId}
              onChange={(e) => setSelectedEntityId(Number(e.target.value))}
              disabled={isInviting}
              required
            >
              <option value="" disabled>
                {t("team.form.selectCompany", "Select a company...")}
              </option>
              {companies.map((c: LookupEntity) => (
                <option key={c.id} value={c.id}>
                  {c.label || c.name || `Company #${c.id}`}
                </option>
              ))}
            </select>
          </div>
        )}

        <button
          type="submit"
          className="primary-btn submit-btn"
          disabled={isInviting || !role}
        >
          <HugeiconsIcon icon={SentIcon} size={20} />
          {isInviting
            ? t("team.form.sending", "Sending...")
            : t("team.form.submitBtn", "Send Invitation")}
        </button>
      </form>
    </div>
  );
}
