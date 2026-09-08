import { Link } from "react-router-dom";
import { ArrowRight, BrainCircuit } from "lucide-react";
import { BUYER_AI_ADVISOR } from "../data/buyerDashboardData";

/** AI Procurement Advisor — frontend mock, backend-ready props structure. */
export default function AIAdvisorCard() {
  return (
    <section className="flex flex-col rounded-2xl border border-[#BFE3C5] bg-[#F0FAF1] p-5 shadow-[0_10px_30px_-18px_rgba(46,125,50,0.25)] sm:p-6">
      <div className="flex items-center gap-3">
        <span className="grid h-[42px] w-[42px] place-items-center rounded-2xl bg-[#2E7D32] text-white">
          <BrainCircuit className="h-[21px] w-[21px]" strokeWidth={2} />
        </span>
        <h2 className="font-display text-[16.5px] font-semibold text-[#111111]">AI Procurement Advisor</h2>
      </div>

      <span className="mt-5 w-fit rounded-full bg-[#EAF6EA] px-3.5 py-1.5 text-[12.5px] font-bold text-[#2E7D32]">
        {BUYER_AI_ADVISOR.recommendation}
      </span>
      <p className="mt-3 text-[12.5px] leading-relaxed text-[#555555]">{BUYER_AI_ADVISOR.note}</p>

      <div className="mt-4 rounded-xl border border-[#2E7D32]/20 bg-white/70 px-4 py-3.5">
        <p className="text-[11px] font-medium text-[#777777]">{BUYER_AI_ADVISOR.rangeLabel}</p>
        <p className="mt-1 font-display text-[19px] leading-none font-bold text-[#155B32]">
          {BUYER_AI_ADVISOR.range}
        </p>
      </div>

      <div className="mt-auto pt-5">
        <Link
          to="/buyer/offers-negotiations"
          className="group inline-flex items-center gap-2 text-[13px] font-semibold text-[#2E7D32] transition-colors hover:text-[#155B32]"
        >
          View Detailed Analysis
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={2.4} />
        </Link>
        <p className="mt-2.5 text-[10.5px] text-[#8A938A]">Mock recommendation — ML service plugs in later.</p>
      </div>
    </section>
  );
}
