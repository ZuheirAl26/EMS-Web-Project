import { Briefcase01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTranslation } from "react-i18next";
import { BUSINESS_SECTORS } from "../../types/businessSectorType";

interface BusinessSectorSelectProps {
  onValueChange: (value: string) => void;
  value: string;
}

export function BusinessSectorSelect({
  onValueChange,
  value,
}: BusinessSectorSelectProps) {
  const { t } = useTranslation("createBoothPlan");

  return (
    <label className="company-profile__field">
      <span>{t("companyProfile.fields.businessSector")}</span>
      <span className="company-profile__input">
        <HugeiconsIcon
          aria-hidden="true"
          color="currentColor"
          icon={Briefcase01Icon}
          size={14}
          strokeWidth={1.8}
        />
        <select
          onChange={(event) => onValueChange(event.target.value)}
          required
          value={value}
        >
          <option disabled value="">
            {t("companyProfile.fields.businessSectorPlaceholder")}
          </option>
          {BUSINESS_SECTORS.map((sector) => (
            <option key={sector} value={sector}>
              {t(`companyProfile.businessSectors.${sector}`)}
            </option>
          ))}
        </select>
      </span>
    </label>
  );
}
