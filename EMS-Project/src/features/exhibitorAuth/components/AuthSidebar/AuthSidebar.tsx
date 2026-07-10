import { useTranslation } from "react-i18next";
import "./AuthSidebar.scss";
import logoImage from "../../../../assets/logo.png";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  StoreManagement01Icon,
  UserAdd01Icon,
  IdentityCardIcon,
} from "@hugeicons/core-free-icons";

function AuthSidebar() {
  const { t } = useTranslation();
  return (
    <div className="auth-sidebar">
      <img
        src={logoImage}
        alt={`${t("branding.title")} Logo`}
        className="logo-image"
      />
      <h1>{t("branding.title")}</h1>
      <p className="subtitle">{t("branding.subtitle")}</p>

      <ul className="feature-list">
        <li>
          <span className="icon">
            <HugeiconsIcon
              icon={StoreManagement01Icon}
              size={24}
              color="currentColor"
              strokeWidth={2}
            />
          </span>
          <p>{t("branding.feature1")}</p>
        </li>

        <li>
          <span className="icon">
            <HugeiconsIcon
              icon={UserAdd01Icon}
              size={24}
              color="currentColor"
              strokeWidth={2}
            />
          </span>
          <p>{t("branding.feature2")}</p>
        </li>

        <li>
          <span className="icon">
            <HugeiconsIcon
              icon={IdentityCardIcon}
              size={24}
              color="currentColor"
              strokeWidth={2}
            />
          </span>
          <p>{t("branding.feature3")}</p>
        </li>
      </ul>

      <div className="footer-copyright">
        © {new Date().getFullYear()} {t("branding.title")}{" "}
        {t("login.footer.AllRightsReserved")}.
      </div>
    </div>
  );
}

export default AuthSidebar;
