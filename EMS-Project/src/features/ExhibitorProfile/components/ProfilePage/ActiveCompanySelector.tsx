import { useState } from "react";
import { ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTranslation } from "react-i18next";
import type { ActiveCompanySelectorProps } from "../../types/profileType";
import { getInitials } from "../../utils/profileUtils";
import "./ActiveCompanySelector.scss";

export function ActiveCompanySelector({
  activeCompany,
  companies,
  onCompanyChange,
  selectedCompanyId,
}: ActiveCompanySelectorProps) {
  const { t } = useTranslation("dashboard");
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = companies.find(
    (company) => company.id === selectedCompanyId,
  );
  const selectedName = activeCompany?.name || selectedOption?.name || "—";

  return (
    <section
      className="active-company-selector"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsOpen(false);
        }
      }}
    >
      <h3>{t("profile.companySelector.title")}</h3>
      <button
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className="active-company-selector__trigger"
        disabled={companies.length === 0}
        onClick={() => setIsOpen((open) => !open)}
        type="button"
      >
        <span className="active-company-selector__mark" aria-hidden="true">
          {getInitials(selectedName)}
        </span>
        <span className="active-company-selector__copy">
          <strong>{selectedName}</strong>
          <small>
            {activeCompany?.business_sector ||
              t("profile.companySelector.companyProfile")}
          </small>
        </span>
        <HugeiconsIcon
          aria-hidden="true"
          className={isOpen ? "active-company-selector__arrow--open" : ""}
          color="currentColor"
          icon={ArrowDown01Icon}
          size={14}
          strokeWidth={2}
        />
      </button>

      {isOpen ? (
        <div
          aria-label={t("profile.companySelector.options")}
          className="active-company-selector__options"
          role="listbox"
        >
          {companies.map((company) => (
            <button
              aria-selected={company.id === selectedCompanyId}
              key={company.id}
              onClick={() => {
                onCompanyChange(company.id);
                setIsOpen(false);
              }}
              role="option"
              type="button"
            >
              <span aria-hidden="true">{getInitials(company.name)}</span>
              <strong>{company.name}</strong>
            </button>
          ))}
        </div>
      ) : null}

      <p>
        {t("profile.companySelector.managing", { count: companies.length })}
      </p>
    </section>
  );
}
