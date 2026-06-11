import { Button } from '../../../../components'
import { metrics } from '../../landingData'
import './ExhibitionSection.scss'

export function ExhibitionSection() {
  return (
    <section className="exhibition-section" id="exhibition">
      <div className="exhibition-section__shell">
        <div className="exhibition-section__copy">
          <div>
            <p className="exhibition-section__kicker">About the Exhibition</p>
            <h2>TechConnect Expo 2025</h2>
          </div>
          <p className="exhibition-section__text">
            TechConnect Expo 2025 is the premier technology trade show for
            enterprise software, industrial IoT, and AI-powered solutions.
            Bringing together 500+ exhibitors and 12,000+ industry professionals
            across 3 dedicated halls.
          </p>
          <div className="exhibition-section__metric-grid">
            {metrics.map(([value, label]) => (
              <div className="exhibition-section__metric-card" key={label}>
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="exhibition-section__showcase-card">
          <div className="exhibition-section__showcase-stage">
            <div className="exhibition-section__showcase-header">
              <span className="exhibition-section__pill">Event Schedule</span>
              <strong>3 Halls</strong>
            </div>
            <div className="exhibition-section__timeline">
              <div className="exhibition-section__timeline-item">
                <span>09:00</span>
                <div>
                  <h3>Opening Keynote</h3>
                  <p>Enterprise innovation and AI-powered operations.</p>
                </div>
              </div>
              <div className="exhibition-section__timeline-item">
                <span>13:30</span>
                <div>
                  <h3>Startup Pitch Showcase</h3>
                  <p>New ventures present products to buyers and partners.</p>
                </div>
              </div>
              <div className="exhibition-section__timeline-item">
                <span>16:00</span>
                <div>
                  <h3>Networking Session</h3>
                  <p>Connect with exhibitors, visitors, and event teams.</p>
                </div>
              </div>
            </div>
            <Button>View Event Schedule</Button>
          </div>
        </div>
      </div>
    </section>
  )
}
