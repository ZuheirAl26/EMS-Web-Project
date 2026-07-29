import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "../../../../context/useLanguageStore";
import { useThemeStore } from "../../../../context/useThemeStore";
import "./SiteNav.scss";
import logo from "../../../../assets/logo.png";

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
          <a href="#home">{t("nav.home")}</a>
          <a href="#exhibition">{t("nav.exhibition")}</a>
          <a href="#floor-map">{t("nav.floorMap")}</a>
          <a href="#plan">{t("nav.plan")}</a>
          <a href="#features">{t("nav.features")}</a>
          <a href="#blog">{t("nav.blog")}</a>
          <a href="#contact">{t("nav.contact")}</a>
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
