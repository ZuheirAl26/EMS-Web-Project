import { useTranslation } from "react-i18next";
import { features } from "../../pages/landingData";
import { Icon } from "../Icon/Icon";
import "./FeatureSection.scss";

export function FeaturesSection() {
  const { t } = useTranslation("landing");

  return (
    <section className="features-section" id="features">
      <div className="features-section__shell">
        <div className="features-section__heading">
          <p>{t("features.eyebrow")}</p>
          <h2>{t("features.title")}</h2>
        </div>
        <div className="features-section__grid">
          {features.map((feature) => (
            <article className="features-section__card" key={feature.id}>
              <div>
                <Icon name={feature.icon} size={20} />
              </div>
              <h3>{t(`features.items.${feature.id}.title`)}</h3>
              <p>{t(`features.items.${feature.id}.description`)}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
