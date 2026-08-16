import {
  ArrowLeft02Icon,
  ArrowRight02Icon,
  Image01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
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
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
  const resolvedGalleryIndex = Math.min(
    activeGalleryIndex,
    Math.max(galleryUrls.length - 1, 0),
  );
  const activeGalleryUrl = galleryUrls[resolvedGalleryIndex];
  const hasMultipleGalleryImages = galleryUrls.length > 1;
  const stackedGalleryUrl = hasMultipleGalleryImages
    ? galleryUrls[(resolvedGalleryIndex + 1) % galleryUrls.length]
    : null;
  const showPreviousGalleryImage = () => {
    setActiveGalleryIndex(
      (currentIndex) =>
        (currentIndex - 1 + galleryUrls.length) % galleryUrls.length,
    );
  };
  const showNextGalleryImage = () => {
    setActiveGalleryIndex(
      (currentIndex) => (currentIndex + 1) % galleryUrls.length,
    );
  };

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
          {activeGalleryUrl ? (
            <div className="profile-company-media__gallery">
              {stackedGalleryUrl ? (
                <img
                  alt=""
                  aria-hidden="true"
                  className="profile-company-media__gallery-image profile-company-media__gallery-image--stacked"
                  src={stackedGalleryUrl}
                />
              ) : null}
              <img
                alt={t("profile.media.galleryAlt", {
                  index: resolvedGalleryIndex + 1,
                })}
                className="profile-company-media__gallery-image profile-company-media__gallery-image--active"
                key={activeGalleryUrl}
                src={activeGalleryUrl}
              />
              <div
                aria-hidden="true"
                className="profile-company-media__gallery-preload"
              >
                {galleryUrls.map((url) => (
                  <img alt="" key={url} src={url} />
                ))}
              </div>
              {hasMultipleGalleryImages ? (
                <div className="profile-company-media__gallery-controls">
                  <button
                    aria-label={t("profile.media.previousImage")}
                    className="profile-company-media__gallery-nav profile-company-media__gallery-nav--previous"
                    onClick={showPreviousGalleryImage}
                    type="button"
                  >
                    <HugeiconsIcon
                      aria-hidden="true"
                      icon={ArrowLeft02Icon}
                      size={16}
                      strokeWidth={2}
                    />
                  </button>
                  <button
                    aria-label={t("profile.media.nextImage")}
                    className="profile-company-media__gallery-nav profile-company-media__gallery-nav--next"
                    onClick={showNextGalleryImage}
                    type="button"
                  >
                    <HugeiconsIcon
                      aria-hidden="true"
                      icon={ArrowRight02Icon}
                      size={16}
                      strokeWidth={2}
                    />
                  </button>
                </div>
              ) : null}
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
