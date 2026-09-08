import { ORDER_STAGES } from "../data/site";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

export default function OrdersSection() {
    return (
    <div id="orders">
        <Reveal>
          <SectionHeading
            eyebrow="End-to-End Tracking"
            title="Track Orders & Payments"
            description="Once a farmer and buyer agree on a deal, the order moves through clear, trackable stages — from listing to final payment."
          />
        </Reveal>

        <Reveal delay={120} className="mt-14">
          <ol
            className="relative flex flex-col gap-9 lg:flex-row lg:gap-0"
            aria-label="Order stages"
          >
            {/* connectors */}
            <span
              aria-hidden="true"
              className="absolute top-9 bottom-9 left-[27px] border-l-2 border-dashed border-ks-green/30 lg:hidden"
            />
            <span
              aria-hidden="true"
              className="absolute top-[27px] right-[9%] left-[9%] hidden border-t-2 border-dashed border-ks-green/30 lg:block"
            />

            {ORDER_STAGES.map((stage, i) => (
              <li
                key={stage.title}
                className="relative flex items-start gap-5 lg:flex-1 lg:flex-col lg:items-center lg:px-4 lg:text-center"
              >
                <span className="relative z-10 grid h-[56px] w-[56px] shrink-0 place-items-center rounded-full bg-ks-green text-white shadow-[0_14px_26px_-12px_rgba(22,128,60,0.6)] ring-4 ring-ks-light">
                  <stage.icon className="h-[24px] w-[24px]" strokeWidth={2} />
                </span>
                <div className="pt-1 lg:pt-0">
                  <p className="text-[11px] font-bold tracking-[0.14em] text-ks-green/60 uppercase lg:mt-4">
                    Step {i + 1}
                  </p>
                  <h3 className="mt-1 font-display text-[15.5px] font-semibold text-ks-dark">
                    {stage.title}
                  </h3>
                  <p className="mt-1 max-w-[240px] text-[12.5px] leading-relaxed text-ks-muted lg:mx-auto">
                    {stage.desc}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
  );
}
