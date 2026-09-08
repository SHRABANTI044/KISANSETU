import { Sprout, Wheat } from "lucide-react";
import { BUYER_GREETING } from "../data/buyerDashboardData";

/** Wide welcome banner — agriculture-toned, with decorative field visual. */
export default function WelcomeBanner() {
  return (
    <section className="relative isolate overflow-hidden rounded-2xl border border-[#BFE3C5] bg-gradient-to-r from-[#F0FAF1] via-[#F0FAF1] to-[#EAF6EA] p-6 sm:p-7">
      {/* Decorative field shapes */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 w-1/2 opacity-70">
        <div className="absolute -right-12 top-0 h-44 w-44 rounded-full bg-[#2E7D32]/10" />
        <div className="absolute right-16 -bottom-10 h-32 w-32 rounded-full bg-[#2E7D32]/10" />
        <div className="absolute right-40 top-6 h-16 w-16 rounded-full bg-[#E8862D]/10" />
      </div>

      <div className="relative z-10 flex flex-wrap items-center justify-between gap-5">
        <div className="max-w-xl">
          <h1 className="font-display text-[24px] font-bold tracking-[-0.01em] text-[#155B32] sm:text-[28px]">
            {BUYER_GREETING.title} 👋
          </h1>
          <p className="mt-1.5 text-[13.5px] leading-relaxed text-[#4A6B52]">{BUYER_GREETING.subtitle}</p>
        </div>

        {/* Agri badge visual */}
        <div className="flex items-center gap-4 rounded-2xl border border-[#BFE3C5]/70 bg-white/70 px-5 py-3.5 backdrop-blur-sm">
          <span className="relative grid h-14 w-14 place-items-center">
            <Wheat className="h-8 w-8 text-[#2E7D32]" strokeWidth={1.8} />
            <Sprout className="absolute -bottom-1 -right-1 h-5 w-5 text-[#E8862D]" strokeWidth={2} />
          </span>
          <div className="font-display text-[14px] leading-snug font-bold text-[#155B32]">
            {BUYER_GREETING.badgeLine1}
            <br />
            {BUYER_GREETING.badgeLine2}
          </div>
        </div>
      </div>
    </section>
  );
}
