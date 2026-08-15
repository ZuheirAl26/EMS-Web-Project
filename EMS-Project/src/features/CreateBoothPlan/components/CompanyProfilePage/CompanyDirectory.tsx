import { useEffect, useRef, useState } from "react";
import { FolderLibraryIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTranslation } from "react-i18next";
import { useCompanyLookup } from "../../../ExhibitorProfile/hooks/useCompanyLookup";
import { useCompanyProfile } from "../../../ExhibitorProfile/hooks/useCompanyProfile";
import { useCreatePlanStore } from "../../store/useCreatePlanStore";
import type { CompanyDirectoryProps } from "../../types/componentType";

export function CompanyDirectory({
  onCompanySelected,
  onFieldChange,
}: CompanyDirectoryProps) {
  const { t } = useTranslation("createBoothPlan");
  const [isOpen, setIsOpen] = useState(false);
  const hydratedCompanyIdRef = useRef<number | null>(null);
  const directoryCompanyId = useCreatePlanStore(
    (state) => state.companyProfile.directoryCompanyId,
  );
  const companyLookupQuery = useCompanyLookup();
  const companies = companyLookupQuery.data?.data ?? [];
  const companyOptions = companies.map((company) => ({
    id: company.id,
    label:
      company.name.trim() ||
      t("companyProfile.directory.fallback", { id: company.id }),
  }));
  const selectedCompanyId = Number(directoryCompanyId) || null;
  const companyProfileQuery = useCompanyProfile(selectedCompanyId);
  const selectedCompany = companyProfileQuery.data?.data.company ?? null;

  useEffect(() => {
    if (
      selectedCompanyId === null ||
      selectedCompany === null ||
      selectedCompany.id !== selectedCompanyId ||
      hydratedCompanyIdRef.current === selectedCompany.id
    ) {
      return;
    }

    onCompanySelected(selectedCompany);
    hydratedCompanyIdRef.current = selectedCompany.id;
  }, [onCompanySelected, selectedCompany, selectedCompanyId]);

  const handleCompanyChange = (companyId: string) => {
    hydratedCompanyIdRef.current = null;
    onFieldChange("directoryCompanyId", companyId);
  };

  const isLoadingDetails =
    selectedCompanyId !== null && companyProfileQuery.isFetching;

  return (
    <section className="company-profile__directory">
      <button
        aria-expanded={isOpen}
        className="company-profile__directory-toggle"
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
        <HugeiconsIcon
          aria-hidden="true"
          color="currentColor"
          icon={FolderLibraryIcon}
          size={16}
          strokeWidth={1.8}
        />
        {t("companyProfile.directory.button")}
      </button>

      {isOpen ? (
        <div className="company-profile__directory-panel">
          <div>
            <strong>{t("companyProfile.directory.title")}</strong>
            <span>{t("companyProfile.directory.description")}</span>
          </div>

          <label>
            <span>{t("companyProfile.directory.selectLabel")}</span>
            <select
              disabled={companyLookupQuery.isPending || companyLookupQuery.isError}
              onChange={(event) => handleCompanyChange(event.target.value)}
              value={directoryCompanyId}
            >
              <option value="">
                {companyLookupQuery.isPending
                  ? t("companyProfile.directory.loading")
                  : t("companyProfile.directory.empty")}
              </option>
              {companyOptions.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.label}
                </option>
              ))}
            </select>
          </label>

          {companyLookupQuery.isError ? (
            <div className="company-profile__directory-status company-profile__directory-status--error">
              <span>{t("companyProfile.directory.error")}</span>
              <button onClick={() => void companyLookupQuery.refetch()} type="button">
                {t("companyProfile.directory.retry")}
              </button>
            </div>
          ) : null}

          {isLoadingDetails ? (
            <span className="company-profile__directory-status">
              {t("companyProfile.directory.loadingDetails")}
            </span>
          ) : null}

          {selectedCompanyId !== null && companyProfileQuery.isError ? (
            <div className="company-profile__directory-status company-profile__directory-status--error">
              <span>{t("companyProfile.directory.detailsError")}</span>
              <button onClick={() => void companyProfileQuery.refetch()} type="button">
                {t("companyProfile.directory.retry")}
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
