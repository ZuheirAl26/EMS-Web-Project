import { BlogSection } from "../component/BlogSection/BlogSection";
import { ExhibitionSection } from "../component/ExhibitionSection/ExhibitorSection";
import { FeaturesSection } from "../component/FeaturesSection/FeatureSection";
import { Footer } from "../component/Footer/Footer";
import { HeroSection } from "../component/HeroSection/HeroSection";
import { FloorMapSection } from "../component/MapSection/MapSection";
import { MobileAppSection } from "../component/MobileAppSection/MobileAppSection";
import { PlanSection } from "../component/PlanSection/PlanSection";
import { SiteNav } from "../component/SiteNav/SiteNav";
import "./LandingPage.scss";

export function LandingPage() {
  return (
    <div className="landing-page">
      <SiteNav />
      <main>
        <HeroSection />
        <ExhibitionSection />
        <MobileAppSection />
        <FloorMapSection />
        <PlanSection />
        <FeaturesSection />
        <BlogSection />
      </main>
      <Footer />
    </div>
  );
}
