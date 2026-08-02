import { useState } from "react";
import { FolderLibraryIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTranslation } from "react-i18next";
import { useCreatePlanStore } from "../../store/useCreatePlanStore";
import type { CompanyDirectoryProps } from "../../types/componentType";

export function CompanyDirectory({
  onFieldChange,
}: CompanyDirectoryProps) {
  const { t } = useTranslation("createBoothPlan");
  const [isOpen, setIsOpen] = useState(false);
  const directoryCompanyId = useCreatePlanStore(
    (state) => state.companyProfile.directoryCompanyId,
  );

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
              disabled
              onChange={(event) =>
                onFieldChange("directoryCompanyId", event.target.value)
              }
              value={directoryCompanyId}
            >
              <option value="">{t("companyProfile.directory.empty")}</option>
            </select>
          </label>
          <button disabled type="button">
            {t("companyProfile.directory.useCompany")}
          </button>
        </div>
      ) : null}
    </section>
  );
}
