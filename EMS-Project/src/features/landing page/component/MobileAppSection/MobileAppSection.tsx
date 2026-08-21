import { useTranslation } from "react-i18next";
import { useThemeStore } from "../../../../context/useThemeStore";
import { appFeatures } from "../../pages/landingData";
import { Icon } from "../Icon/Icon";
import visitorAppDarkAr from "../../assets/visitor-app-dark-ar.jpg";
import visitorAppDarkEn from "../../assets/visitor-app-dark-en.jpg";
import visitorAppLightAr from "../../assets/visitor-app-light-ar.jpg";
import visitorAppLightEn from "../../assets/visitor-app-light-en.jpg";
import "./MobileAppSection.scss";

// Configurable mobile preview screenshots for all 4 locale/theme combinations:
export const MOBILE_PREVIEW_PATHS = {
  "ar-dark": visitorAppDarkAr,
  "ar-light": visitorAppLightAr,
  "en-dark": visitorAppDarkEn,
  "en-light": visitorAppLightEn,
};

export const APP_STORE_URL =
  "https://apps.apple.com/app/damascus-international-fair/id6449190123";
export const GOOGLE_PLAY_URL =
  "https://play.google.com/store/apps/details?id=com.damascus.fair.visitor";

export function MobileAppSection() {
  const { t, i18n } = useTranslation("landing");
  const { theme } = useThemeStore();

  const currentLang = i18n.language?.startsWith("ar") ? "ar" : "en";
  const currentTheme = theme === "dark" ? "dark" : "light";
  const variantKey =
    `${currentLang}-${currentTheme}` as keyof typeof MOBILE_PREVIEW_PATHS;
  const activeImageSrc =
    MOBILE_PREVIEW_PATHS[variantKey] || visitorAppLightAr;

  return (
    <section className="mobile-app-section" id="visitor-app">
      <div className="mobile-app-section__shell">
        <div className="mobile-app-section__heading">
          <span>{t("mobileApp.eyebrow")}</span>
          <h2>{t("mobileApp.title")}</h2>
          <p>{t("mobileApp.description")}</p>
        </div>

        <div className="mobile-app-section__showcase">
          <div
            className="mobile-app-section__phone-wrap"
            aria-label={t("mobileApp.previewAria")}
          >
            <div className="mobile-app-section__phone-frame">
              <div className="mobile-app-section__phone-screen">
                <img
                  alt={
                    currentTheme === "dark"
                      ? t("mobileApp.darkPreviewAlt")
                      : t("mobileApp.lightPreviewAlt")
                  }
                  className={`mobile-app-section__phone-image mobile-app-section__phone-image--${currentTheme}`}
                  src={activeImageSrc}
                />
              </div>
            </div>
          </div>

          <div className="mobile-app-section__feature-grid">
            {appFeatures.map((feature) => (
              <article
                className="mobile-app-section__feature-card"
                key={feature.id}
              >
                <div>
                  <Icon name={feature.icon} size={20} />
                </div>
                <h3>{t(`mobileApp.features.${feature.id}.title`)}</h3>
                <p>{t(`mobileApp.features.${feature.id}.description`)}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="mobile-app-section__download-strip">
          <div>
            <h3>{t("mobileApp.downloadTitle")}</h3>
            <p>{t("mobileApp.downloadDescription")}</p>
          </div>
          <div className="mobile-app-section__store-buttons">
            <a
              className="mobile-app-section__store-btn"
              href={APP_STORE_URL}
              rel="noopener noreferrer"
              target="_blank"
            >
              <Icon name="apple" size={28} />
              <span>
                {t("mobileApp.appStorePrefix")}
                <strong>{t("mobileApp.appStore")}</strong>
              </span>
            </a>
            <a
              className="mobile-app-section__store-btn"
              href={GOOGLE_PLAY_URL}
              rel="noopener noreferrer"
              target="_blank"
            >
              <Icon name="ticket" size={28} />
              <span>
                {t("mobileApp.googlePlayPrefix")}
                <strong>{t("mobileApp.googlePlay")}</strong>
              </span>
            </a>
          </div>
        </div>

        <div className="mobile-app-section__stats">
          <div>
            <strong>10,000+</strong>
            <span>{t("mobileApp.fairVisitors")}</span>
          </div>
          <div>
            <strong>4.8</strong>
            <span>{t("mobileApp.appRating")}</span>
          </div>
          <div>
            <strong>{t("mobileApp.free")}</strong>
            <span>{t("mobileApp.alwaysFree")}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
