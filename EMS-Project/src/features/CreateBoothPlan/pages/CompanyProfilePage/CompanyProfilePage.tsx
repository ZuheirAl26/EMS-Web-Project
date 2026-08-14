import { useCallback, useState, type FormEvent } from "react";
import { ArrowLeft02Icon, ArrowRight02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTranslation } from "react-i18next";
import type { ExhibitorCompany } from "../../../ExhibitorProfile/types/profileType";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  BoothPlanShell,
  CompanyDetailsForm,
  CompanyDirectory,
  CompanyMediaSection,
} from "../../components";
import { useCreatePlanStore } from "../../store/useCreatePlanStore";
import type {
  CompanyProfileDraft,
  CompanyProfileValidationErrors,
} from "../../types/companyProfileType";
import { isValidBoothId, validateCompanyProfile } from "../../utils/validation";
import "./CompanyProfilePage.scss";

export function CompanyProfilePage() {
  const { t } = useTranslation("createBoothPlan");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const boothId = Number(searchParams.get("boothId"));
  const hasSelectedBooth = isValidBoothId(boothId);
  const companyProfile = useCreatePlanStore((state) => state.companyProfile);
  const companyLogo = useCreatePlanStore((state) => state.companyLogo);
  const setDraftBoothId = useCreatePlanStore((state) => state.setBoothId);
  const updateCompanyProfile = useCreatePlanStore(
    (state) => state.updateCompanyProfile,
  );
  const [validationErrors, setValidationErrors] =
    useState<CompanyProfileValidationErrors>({});

  const [selectedExistingCompany, setSelectedExistingCompany] =
    useState<ExhibitorCompany | null>(null);

  const updateField = (field: keyof CompanyProfileDraft, value: string) => {
    updateCompanyProfile(field, value);

    if (
      value.trim() &&
      (field === "headquartersLatitude" ||
        field === "headquartersLongitude")
    ) {
      setValidationErrors((current) => ({
        ...current,
        headquartersLocation: undefined,
      }));
    }

    if (
      value.trim() &&
      (field === "website" || field === "twitter" || field === "linkedin")
    ) {
      setValidationErrors((current) => ({
        ...current,
        socialLinks: undefined,
      }));
    }

  };

  const hydrateExistingCompany = useCallback(
    (company: ExhibitorCompany) => {
      setSelectedExistingCompany(company);
      useCreatePlanStore.getState().setCompanyGallery([]);
      updateCompanyProfile("directoryCompanyId", String(company.id));
      updateCompanyProfile("companyName", company.name);
      updateCompanyProfile("businessSector", company.business_sector);
      updateCompanyProfile(
        "headquartersLatitude",
        String(company.headquarters_lat),
      );
      updateCompanyProfile(
        "headquartersLongitude",
        String(company.headquarters_lng),
      );
      updateCompanyProfile("phoneNumber", company.phone);
      updateCompanyProfile("yearFounded", String(company.year_founded));
      updateCompanyProfile("website", company.social_links.website ?? "");
      updateCompanyProfile("twitter", company.social_links.twitter ?? "");
      updateCompanyProfile("linkedin", company.social_links.linkedin ?? "");
      updateCompanyProfile("description", company.description);
      setValidationErrors((current) => ({
        ...current,
        companyLogo: undefined,
        headquartersLocation: undefined,
        socialLinks: undefined,
      }));
    },
    [updateCompanyProfile],
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const hasExistingCompany = Boolean(
      companyProfile.directoryCompanyId.trim(),
    );
    const errors = hasExistingCompany
      ? {}
      : validateCompanyProfile(companyProfile, companyLogo);
    setValidationErrors(errors);

    if (
      errors.socialLinks ||
      errors.companyLogo ||
      errors.headquartersLocation
    ) {
      return;
    }

    setDraftBoothId(boothId);
    navigate(`/dashboard/booths/create/review?boothId=${boothId}`);
  };

  return (
    <BoothPlanShell currentStep={3}>
      <section className="create-booth-plan__card create-booth-plan__card--company">
        <div className="create-booth-plan__intro">
          <h1>{t("companyProfile.title")}</h1>
          <p>{t("companyProfile.description")}</p>
        </div>

        {!hasSelectedBooth ? (
          <div className="company-profile__missing" role="alert">
            <strong>{t("companyProfile.missingBoothTitle")}</strong>
            <span>{t("companyProfile.missingBoothMessage")}</span>
            <Link to="/dashboard/booths/create">
              {t("companyProfile.chooseBooth")}
            </Link>
          </div>
        ) : (
          <form className="company-profile" onSubmit={handleSubmit}>
            <CompanyDetailsForm
              headquartersLocationError={
                validationErrors.headquartersLocation
                  ? t("companyProfile.validation.headquartersLocationRequired")
                  : undefined
              }
              hasSocialLinksError={Boolean(validationErrors.socialLinks)}
              onFieldChange={updateField}
            />

            <CompanyMediaSection
              companyLogoError={
                validationErrors.companyLogo
                  ? t("companyProfile.validation.logoRequired")
                  : undefined
              }
              existingCompany={
                companyProfile.directoryCompanyId
                  ? selectedExistingCompany
                  : null
              }
              onLogoAccepted={() =>
                setValidationErrors((current) => ({
                  ...current,
                  companyLogo: undefined,
                }))
              }
            />

            <CompanyDirectory
              onCompanySelected={hydrateExistingCompany}
              onFieldChange={updateField}
            />

            <footer className="create-booth-plan__footer">
              <button
                className="company-profile__back"
                onClick={() => navigate(-1)}
                type="button"
              >
                <HugeiconsIcon
                  aria-hidden="true"
                  color="currentColor"
                  icon={ArrowLeft02Icon}
                  size={16}
                  strokeWidth={1.8}
                />
                {t("companyProfile.back")}
              </button>

              <div className="company-profile__continue">
                <button type="submit">
                  {t("companyProfile.continue")}
                  <HugeiconsIcon
                    aria-hidden="true"
                    color="currentColor"
                    icon={ArrowRight02Icon}
                    size={16}
                    strokeWidth={1.8}
                  />
                </button>
              </div>
            </footer>
          </form>
        )}
      </section>
    </BoothPlanShell>
  );
}
