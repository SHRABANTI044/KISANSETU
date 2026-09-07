import { Link } from "react-router-dom";
import { ArrowRight, Check, TrendingDown, TrendingUp } from "lucide-react";
import { MARKET_PRICE_POINTS, PRICE_ROWS, PRICE_SPARK } from "../data/site";
import { cn } from "../utils/cn";
import mandiImg from "../assets/images/mandi-market.jpg";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

/** Small inline SVG sparkline for the demo trend card. */
function Sparkline({ points }: { points: number[] }) {
  const w = 132;
  const h = 46;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const step = w / (points.length - 1);
  const coords = points.map((p, i) => [i * step, h - 6 - ((p - min) / (max - min)) * (h - 14)] as const);
  const line = coords.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-[46px] w-[132px]" aria-hidden="true">
      <polygon points={`0,${h} ${line} ${w},${h}`} fill="rgba(22,128,60,0.10)" />
      <polyline
        points={line}
        fill="none"
        stroke="#16803C"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx={coords[coords.length - 1]![0]}
        cy={coords[coords.length - 1]![1]}
        r="3.4"
        fill="#16803C"
        stroke="#fff"
        strokeWidth="1.6"
      />
    </svg>
  );
}

export default function MarketPricesSection() {
  return (
    <section id="market-prices" aria-label="Market prices and trends" className="py-20 sm:py-24">
      <div className="ks-container grid items-center gap-14 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16">
        {/* Copy */}
        <Reveal>
          <SectionHeading
            align="left"
            eyebrow="Market Intelligence"
            title="Market Prices & Trends"
            description="Know what your produce is worth before you sell. KisanSetu brings mandi prices, market comparisons and trend signals into one simple view — so you can decide when and where to sell."
          />
          <ul className="mt-7 flex flex-col gap-3.5">
            {MARKET_PRICE_POINTS.map((point) => (
              <li key={point} className="flex items-start gap-3">
                <span className="mt-[3px] grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full bg-ks-light text-ks-green">
                  <Check className="h-[13px] w-[13px]" strokeWidth={3} />
                </span>
                <span className="text-[14.5px] leading-relaxed font-medium text-[#37433a] sm:text-[15.5px]">
                  {point}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to="/market-prices"
              className="group inline-flex h-[50px] items-center gap-2.5 rounded-full bg-ks-green px-7 text-[15px] font-semibold text-white shadow-[0_12px_26px_-12px_rgba(22,128,60,0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-ks-dark"
            >
              Explore Market Prices
              <ArrowRight className="h-[17px] w-[17px] transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2.4} />
            </Link>
            <span className="inline-flex items-center rounded-full border border-dashed border-ks-green/35 bg-ks-light/70 px-4 py-2 text-[12px] font-medium text-ks-dark/80">
              Demo data shown — live mandi feeds plug in later
            </span>
          </div>
        </Reveal>

        {/* Visual: mandi image + demo price card */}
        <Reveal delay={140}>
          <div className="overflow-hidden rounded-[26px] border border-ks-border bg-white shadow-card">
            <div className="relative">
              <img
                src={mandiImg}
                alt="Fresh vegetables stacked at an Indian wholesale mandi"
                className="h-[190px] w-full object-cover sm:h-[215px]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" aria-hidden="true" />
              <span className="absolute top-4 right-4 rounded-full bg-white/95 px-3.5 py-1.5 text-[11px] font-semibold tracking-wide text-ks-dark uppercase shadow">
                Demo data
              </span>
              <div className="absolute bottom-4 left-5 flex items-end gap-2 text-white">
                <span className="font-display text-[30px] leading-none font-bold">₹1,850</span>
                <span className="pb-[2px] text-[12.5px] text-white/85">Onion / quintal · Lasalgaon</span>
              </div>
            </div>

            <div className="p-5 sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-display text-[16.5px] font-semibold text-ks-dark">
                    Today&apos;s Mandi Prices
                  </h3>
                  <p className="mt-0.5 text-[12px] text-ks-muted">per quintal · sample markets</p>
                </div>
                <div className="text-right">
                  <Sparkline points={PRICE_SPARK} />
                  <p className="mt-1 text-[11px] font-medium text-ks-muted">Onion · last 10 days</p>
                </div>
              </div>

              <ul className="mt-4 divide-y divide-ks-border/70">
                {PRICE_ROWS.map((row) => (
                  <li key={row.crop} className="flex items-center gap-3 py-3">
                    <span className={cn("h-2.5 w-2.5 shrink-0 rounded-full", row.dot)} aria-hidden="true" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[14px] leading-tight font-semibold text-ks-text">{row.crop}</p>
                      <p className="truncate text-[12px] text-ks-muted">{row.market}</p>
                    </div>
                    <p className="font-display text-[15.5px] font-semibold whitespace-nowrap text-ks-dark">
                      {row.price}
                      <span className="font-sans text-[11.5px] font-medium text-ks-muted">{row.unit}</span>
                    </p>
                    <span
                      className={cn(
                        "inline-flex w-[74px] items-center justify-center gap-1 rounded-full px-2 py-1 text-[11.5px] font-semibold",
                        row.up ? "bg-ks-light text-ks-green" : "bg-red-50 text-red-600"
                      )}
                    >
                      {row.up ? (
                        <TrendingUp className="h-3 w-3" strokeWidth={2.6} />
                      ) : (
                        <TrendingDown className="h-3 w-3" strokeWidth={2.6} />
                      )}
                      {row.change}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
