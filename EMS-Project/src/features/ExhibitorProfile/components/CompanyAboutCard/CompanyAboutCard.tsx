import { Location01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTranslation } from "react-i18next";
import type { CompanyAboutCardProps } from "../../types/profileType";
import { formatCoordinates } from "../../utils/profileUtils";
import "./CompanyAboutCard.scss";

export function CompanyAboutCard({ company }: CompanyAboutCardProps) {
  const { t } = useTranslation("dashboard");

  return (
    <section className="profile-company-about">
      <h2>{t("profile.about.title")}</h2>
      <p>{company.description || t("profile.about.empty")}</p>
      <div className="profile-company-about__location">
        <span aria-hidden="true">
          <HugeiconsIcon
            color="currentColor"
            icon={Location01Icon}
            size={16}
            strokeWidth={1.8}
          />
        </span>
        <div>
          <strong>{t("profile.about.headquarters")}</strong>
          <small>
            {formatCoordinates(
              company.headquarters_lat,
              company.headquarters_lng,
            )}
          </small>
        </div>
      </div>
    </section>
  );
}
