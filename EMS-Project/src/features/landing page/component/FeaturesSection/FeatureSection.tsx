import { features } from "../../pages/landingData";
import { Icon } from "../Icon/Icon";
import "./FeaturesSection.scss";

export function FeaturesSection() {
  return (
    <section className="features-section" id="features">
      <div className="features-section__shell">
        <div className="features-section__heading">
          <p>Platform Features</p>
          <h2>Everything You Need to Run a World-Class Exhibition</h2>
        </div>
        <div className="features-section__grid">
          {features.map((feature) => (
            <article className="features-section__card" key={feature.title}>
              <div>
                <Icon name={feature.icon} size={20} />
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
