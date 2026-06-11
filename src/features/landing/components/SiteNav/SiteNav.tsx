import { Button } from '../../../../components'
import { navLinks } from '../../landingData'
import { LogoMark } from '../LogoMark/LogoMark'
import './SiteNav.scss'

export function SiteNav() {
  return (
    <header className="site-nav">
      <div className="site-nav__inner">
        <a className="site-nav__brand" href="#home">
          <LogoMark />
          <span className="site-nav__brand-name">Damascus International Fair</span>
        </a>
        <nav className="site-nav__links" aria-label="Main navigation">
          {navLinks.map((link) => (
            <a
              className="site-nav__link"
              href={`#${link.toLowerCase().replaceAll(' ', '-')}`}
              key={link}
            >
              {link}
            </a>
          ))}
        </nav>
        <div className="site-nav__actions">
          <Button variant="ghost">Log In</Button>
          <Button>Get Started</Button>
        </div>
      </div>
    </header>
  )
}
