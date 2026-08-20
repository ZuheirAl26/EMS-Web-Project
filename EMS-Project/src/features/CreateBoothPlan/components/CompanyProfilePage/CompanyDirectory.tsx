import { useEffect, useRef, useState } from "react";
import { FolderLibraryIcon, Building03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTranslation } from "react-i18next";
import { useCompanyLookup } from "../../../ExhibitorProfile/hooks/useCompanyLookup";
import { useCompanyProfile } from "../../../ExhibitorProfile/hooks/useCompanyProfile";
import { useCreatePlanStore } from "../../store/useCreatePlanStore";
import type { CompanyDirectoryProps } from "../../types/componentType";
import { CustomSelect } from "../../../../components";
import type { SelectOption } from "../../../../components/CustomSelect/CustomSelect";

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
  const companyOptions: SelectOption<string>[] = companies.map((company) => ({
    value: String(company.id),
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
    document
      .querySelector<HTMLElement>(".create-booth-plan__main")
      ?.scrollIntoView({
        block: "start",
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
      });
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
          <div className="company-profile__directory-info">
            <strong>{t("companyProfile.directory.title")}</strong>
            <span>{t("companyProfile.directory.description")}</span>
          </div>

          <div className="company-profile__directory-select-wrapper">
            <label
              htmlFor="company-directory-select"
              className="company-profile__directory-select-label"
            >
              {t("companyProfile.directory.selectLabel")}
            </label>
            <CustomSelect<string>
              id="company-directory-select"
              options={companyOptions}
              value={directoryCompanyId}
              onChange={handleCompanyChange}
              placeholder={
                companyLookupQuery.isPending
                  ? t("companyProfile.directory.loading")
                  : t("companyProfile.directory.empty")
              }
              disabled={
                companyLookupQuery.isPending || companyLookupQuery.isError
              }
              icon={<HugeiconsIcon icon={Building03Icon} size={16} />}
            />
          </div>

          {companyLookupQuery.isError ? (
            <div className="company-profile__directory-status company-profile__directory-status--error">
              <span>{t("companyProfile.directory.error")}</span>
              <button
                onClick={() => void companyLookupQuery.refetch()}
                type="button"
              >
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
              <button
                onClick={() => void companyProfileQuery.refetch()}
                type="button"
              >
                {t("companyProfile.directory.retry")}
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
