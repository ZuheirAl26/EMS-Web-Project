import { useTranslation } from "react-i18next";
import difLogo from "../../../../assets/logo.png";
import "./LogoMark.scss";

type LogoMarkProps = {
  large?: boolean;
};

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
