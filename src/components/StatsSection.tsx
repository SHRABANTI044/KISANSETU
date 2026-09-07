import { STATS } from "../data/site";
import { cn } from "../utils/cn";
import Reveal from "./Reveal";

/**
 * Horizontal statistics panel directly under the hero/search overlap.
 * Figures are illustrative showcase numbers (not live production data).
 */
export default function StatsSection() {
  return (
    <section aria-label="Community statistics" className="relative z-10 pb-6">
      <div className="ks-container">
        <Reveal>
          <div className="rounded-[26px] border border-ks-border/70 bg-white py-2 shadow-card sm:rounded-[30px] sm:py-4">
            <dl className="grid grid-cols-2 lg:grid-cols-5">
              {STATS.map((stat, i) => (
                <div
                  key={stat.label}
                  className={cn(
                    "flex flex-col items-center gap-3 border-ks-border/70 px-4 py-7 text-center sm:px-6 lg:py-9",
                    i % 2 === 1 && "border-l",
                    i >= 2 && "border-t lg:border-t-0",
                    i === 4 && "col-span-2 lg:col-span-1",
                    i > 0 && "lg:border-l"
                  )}
                >
                  <span className="order-1 grid h-[56px] w-[56px] place-items-center rounded-full bg-ks-green text-white shadow-[0_12px_22px_-10px_rgba(22,128,60,0.55)] sm:h-[60px] sm:w-[60px]">
                    <stat.icon className="h-[24px] w-[24px] sm:h-[26px] sm:w-[26px]" strokeWidth={2.1} />
                  </span>
                  <dd className="order-2 font-display text-[28px] leading-none font-bold text-ks-dark sm:text-[33px]">
                    {stat.value}
                  </dd>
                  <dt className="order-3 text-[12.5px] font-medium text-ks-muted sm:text-[13.5px]">
                    {stat.label}
                  </dt>
                </div>
              ))}
            </dl>
          </div>
          <p className="mt-4 text-center text-[11.5px] text-ks-muted/70">
            Illustrative figures shown for product demonstration.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
