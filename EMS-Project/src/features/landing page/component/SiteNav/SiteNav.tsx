import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "../../../../context/useLanguageStore";
import { useThemeStore } from "../../../../context/useThemeStore";
import type {
  LandingNavTranslationKey,
  LandingSectionId,
} from "../../types/landingType";
import { toLandingSectionHref } from "../../utils/validation";
import "./SiteNav.scss";
import logo from "../../../../assets/logo.png";

const navigationItems: ReadonlyArray<{
  id: LandingSectionId;
  label: LandingNavTranslationKey;
}> = [
  { id: "home", label: "nav.home" },
  { id: "exhibition", label: "nav.exhibition" },
  { id: "floor-map", label: "nav.floorMap" },
  { id: "plan", label: "nav.plan" },
  { id: "features", label: "nav.features" },
  { id: "blog", label: "nav.blog" },
  { id: "contact", label: "nav.contact" },
];

export function SiteNav() {
  const { t } = useTranslation("landing");
  const toggleLanguage = useLanguageStore((state) => state.toggleLanguage);
  const { theme, toggleTheme } = useThemeStore();

  return (
    <header className="site-nav">
      <div className="site-nav__container">
        <div className="site-nav__brand">
          <img
            src={logo}
            alt={t("nav.logoAlt")}
            className="site-nav__logo"
          />
          <span className="site-nav__title">{t("nav.brand")}</span>
        </div>

        {/* Navigation Links */}
        <nav className="site-nav__links" aria-label={t("nav.aria")}>
          {navigationItems.map((item) => (
            <a href={toLandingSectionHref(item.id)} key={item.id}>
              {t(item.label)}
            </a>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="site-nav__actions">
          <button
            aria-pressed={theme === "dark"}
            className="site-nav__theme"
            onClick={toggleTheme}
            type="button"
          >
            {theme === "dark" ? t("nav.lightMode") : t("nav.darkMode")}
          </button>
          <button
            className="site-nav__language"
            onClick={toggleLanguage}
            type="button"
          >
            {t("nav.language")}
          </button>
          <Link to="/login" className="btn btn--outline">
            {t("nav.login")}
          </Link>
          <Link to="/register" className="btn btn--solid">
            {t("nav.getStarted")}
          </Link>
        </div>
      </div>
    </header>
  );
}
