import { useTranslation } from "react-i18next";
import { Button } from "../../../../components";
import { metrics } from "../../pages/landingData";
import "./ExhibitorSection.scss";

export function ExhibitionSection() {
  const { t } = useTranslation("landing");

  return (
    <section className="exhibition-section" id="exhibition">
      <div className="exhibition-section__shell">
        <div className="exhibition-section__copy">
          <div>
            <p className="exhibition-section__kicker">
              {t("exhibition.eyebrow")}
            </p>
            <h2>{t("exhibition.title")}</h2>
          </div>
          <p className="exhibition-section__text">
            {t("exhibition.description")}
          </p>
          <div className="exhibition-section__metric-grid">
            {metrics.map((metric) => (
              <div className="exhibition-section__metric-card" key={metric.id}>
                <strong>{metric.value}</strong>
                <span>{t(`exhibition.metrics.${metric.id}`)}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="exhibition-section__showcase-card">
          <div className="exhibition-section__showcase-stage">
            <div className="exhibition-section__showcase-header">
              <span className="exhibition-section__pill">
                {t("exhibition.schedule")}
              </span>
              <strong>{t("exhibition.hallCount")}</strong>
            </div>
            <div className="exhibition-section__timeline">
              <div className="exhibition-section__timeline-item">
                <span>09:00</span>
                <div>
                  <h3>{t("exhibition.events.keynote.title")}</h3>
                  <p>{t("exhibition.events.keynote.description")}</p>
                </div>
              </div>
              <div className="exhibition-section__timeline-item">
                <span>13:30</span>
                <div>
                  <h3>{t("exhibition.events.pitch.title")}</h3>
                  <p>{t("exhibition.events.pitch.description")}</p>
                </div>
              </div>
              <div className="exhibition-section__timeline-item">
                <span>16:00</span>
                <div>
                  <h3>{t("exhibition.events.networking.title")}</h3>
                  <p>{t("exhibition.events.networking.description")}</p>
                </div>
              </div>
            </div>
            <Button>{t("exhibition.viewSchedule")}</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
