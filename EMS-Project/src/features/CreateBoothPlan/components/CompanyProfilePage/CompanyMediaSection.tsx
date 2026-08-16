import { useTranslation } from "react-i18next";
import {
  getGalleryUrls,
  resolveMediaUrl,
} from "../../../ExhibitorProfile/utils/profileUtils";
import { useCreatePlanStore } from "../../store/useCreatePlanStore";
import type { CompanyMediaSectionProps } from "../../types/componentType";
import { MediaUpload } from "./MediaUpload";

const MAX_GALLERY_IMAGES = 10;

export function CompanyMediaSection({
  companyLogoError,
  existingCompany,
  onLogoAccepted,
}: CompanyMediaSectionProps) {
  const { t } = useTranslation("createBoothPlan");
  const companyLogo = useCreatePlanStore((state) => state.companyLogo);
  const companyGallery = useCreatePlanStore((state) => state.companyGallery);
  const setCompanyLogo = useCreatePlanStore((state) => state.setCompanyLogo);
  const setCompanyGallery = useCreatePlanStore(
    (state) => state.setCompanyGallery,
  );
  const existingLogoUrl = existingCompany
    ? resolveMediaUrl(existingCompany.logo)
    : null;
  const existingGalleryUrls = existingCompany
    ? getGalleryUrls(existingCompany.gallery)
    : [];

  return (
    <section aria-labelledby="company-media-title" className="company-profile__media">
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
          onFileChange={(nextFile) => {
            setCompanyLogo(nextFile);
            if (nextFile) {
              onLogoAccepted();
            }
          }}
          remotePreviewUrls={
            companyLogo || !existingLogoUrl ? [] : [existingLogoUrl]
          }
          required
          uploadedLabel={t("companyProfile.media.uploaded")}
        />
        <MediaUpload
          accept="image/png,image/jpeg,image/webp"
          emptyLabel={t("companyProfile.media.dropBanner")}
          files={companyGallery}
          helpText={t("companyProfile.media.bannerHelp")}
          id="company-gallery"
          label={t("companyProfile.media.banner")}
          limitReachedLabel={t("companyProfile.media.bannerLimitReached", {
            count: MAX_GALLERY_IMAGES,
          })}
          maxFiles={MAX_GALLERY_IMAGES}
          onFilesChange={setCompanyGallery}
          removeFileAriaLabel={(fileName) =>
            t("companyProfile.media.removeImage", { name: fileName })
          }
          selectedFilesLabel={t("companyProfile.media.selectedImages")}
          remotePreviewUrls={
            companyGallery.length
              ? []
              : existingGalleryUrls.slice(0, MAX_GALLERY_IMAGES)
          }
          uploadedLabel={t("companyProfile.media.uploaded")}
          wide
        />
      </div>
    </section>
  );
}
