import {
  ArrowLeftRight,
  BrainCircuit,
  ChartColumn,
  Handshake,
  MapPinned,
  Users,
  Wheat,
} from "lucide-react";
import FeatureCard, { FeatureSubHeader } from "./FeatureCard";

/** Simple match preview shown inside the Smart Buyer Matching card. */
function MatchPreview() {
  return (
    <div className="mt-4 rounded-2xl border border-ks-border/80 bg-ks-bg p-3.5">
      <div className="flex items-center gap-2">
        <span className="flex-1 rounded-lg bg-white px-2 py-2 text-center text-[11.5px] font-semibold text-ks-text ring-1 ring-ks-border">
          Your Onion · 40q
        </span>
        <ArrowLeftRight className="h-4 w-4 shrink-0 text-ks-green" aria-hidden="true" />
        <span className="flex-1 rounded-lg bg-white px-2 py-2 text-center text-[11.5px] font-semibold text-ks-text ring-1 ring-ks-border">
          Buyer · Nashik
        </span>
      </div>
      <p className="mt-2.5 flex items-center justify-center gap-1.5 text-[11.5px] font-semibold text-ks-green">
        <span className="h-1.5 w-1.5 rounded-full bg-ks-green" aria-hidden="true" />
        92% requirement match
      </p>
    </div>
  );
}

export default function FarmerFeatures() {
  return (
    <div aria-label="Features for farmers">
      <FeatureSubHeader
        tag="For Farmers"
        title="Features for Farmers"
        subtitle="Everything a farmer needs to make better selling decisions and connect with the right market."
      />

      <div className="mt-10 grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        <FeatureCard
          icon={ChartColumn}
          title="Market Prices & Trends"
          desc="Check current market prices and understand price trends across different markets."
          points={["Current market prices", "Market comparison", "Historical trends", "Price movement"]}
          note="Sample data until live mandi feeds are connected."
          delay={0}
        />
        <FeatureCard
          icon={BrainCircuit}
          title="AI Price Prediction"
          desc="Get estimated future market prices using historical agricultural market data and machine learning."
          points={["Historical price analysis", "Predicted market price", "Price trend indication", "Data-driven selling decisions"]}
          note="Predictions are estimates — not guaranteed future prices."
          delay={70}
        />
        <FeatureCard
          icon={MapPinned}
          title="Smart Market Recommendation"
          desc="Find potentially better markets by comparing expected prices, distance and estimated transportation costs."
          points={["Market comparison", "Distance consideration", "Transport cost estimation", "Expected net return"]}
          chip="Where should I sell?"
          delay={140}
        />
        <FeatureCard
          icon={Users}
          title="Connect With Buyers"
          desc="Discover suitable buyers based on your crop, quantity, location and selling requirements."
          points={["Buyer discovery", "Buyer requirements", "Crop matching", "Direct connection"]}
          chip="To whom should I sell?"
          delay={0}
        />
        <FeatureCard
          icon={Wheat}
          title="Sell Your Produce"
          desc="List your agricultural produce with quantity, quality, expected price and availability."
          points={["Add produce", "Set quantity", "Add quality details", "Set expected price", "Manage listings"]}
          delay={70}
        />
        <FeatureCard
          icon={Handshake}
          title="Smart Buyer Matching"
          desc="Match your produce with buyers whose requirements are suitable for your crop, quantity, location and price."
          note="Simple rule-based matching — advanced ML recommendations come later."
          delay={140}
        >
          <MatchPreview />
        </FeatureCard>
      </div>
    </div>
  );
}
