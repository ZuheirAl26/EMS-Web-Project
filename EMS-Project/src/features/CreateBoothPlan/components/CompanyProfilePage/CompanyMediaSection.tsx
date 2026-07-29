import { useTranslation } from "react-i18next";
import { useCreatePlanStore } from "../../store/useCreatePlanStore";
import type { CompanyMediaSectionProps } from "../../types/componentType";
import { MediaUpload } from "./MediaUpload";

export function CompanyMediaSection({
  companyLogoError,
  onDraftChange,
  onLogoAccepted,
}: CompanyMediaSectionProps) {
  const { t } = useTranslation("createBoothPlan");
  const companyLogo = useCreatePlanStore((state) => state.companyLogo);
  const boothBanner = useCreatePlanStore((state) => state.boothBanner);
  const setCompanyLogo = useCreatePlanStore((state) => state.setCompanyLogo);
  const setBoothBanner = useCreatePlanStore((state) => state.setBoothBanner);

  return (
    <section
      className="company-profile__media"
      aria-labelledby="company-media-title"
    >
      <div className="company-profile__section-heading">
        <h2 id="company-media-title">{t("companyProfile.media.title")}</h2>
        <p>{t("companyProfile.media.description")}</p>
      </div>

      <div className="company-profile__media-grid">
        <MediaUpload
          accept="image/png,image/jpeg,image/webp,image/svg+xml"
          emptyLabel={t("companyProfile.media.missing")}
          errorMessage={companyLogoError}
          file={companyLogo}
          helpText={t("companyProfile.media.logoHelp")}
          id="company-logo"
          label={t("companyProfile.media.logo")}
          onFileChange={(file) => {
            setCompanyLogo(file);
            onDraftChange();
            if (file) {
              onLogoAccepted();
            }
          }}
          required
          uploadedLabel={t("companyProfile.media.uploaded")}
        />
        <MediaUpload
          accept="image/png,image/jpeg,image/webp"
          emptyLabel={t("companyProfile.media.dropBanner")}
          file={boothBanner}
          helpText={t("companyProfile.media.bannerHelp")}
          id="booth-banner"
          label={t("companyProfile.media.banner")}
          onFileChange={(file) => {
            setBoothBanner(file);
            onDraftChange();
          }}
          uploadedLabel={t("companyProfile.media.uploaded")}
          wide
        />
      </div>
    </section>
  );
}
