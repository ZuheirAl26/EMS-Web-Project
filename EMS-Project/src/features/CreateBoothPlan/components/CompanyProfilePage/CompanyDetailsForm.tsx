import {
  Calendar03Icon,
  Call02Icon,
  Globe02Icon,
  Linkedin01Icon,
  Location01Icon,
  NewTwitterIcon,
  OfficeIcon,
  TextAlignLeftIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTranslation } from "react-i18next";
import { useCreatePlanStore } from "../../store/useCreatePlanStore";
import type { CompanyDetailsFormProps } from "../../types/componentType";
import { BusinessSectorSelect } from "./BusinessSectorSelect";
import { CompanyLocationPicker } from "./CompanyLocationPicker";
import { ProfileField } from "./ProfileField";

const CURRENT_YEAR = new Date().getFullYear();

export function CompanyDetailsForm({
  headquartersLocationError,
  hasSocialLinksError,
  onFieldChange,
}: CompanyDetailsFormProps) {
  const { t } = useTranslation("createBoothPlan");
  const companyProfile = useCreatePlanStore((state) => state.companyProfile);

  return (
    <section className="company-profile__primary">
      <h2>{t("companyProfile.primaryCompany")}</h2>

      <div className="company-profile__grid">
        <ProfileField
          autoComplete="organization"
          icon={OfficeIcon}
          label={t("companyProfile.fields.companyName")}
          onValueChange={(value) => onFieldChange("companyName", value)}
          placeholder={t("companyProfile.fields.companyNamePlaceholder")}
          required
          value={companyProfile.companyName}
        />
        <BusinessSectorSelect
          onValueChange={(value) => onFieldChange("businessSector", value)}
          value={companyProfile.businessSector}
        />
        <ProfileField
          autoComplete="street-address"
          icon={Location01Icon}
          label={t("companyProfile.fields.companyLocation")}
          onValueChange={(value) => onFieldChange("companyLocation", value)}
          placeholder={t("companyProfile.fields.companyLocationPlaceholder")}
          required
          value={companyProfile.companyLocation}
        />
        <CompanyLocationPicker
          errorMessage={headquartersLocationError}
          latitude={companyProfile.headquartersLatitude}
          longitude={companyProfile.headquartersLongitude}
          onLocationChange={(latitude, longitude) => {
            onFieldChange("headquartersLatitude", latitude);
            onFieldChange("headquartersLongitude", longitude);
          }}
        />
        <ProfileField
          autoComplete="tel"
          icon={Call02Icon}
          label={t("companyProfile.fields.phoneNumber")}
          onValueChange={(value) => onFieldChange("phoneNumber", value)}
          placeholder={t("companyProfile.fields.phoneNumberPlaceholder")}
          required
          type="tel"
          value={companyProfile.phoneNumber}
        />
        <ProfileField
          icon={Calendar03Icon}
          label={t("companyProfile.fields.yearFounded")}
          max={CURRENT_YEAR}
          min={1800}
          onValueChange={(value) => onFieldChange("yearFounded", value)}
          placeholder={t("companyProfile.fields.yearFoundedPlaceholder")}
          required
          type="number"
          value={companyProfile.yearFounded}
        />
      </div>

      <div
        aria-describedby={hasSocialLinksError ? "social-links-error" : undefined}
        aria-invalid={hasSocialLinksError}
        aria-labelledby="social-links-title"
        aria-required="true"
        className={[
          "company-profile__social",
          hasSocialLinksError ? "company-profile__social--error" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        role="group"
      >
        <div className="company-profile__social-title" id="social-links-title">
          <span>{t("companyProfile.socialLinks")}</span>
          <em>{t("companyProfile.socialLinksRequirement")}</em>
        </div>
        <div className="company-profile__social-grid">
          <ProfileField
            icon={Globe02Icon}
            label={t("companyProfile.fields.website")}
            onValueChange={(value) => onFieldChange("website", value)}
            placeholder={t("companyProfile.fields.websitePlaceholder")}
            type="url"
            value={companyProfile.website}
          />
          <ProfileField
            icon={NewTwitterIcon}
            label={t("companyProfile.fields.twitter")}
            onValueChange={(value) => onFieldChange("twitter", value)}
            placeholder={t("companyProfile.fields.twitterPlaceholder")}
            type="url"
            value={companyProfile.twitter}
          />
          <ProfileField
            icon={Linkedin01Icon}
            label={t("companyProfile.fields.linkedin")}
            onValueChange={(value) => onFieldChange("linkedin", value)}
            placeholder={t("companyProfile.fields.linkedinPlaceholder")}
            type="url"
            value={companyProfile.linkedin}
          />
        </div>
        {hasSocialLinksError ? (
          <span
            className="company-profile__validation-error"
            id="social-links-error"
            role="alert"
          >
            {t("companyProfile.validation.socialLinkRequired")}
          </span>
        ) : null}
      </div>

      <label className="company-profile__field">
        <span>{t("companyProfile.fields.description")}</span>
        <span className="company-profile__input company-profile__input--textarea">
          <HugeiconsIcon
            aria-hidden="true"
            color="currentColor"
            icon={TextAlignLeftIcon}
            size={14}
            strokeWidth={1.8}
          />
          <textarea
            onChange={(event) =>
              onFieldChange("description", event.target.value)
            }
            placeholder={t("companyProfile.fields.descriptionPlaceholder")}
            required
            rows={4}
            value={companyProfile.description}
          />
        </span>
      </label>
    </section>
  );
}
