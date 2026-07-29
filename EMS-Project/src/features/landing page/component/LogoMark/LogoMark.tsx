import { useTranslation } from "react-i18next";
import difLogo from "../../../../assets/logo.png";
import type { LogoMarkProps } from "../../types/landingType";
import "./LogoMark.scss";

export function LogoMark({ large = false }: LogoMarkProps) {
  const { t } = useTranslation("landing");

  return (
    <img
      alt={t("nav.logoAlt")}
      className={large ? "dif-logo dif-logo--large" : "dif-logo"}
      src={difLogo}
    />
  );
}
