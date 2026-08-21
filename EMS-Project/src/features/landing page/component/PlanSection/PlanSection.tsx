import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "../../../../components";
import "./PlanSection.scss";

const planItems = [
  "booth",
  "launch",
  "showcase",
  "followUp",
] as const;

export function PlanSection() {
  const { t } = useTranslation("landing");

  return (
    <section className="plan-section" id="plan">
      <div className="plan-section__shell">
        <div className="plan-section__copy">
          <div>
            <p>{t("plan.eyebrow")}</p>
            <h2>{t("plan.title")}</h2>
          </div>
          <span>{t("plan.description")}</span>
          <Link to="/register" style={{ textDecoration: "none", width: "fit-content" }}>
            <Button size="hero" variant="secondary">
              {t("plan.button")}
            </Button>
          </Link>
        </div>
        <div className="plan-section__card">
          <h3>{t("plan.cardTitle")}</h3>
          <div className="plan-section__list">
            {planItems.map((item) => (
              <div className="plan-section__list-item" key={item}>
                <span>{t("plan.checkmark")}</span>
                {t(`plan.items.${item}`)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
