import {
  ClipboardList,
  PackageCheck,
  Scale,
  SearchCheck,
  ShieldCheck,
  UserSearch,
} from "lucide-react";
import FeatureCard, { FeatureSubHeader } from "./FeatureCard";

const BUYER_CARDS = [
  {
    icon: SearchCheck,
    title: "Find Quality Produce",
    desc: "Search and discover agricultural produce listed by farmers based on crop, quantity and quality.",
  },
  {
    icon: ClipboardList,
    title: "Post Requirements",
    desc: "Tell farmers what crop, quantity, quality and price range you need.",
  },
  {
    icon: UserSearch,
    title: "Connect With Farmers",
    desc: "Discover suitable farmers and connect with them for potential agricultural deals.",
  },
  {
    icon: Scale,
    title: "Compare Offers",
    desc: "Compare available produce, prices, quantities and locations before making a decision.",
  },
  {
    icon: PackageCheck,
    title: "Manage Orders",
    desc: "Track confirmed deals, order status, delivery progress and payment information.",
  },
  {
    icon: ShieldCheck,
    title: "Transparent Transactions",
    desc: "Keep important deal and order information organized in one place for greater transparency.",
  },
];

export default function BuyerFeatures() {
  return (
    <div aria-label="Features for buyers">
      <FeatureSubHeader
        tag="For Buyers"
        title="Features for Buyers"
        subtitle="Find the right produce and connect directly with suitable farmers."
      />

      <div className="mt-10 grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {BUYER_CARDS.map((card, i) => (
          <FeatureCard
            key={card.title}
            icon={card.icon}
            title={card.title}
            desc={card.desc}
            delay={(i % 3) * 70}
          />
        ))}
      </div>
    </div>
  );
}
