import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Sprout } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface PlaceholderPageProps {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description: string;
  points: string[];
}

/**
 * Polished placeholder used for modules that are still frontend stubs —
 * keeps navigation fully functional until each page is built out.
 */
export default function PlaceholderPage({
  icon: Icon,
  eyebrow,
  title,
  description,
  points,
}: PlaceholderPageProps) {
  return (
    <div className="bg-ks-bg pb-24">
      <section className="relative isolate overflow-hidden border-b border-ks-border/70 bg-white">
        <div
          aria-hidden="true"
          className="absolute -top-24 -right-24 h-[300px] w-[300px] rounded-full bg-ks-light blur-2xl"
        />
        <div className="ks-container relative flex min-h-[420px] flex-col items-center justify-center gap-6 py-16 pt-[150px] text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[13px] font-semibold text-ks-muted transition-colors hover:text-ks-green"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>

          <span className="grid h-[74px] w-[74px] place-items-center rounded-[22px] bg-ks-green text-white shadow-[0_18px_36px_-14px_rgba(22,128,60,0.6)]">
            <Icon className="h-[34px] w-[34px]" strokeWidth={1.9} />
          </span>

          <div>
            <span className="eyebrow">{eyebrow}</span>
            <h1 className="mt-4 font-display text-[30px] font-bold text-ks-dark sm:text-[38px]">
              {title}
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-[15px] leading-[1.7] text-ks-muted sm:text-[16px]">
              {description}
            </p>
          </div>

          <ul className="flex flex-wrap items-center justify-center gap-2.5">
            {points.map((point) => (
              <li
                key={point}
                className="inline-flex items-center gap-2 rounded-full border border-ks-border bg-ks-bg px-4 py-2 text-[13px] font-medium text-[#37433a]"
              >
                <Check className="h-3.5 w-3.5 text-ks-green" strokeWidth={3} />
                {point}
              </li>
            ))}
          </ul>

          <div className="mt-2 flex flex-col items-center gap-3 sm:flex-row">
            <Link
              to="/register"
              className="group inline-flex h-[50px] items-center gap-2.5 rounded-full bg-ks-green px-8 text-[15px] font-semibold text-white shadow-[0_12px_26px_-12px_rgba(22,128,60,0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-ks-dark"
            >
              Get Started Free
              <ArrowRight className="h-[17px] w-[17px] transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2.4} />
            </Link>
            <span className="inline-flex items-center gap-2 text-[12.5px] text-ks-muted/80">
              <Sprout className="h-4 w-4 text-ks-green" />
              Module preview — full experience is on the roadmap
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
