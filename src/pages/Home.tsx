import AboutSection from "../components/AboutSection";
import ContactSection from "../components/ContactSection";
import DashboardOverview from "../components/DashboardOverview";
import FeaturesSection from "../components/FeaturesSection";
import HeroSection from "../components/HeroSection";
import HowItWorks from "../components/HowItWorks";
import SmartFeatures from "../components/SmartFeatures";
import StatsSection from "../components/StatsSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <div className="mt-4 sm:mt-6">
        <StatsSection />
      </div>

      {/* How KisanSetu Works → order tracking deep-dive */}
      <HowItWorks />

      {/* Platform features (farmer + buyer) with the value proposition */}
      <FeaturesSection />
      <DashboardOverview />

      {/* Smart / AI capabilities */}
      <SmartFeatures />

      {/* About + Contact */}
      <AboutSection />
      <ContactSection />
    </>
  );
}
