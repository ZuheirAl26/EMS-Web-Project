import { useTranslation } from "react-i18next";
import type { AccountInformationProps } from "../../types/profileType";
import { formatCoordinates } from "../../utils/profileUtils";
import "./AccountInformation.scss";

export function AccountInformation({
  company,
  exhibitor,
}: AccountInformationProps) {
  const { t } = useTranslation("dashboard");
  const website = company.social_links.website;
  const fields = [
    { label: t("profile.fields.fullName"), value: exhibitor.name },
    { label: t("profile.fields.role"), value: t("profile.role") },
    { label: t("profile.fields.companyName"), value: company.name },
    { label: t("profile.fields.businessSector"), value: company.business_sector },
    {
      label: t("profile.fields.location"),
      value: formatCoordinates(
        company.headquarters_lat,
        company.headquarters_lng,
      ),
    },
    { label: t("profile.fields.phone"), value: company.phone },
    { label: t("profile.fields.email"), value: exhibitor.email },
    { label: t("profile.fields.yearFounded"), value: company.year_founded },
  ];

  return (
    <section className="profile-account-information">
      <h2>{t("profile.accountInformation")}</h2>
      <dl>
        {fields.map((field) => (
          <div key={field.label}>
            <dt>{field.label}</dt>
            <dd>{field.value || "—"}</dd>
          </div>
        ))}
        <div className="profile-account-information__wide">
          <dt>{t("profile.fields.website")}</dt>
          <dd>
            {website ? (
              <a href={website} rel="noreferrer" target="_blank">
                {website}
              </a>
            ) : (
              "—"
            )}
          </dd>
        </div>
      </dl>
    </section>
  );
}
