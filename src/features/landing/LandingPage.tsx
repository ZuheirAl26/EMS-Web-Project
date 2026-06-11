import { BlogSection } from './components/BlogSection/BlogSection'
import { ExhibitionSection } from './components/ExhibitionSection/ExhibitionSection'
import { FeaturesSection } from './components/FeaturesSection/FeaturesSection'
import { FloorMapSection } from './components/FloorMapSection/FloorMapSection'
import { Footer } from './components/Footer/Footer'
import { HeroSection } from './components/HeroSection/HeroSection'
import { MobileAppSection } from './components/MobileAppSection/MobileAppSection'
import { PlanSection } from './components/PlanSection/PlanSection'
import { SiteNav } from './components/SiteNav/SiteNav'

export function LandingPage() {
  return (
    <>
      <SiteNav />
      <main>
        <HeroSection />
        <ExhibitionSection />
        <FloorMapSection />
        <PlanSection />
        <MobileAppSection />
        <FeaturesSection />
        <BlogSection />
      </main>
      <Footer />
    </>
  )
}
