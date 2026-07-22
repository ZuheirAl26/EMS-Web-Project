import { Button } from "../../../../components";
import { halls } from "../../pages/landingData";
import "./FloorMapSection.scss";

export function FloorMapSection() {
  return (
    <section className="floor-map-section" id="floor-map">
      <div className="floor-map-section__shell">
        <div className="floor-map-section__heading">
          <p>Floor Plan</p>
          <h2>Explore the Exhibition Halls</h2>
          <span>
            Click any pavilion to preview their profile, products, and team.
          </span>
        </div>
        <div className="floor-map-section__map-shell">
          <div className="floor-map-section__toolbar">
            <h3>Damascus International Fair Floor Map</h3>
            <Button variant="secondary">Full Screen Map</Button>
          </div>
          <div className="floor-map-section__map">
            {halls.map(([title, ...booths], hallIndex) => (
              <div className="floor-map-section__hall" key={title}>
                <div className="floor-map-section__hall-title">{title}</div>
                {booths.map((booth, boothIndex) => {
                  const active = ["A-03", "A-07"].includes(booth);
                  const premium = booth === "B-03";
                  const accent = hallIndex === 1 && boothIndex > 5;
                  const className = [
                    "floor-map-section__booth",
                    active ? "floor-map-section__booth--active" : "",
                    premium ? "floor-map-section__booth--premium" : "",
                    accent ? "floor-map-section__booth--accent" : "",
                  ]
                    .filter(Boolean)
                    .join(" ");

                  return (
                    <button className={className} key={booth} type="button">
                      {booth}
                    </button>
                  );
                })}
              </div>
            ))}
            <div className="floor-map-section__aisle">Main Aisle</div>
          </div>
        </div>
      </div>
    </section>
  );
}
