import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { EmptyState } from "../../../components";
import { useMyBooths } from "../../MyBooths/hooks/useMyBooths";
import {
  AccountInformation,
  CompanyAboutCard,
  CompanyMediaCard,
  EditProfileDialog,
  ProfileSidebarCard,
  ProfileSkeleton,
  SocialLinksCard,
} from "../components";
import { useCompanyProfile } from "../hooks/useCompanyProfile";
import { useExhibitorProfile } from "../hooks/useExhibitorProfile";
import { getCompanyBoothSummary } from "../utils/profileUtils";
import "./ExhibitorProfilePage.scss";
import { HugeiconsIcon } from "@hugeicons/react";
import { Briefcase01Icon, Edit02Icon } from "@hugeicons/core-free-icons";
import { useCompanyLookup } from "../hooks/useCompanyLookup";

export function ExhibitorProfilePage() {
  const { t } = useTranslation("dashboard");
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(
    null,
  );
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  const exhibitorQuery = useExhibitorProfile();
  const boothsQuery = useMyBooths(1);
  const companyLookupQuery = useCompanyLookup();
  const booths = useMemo(
    () => boothsQuery.data?.data.data ?? [],
    [boothsQuery.data],
  );
  const companies = companyLookupQuery.data?.data ?? [];

  const activeCompanyId =
    selectedCompanyId !== null &&
    companies.some((company) => company.id === selectedCompanyId)
      ? selectedCompanyId
      : (companies[0]?.id ?? null);
  const companyQuery = useCompanyProfile(activeCompanyId);
  const boothSummary = useMemo(
    () => getCompanyBoothSummary(booths, activeCompanyId),
    [activeCompanyId, booths],
  );
  const handleCompanyChange = (companyId: number) => {
    if (companyId === activeCompanyId) {
      return;
    }

    setSelectedCompanyId(companyId);
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  };
  const company = companyQuery.data?.data.company ?? null;
  const isCompanyLoading =
    companyLookupQuery.isPending ||
    (activeCompanyId !== null && companyQuery.isPending);
  if (exhibitorQuery.isPending || isCompanyLoading) {
    return (
      <section aria-label={t("profile.aria")} className="exhibitor-profile">
        <header className="exhibitor-profile__intro">
          <div>
            <h1>{t("profile.title")}</h1>
            <p>{t("profile.description")}</p>
          </div>
        </header>
        <ProfileSkeleton />
      </section>
    );
  }

  if (exhibitorQuery.isError) {
    return (
      <section className="exhibitor-profile exhibitor-profile--state">
        <EmptyState
          message={t("profile.errorMessage")}
          title={t("profile.errorTitle")}
        />
        <button
          className="exhibitor-profile__retry"
          onClick={() => {
            void exhibitorQuery.refetch();
          }}
          type="button"
        >
          {t("profile.retry")}
        </button>
      </section>
    );
  }

  const exhibitor = exhibitorQuery.data.data;

  return (
    <section aria-label={t("profile.aria")} className="exhibitor-profile">
      <header className="exhibitor-profile__intro">
        <div>
          <h1>{t("profile.title")}</h1>
          <p>{t("profile.description")}</p>
        </div>

        <button
          className="exhibitor-profile__edit-btn"
          onClick={() => setIsEditProfileOpen(true)}
          type="button"
        >
          <HugeiconsIcon
            aria-hidden="true"
            color="currentColor"
            icon={Edit02Icon}
            size={13}
            strokeWidth={1.9}
          />
          {t("profile.edit.button")}
        </button>
      </header>

      <div className="exhibitor-profile__layout">
        <ProfileSidebarCard
          boothSummary={boothSummary}
          companies={companies}
          company={company}
          exhibitor={exhibitor}
          onCompanyChange={handleCompanyChange}
          selectedCompanyId={activeCompanyId}
        />
        <div className="exhibitor-profile__details">
          <AccountInformation company={company} exhibitor={exhibitor} />
          {company ? (
            <>
              <CompanyAboutCard company={company} />
              <SocialLinksCard links={company.social_links} />
              <CompanyMediaCard company={company} />
            </>
          ) : (
            <div className="exhibitor-profile__company-state">
              <span
                aria-hidden="true"
                className="exhibitor-profile__company-empty-icon"
              >
                <HugeiconsIcon icon={Briefcase01Icon} size={26} strokeWidth={1.7} />
              </span>
              <EmptyState
                message={t("profile.noCompaniesMessage")}
                title={t("profile.noCompaniesTitle")}
              />
            </div>
          )}
        </div>
      </div>

      <EditProfileDialog
        exhibitor={exhibitor}
        onClose={() => setIsEditProfileOpen(false)}
        open={isEditProfileOpen}
      />
    </section>
  );
}
