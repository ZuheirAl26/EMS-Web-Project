import { Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTranslation } from "react-i18next";
import type { ProfileSidebarCardProps } from "../../types/profileType";
import { getInitials, resolveMediaUrl } from "../../utils/profileUtils";
import { ActiveCompanySelector } from "../ActiveCompanySelector/ActiveCompanySelector";
import "./ProfileSidebarCard.scss";
import { useState } from "react";
import { ImageLightbox } from "../../../../components/ImageLightbox/ImageLightbox";

export function ProfileSidebarCard({
  boothSummary,
  companies,
  company,
  exhibitor,
  onCompanyChange,
  selectedCompanyId,
}: ProfileSidebarCardProps) {
  const { t, i18n } = useTranslation("dashboard");
  const [isAvatarOpen, setIsAvatarOpen] = useState(false);
  const avatarUrl = resolveMediaUrl(exhibitor.avatar);
  const logoUrl = resolveMediaUrl(company?.logo ?? null);
  const numberFormatter = new Intl.NumberFormat(
    i18n.language.startsWith("ar") ? "ar-SY" : "en-US",
    { maximumFractionDigits: 2 },
  );
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "approved":
        return t("profile.status.approved");
      case "pending":
        return t("profile.status.pending");
      case "rejected":
        return t("profile.status.rejected");
      default:
        return status;
    }
  };

  return (
    <aside className="profile-sidebar-card">
      <div className="profile-sidebar-card__identity">
        <div className="profile-sidebar-card__banner" />
        {avatarUrl ? (
          <button
            aria-label={t("profile.viewAvatar", { name: exhibitor.name })}
            className="profile-sidebar-card__avatar"
            onClick={() => setIsAvatarOpen(true)}
            type="button"
          >
            <img
              alt={t("profile.avatarAlt", { name: exhibitor.name })}
              src={avatarUrl}
            />
          </button>
        ) : (
          <div className="profile-sidebar-card__avatar">
            <span aria-hidden="true">{getInitials(exhibitor.name)}</span>
          </div>
        )}
        <h2>{exhibitor.name}</h2>
        <p>{t("profile.role")}</p>
        <strong>{company?.name || t("profile.noCompany")}</strong>
        {company ? (
          <span className="profile-sidebar-card__status">
            {company.status === "approved" ? (
              <HugeiconsIcon
                aria-hidden="true"
                color="currentColor"
                icon={Tick02Icon}
                size={12}
                strokeWidth={2}
              />
            ) : null}
            {getStatusLabel(company.status)}
          </span>
        ) : null}
        {boothSummary.hallNumber && boothSummary.boothNumber ? (
          <small>
            {t("profile.boothLocation", {
              booth: boothSummary.boothNumber,
              hall: boothSummary.hallNumber,
            })}
          </small>
        ) : null}
      </div>

      <ActiveCompanySelector
        activeCompany={company}
        companies={companies}
        onCompanyChange={onCompanyChange}
        selectedCompanyId={selectedCompanyId}
      />

      <section className="profile-sidebar-card__logo">
        <h3>{t("profile.companyLogo")}</h3>
        <div>
          {logoUrl ? (
            <img
              alt={t("profile.companyLogoAlt", { name: company?.name })}
              src={logoUrl}
            />
          ) : (
            <span aria-hidden="true">
              {getInitials(company?.name || t("profile.noCompany"))}
            </span>
          )}
        </div>
      </section>

      <dl className="profile-sidebar-card__summary">
        <div>
          <dt>{t("profile.summary.yearFounded")}</dt>
          <dd>{company?.year_founded || "—"}</dd>
        </div>
        <div>
          <dt>{t("profile.summary.boothArea")}</dt>
          <dd>
            {t("profile.areaValue", {
              area: numberFormatter.format(boothSummary.totalArea),
            })}
          </dd>
        </div>
        <div>
          <dt>{t("profile.summary.booths")}</dt>
          <dd>{boothSummary.count}</dd>
        </div>
      </dl>
      <ImageLightbox
        alt={t("profile.avatarAlt", { name: exhibitor.name })}
        onClose={() => setIsAvatarOpen(false)}
        open={isAvatarOpen}
        src={avatarUrl}
      />
    </aside>
  );
}
