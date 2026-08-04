import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { EmptyState, Loader } from "../../../components";
import { useMyBooths } from "../../MyBooths/hooks/useMyBooths";
import {
  AccountInformation,
  CompanyAboutCard,
  CompanyMediaCard,
  ProfileSidebarCard,
  SocialLinksCard,
} from "../components";
import { useCompanyProfile } from "../hooks/useCompanyProfile";
import { useExhibitorProfile } from "../hooks/useExhibitorProfile";
import {
  getCompanyBoothSummary,
  getCompanyOptions,
} from "../utils/profileUtils";
import "./ExhibitorProfilePage.scss";

export function ExhibitorProfilePage() {
  const { t } = useTranslation("dashboard");
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(
    null,
  );
  const exhibitorQuery = useExhibitorProfile();
  const boothsQuery = useMyBooths(1);
  const booths = useMemo(
    () => boothsQuery.data?.data.data ?? [],
    [boothsQuery.data],
  );
  const companies = useMemo(() => getCompanyOptions(booths), [booths]);
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

  if (exhibitorQuery.isPending || boothsQuery.isPending) {
    return (
      <section className="exhibitor-profile exhibitor-profile--state">
        <Loader />
        <p>{t("profile.loading")}</p>
      </section>
    );
  }

  if (exhibitorQuery.isError || boothsQuery.isError) {
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
            void boothsQuery.refetch();
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
        <h1>{t("profile.title")}</h1>
        <p>{t("profile.description")}</p>
      </header>

      {activeCompanyId === null ? (
        <EmptyState
          message={t("profile.noCompaniesMessage")}
          title={t("profile.noCompaniesTitle")}
        />
      ) : companyQuery.isPending ? (
        <div className="exhibitor-profile__company-state">
          <Loader />
          <p>{t("profile.companyLoading")}</p>
        </div>
      ) : companyQuery.isError ? (
        <div className="exhibitor-profile__company-state">
          <EmptyState
            message={t("profile.companyErrorMessage")}
            title={t("profile.companyErrorTitle")}
          />
          <button
            className="exhibitor-profile__retry"
            onClick={() => void companyQuery.refetch()}
            type="button"
          >
            {t("profile.retry")}
          </button>
        </div>
      ) : (
        <div className="exhibitor-profile__layout">
          <ProfileSidebarCard
            boothSummary={boothSummary}
            companies={companies}
            company={companyQuery.data.data.company}
            exhibitor={exhibitor}
            onCompanyChange={setSelectedCompanyId}
            selectedCompanyId={activeCompanyId}
          />
          <div className="exhibitor-profile__details">
            <AccountInformation
              company={companyQuery.data.data.company}
              exhibitor={exhibitor}
            />
            <CompanyAboutCard company={companyQuery.data.data.company} />
            <SocialLinksCard
              links={companyQuery.data.data.company.social_links}
            />
            <CompanyMediaCard company={companyQuery.data.data.company} />
          </div>
        </div>
      )}
    </section>
  );
}
