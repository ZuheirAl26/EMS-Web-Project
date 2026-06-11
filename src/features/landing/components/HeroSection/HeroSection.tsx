import { Button } from '../../../../components'
import { FloorMapPreview } from '../FloorMapPreview/FloorMapPreview'
import { Icon } from '../Icon/Icon'
import './HeroSection.scss'

export function HeroSection() {
  return (
    <section className="hero-section" id="home">
      <div className="hero-section__shell">
        <div className="hero-section__copy">
          <h1>Your Complete Exhibition Management Platform</h1>
          <p>
            Manage pavilions, capture leads, coordinate your team, and delight
            your visitors, all from one powerful portal.
          </p>
          <div className="hero-section__actions">
            <Button size="hero" variant="secondary">
              Explore the Floor Map
            </Button>
            <Button size="hero">Register as Exhibitor</Button>
          </div>
          <div className="hero-section__stats">
            <span className="hero-section__stat">
              <Icon name="star" size={16} />
              500+ Exhibitors
            </span>
            <span className="hero-section__stat-dot" />
            <span className="hero-section__stat">
              <Icon name="users" size={16} />
              12,000+ Visitors
            </span>
            <span className="hero-section__stat-dot" />
            <span className="hero-section__stat">
              <Icon name="map" size={16} />
              3 Event Halls
            </span>
          </div>
        </div>
        <div className="hero-section__map-card">
          <FloorMapPreview />
        </div>
      </div>
    </section>
  )
}
