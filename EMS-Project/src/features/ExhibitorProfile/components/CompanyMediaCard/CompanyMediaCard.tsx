import { Image01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTranslation } from "react-i18next";
import type { CompanyMediaCardProps } from "../../types/profileType";
import {
  getGalleryUrls,
  getInitials,
  getMediaFilename,
  resolveMediaUrl,
} from "../../utils/profileUtils";
import "./CompanyMediaCard.scss";

export function CompanyMediaCard({ company }: CompanyMediaCardProps) {
  const { t } = useTranslation("dashboard");
  const logoUrl = resolveMediaUrl(company.logo);
  const galleryUrls = getGalleryUrls(company.gallery);

  return (
    <section className="profile-company-media">
      <h2>{t("profile.media.title")}</h2>
      <p>{t("profile.media.description")}</p>
      <div className="profile-company-media__grid">
        <article>
          <h3>{t("profile.media.logo")}</h3>
          <div className="profile-company-media__asset">
            {logoUrl ? (
              <img alt={t("profile.companyLogoAlt", { name: company.name })} src={logoUrl} />
            ) : (
              <span className="profile-company-media__initials" aria-hidden="true">
                {getInitials(company.name)}
              </span>
            )}
            <strong>{getMediaFilename(company.logo)}</strong>
          </div>
          <span className="profile-company-media__uploaded">
            <HugeiconsIcon
              aria-hidden="true"
              color="currentColor"
              icon={Tick02Icon}
              size={12}
              strokeWidth={2}
            />
            {logoUrl ? t("profile.media.uploaded") : t("profile.media.missing")}
          </span>
        </article>

        <article>
          <h3>{t("profile.media.gallery")}</h3>
          {galleryUrls.length > 0 ? (
            <div className="profile-company-media__gallery">
              {galleryUrls.map((url, index) => (
                <img
                  alt={t("profile.media.galleryAlt", { index: index + 1 })}
                  key={url}
                  src={url}
                />
              ))}
            </div>
          ) : (
            <div className="profile-company-media__empty">
              <span aria-hidden="true">
                <HugeiconsIcon
                  color="currentColor"
                  icon={Image01Icon}
                  size={20}
                  strokeWidth={1.8}
                />
              </span>
              <strong>{t("profile.media.noGallery")}</strong>
            </div>
          )}
        </article>
      </div>
    </section>
  );
}
