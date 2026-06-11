import { Button } from '../../../../components'
import './PlanSection.scss'

const planItems = [
  'A-03 Pavilion demo',
  'B-03 Product launch',
  'Startup Pitch Showcase',
  'Lead follow-up queue',
]

export function PlanSection() {
  return (
    <section className="plan-section" id="create-plan">
      <div className="plan-section__shell">
        <div className="plan-section__copy">
          <div>
            <p>Start your journey with us</p>
            <h2>Build Your Personal Section</h2>
          </div>
          <span>
            Manage your hall, schedule meetings, and get a personalized route
            through the halls. Scan a lead and manage your events.
          </span>
          <Button size="hero" variant="secondary">
            Create My Plan
          </Button>
        </div>
        <div className="plan-section__card">
          <h3>My Plan — TechConnect 2025</h3>
          <div className="plan-section__list">
            {planItems.map((item) => (
              <div className="plan-section__list-item" key={item}>
                <span>✓</span>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
