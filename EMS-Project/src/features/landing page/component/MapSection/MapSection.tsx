import { useTranslation } from "react-i18next";
import exhibitionMap from "../../../../assets/map.png";
import "./MapSection.scss";

export function FloorMapSection() {
  const { t } = useTranslation("landing");

  return (
    <section className="floor-map-section" id="floor-map">
      <div className="floor-map-section__shell">
        <div className="floor-map-section__heading">
          <p>{t("floorMap.eyebrow")}</p>
          <h2>{t("floorMap.title")}</h2>
          <span>{t("floorMap.description")}</span>
        </div>
        <div className="floor-map-section__map-shell">
          <div
            aria-label={t("floorMap.mapTitle")}
            className="floor-map-section__canvas"
            role="region"
          >
            <img
              alt={t("floorMap.mapAlt")}
              className="floor-map-section__image"
              src={exhibitionMap}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
