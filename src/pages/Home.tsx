import AboutSection from "../components/AboutSection";
import BuyersSection from "../components/BuyersSection";
import ContactSection from "../components/ContactSection";
import DashboardOverview from "../components/DashboardOverview";
import FeaturesSection from "../components/FeaturesSection";
import HeroSection from "../components/HeroSection";
import HowItWorks from "../components/HowItWorks";
import MarketPricesSection from "../components/MarketPricesSection";
import OrdersSection from "../components/OrdersSection";
import PriceSearch from "../components/PriceSearch";
import SmartFeatures from "../components/SmartFeatures";
import StatsSection from "../components/StatsSection";

export default function Home() {
  return (
    <>
      <HeroSection />

      {/* Search panel overlapping the bottom of the hero */}
      <div className="ks-container relative z-20 -mt-16">
        <div className="hero-item mx-auto max-w-[1060px]" style={{ animationDelay: "460ms" }}>
          <PriceSearch />
        </div>
      </div>

      <div className="mt-14 sm:mt-16">
        <StatsSection />
      </div>

      {/* Key highlights / feature overview */}
      <MarketPricesSection />
      <BuyersSection />

      {/* How KisanSetu Works → order tracking deep-dive */}
      <HowItWorks />
      <OrdersSection />

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
