import { useTranslation } from "react-i18next";
import { CustomSelect } from "../../../../components";
import type { SelectOption } from "../../../../components/CustomSelect/CustomSelect";
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

  const sectorOptions: SelectOption<string>[] = BUSINESS_SECTORS.map(
    (sector) => ({
      value: sector,
      label: t(`companyProfile.businessSectors.${sector}`),
    }),
  );

  return (
    <div className="company-profile__field">
      <span>{t("companyProfile.fields.businessSector")}</span>
      <CustomSelect<string>
        options={sectorOptions}
        value={value}
        onChange={onValueChange}
        placeholder={t("companyProfile.fields.businessSectorPlaceholder")}
      />
    </div>
  );
}
