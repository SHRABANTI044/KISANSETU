import { Calculator, CalendarClock, MapPinned, UserCheck } from "lucide-react";
import BuyerFeatures from "./BuyerFeatures";
import FarmerFeatures from "./FarmerFeatures";
import OrdersSection from "../components/OrdersSection";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

/** The four questions behind every selling decision on KisanSetu. */
const VALUE_PROPS = [
  {
    key: "Where",
    icon: MapPinned,
    title: "Better Market",
    desc: "Which market may provide a better expected return?",
  },
  {
    key: "When",
    icon: CalendarClock,
    title: "Better Timing",
    desc: "When may be a better time to sell based on price trends and predictions?",
  },
  {
    key: "To Whom",
    icon: UserCheck,
    title: "Suitable Buyer",
    desc: "Which buyer may be suitable for my produce?",
  },
  {
    key: "How Much",
    icon: Calculator,
    title: "Expected Net Return",
    desc: "What could be the expected net return after estimated transportation and other costs?",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" aria-label="KisanSetu features" className="py-20 sm:py-24">
      <div className="ks-container">
        <Reveal>
          <SectionHeading
            eyebrow="Platform Capabilities"
            title="Features"
            description="What can you actually do on KisanSetu? Explore the tools the Farmer and Buyer dashboards provide — from market intelligence to transparent deal tracking."
          />
        </Reveal>

        {/* Value proposition: Where / When / To Whom / How Much */}
        <Reveal delay={100} className="mt-14">
          <div className="rounded-[30px] border border-ks-border bg-ks-bg p-7 sm:p-10">
            <div className="flex flex-col items-center gap-3 text-center">
              <span className="eyebrow">Why KisanSetu</span>
              <h3 className="max-w-xl font-display text-[24px] leading-tight font-bold tracking-[-0.01em] text-ks-dark sm:text-[28px]">
                From Produce to Better Decisions
              </h3>
              <p className="max-w-xl text-[14.5px] leading-relaxed text-ks-muted">
                Four questions every farmer asks before selling — and how KisanSetu helps answer
                each one.
              </p>
            </div>

            <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {VALUE_PROPS.map((tile) => (
                <div
                  key={tile.title}
                  className="group rounded-[22px] border border-ks-border bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-ks-green/40 hover:shadow-card"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="rounded-full bg-ks-green px-3 py-1.5 text-[10.5px] font-bold tracking-[0.14em] text-white uppercase">
                      {tile.key}
                    </span>
                    <span className="grid h-[44px] w-[44px] place-items-center rounded-xl bg-ks-light text-ks-green transition-colors duration-300 group-hover:bg-ks-green group-hover:text-white">
                      <tile.icon className="h-[21px] w-[21px]" strokeWidth={2} />
                    </span>
                  </div>
                  <h4 className="mt-5 font-display text-[15.5px] font-semibold text-ks-dark">
                    {tile.title}
                  </h4>
                  <p className="mt-1.5 text-[12.5px] leading-relaxed text-ks-muted">{tile.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <div className="mt-16 sm:mt-20">
          <FarmerFeatures />
        </div>
        <div className="mt-16 sm:mt-20">
          <BuyerFeatures />
        </div>
        <div className="mt-16 sm:mt-20">
          <OrdersSection />
        </div>
      </div>
    </section>
  );
}
