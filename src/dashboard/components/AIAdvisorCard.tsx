import { Link } from "react-router-dom";
import { ArrowRight, BrainCircuit, MapPin } from "lucide-react";
import { AI_ADVISOR } from "../data/farmerDashboardData";

/** AI Advisor card — mock recommendation (not a live ML prediction). */
export default function AIAdvisorCard() {
  return (
    <section className="flex flex-col rounded-2xl border border-[#E1E5E1] bg-white p-5 shadow-[0_10px_30px_-18px_rgba(17,17,17,0.12)] sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid h-[42px] w-[42px] place-items-center rounded-2xl bg-[#EAF6EA] text-[#2E7D32]">
            <BrainCircuit className="h-[21px] w-[21px]" strokeWidth={2} />
          </span>
          <h2 className="font-display text-[16.5px] font-semibold text-[#111111]">AI Advisor</h2>
        </div>
        <span className="rounded-full border border-dashed border-[#2E7D32]/35 bg-[#EAF6EA]/70 px-3 py-1 text-[10.5px] font-semibold text-[#2E7D32] uppercase tracking-wide">
          Demo insight
        </span>
      </div>

      <span className="mt-5 w-fit rounded-full bg-[#EAF6EA] px-3.5 py-1.5 text-[12.5px] font-bold text-[#2E7D32]">
        {AI_ADVISOR.recommendation}
      </span>
      <p className="mt-3 text-[12.5px] leading-relaxed text-[#666666]">{AI_ADVISOR.description}</p>

      <dl className="mt-4 flex flex-col gap-3 border-t border-[#F0F3F0] pt-4 text-[12.5px]">
        <div className="flex items-baseline justify-between gap-3">
          <dt className="text-[#777777]">Predicted Price</dt>
          <dd className="font-semibold text-[#111111]">{AI_ADVISOR.predictedPrice}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-3">
          <dt className="text-[#777777]">Recommended Market</dt>
          <dd className="flex items-center gap-1.5 text-right font-semibold text-[#111111]">
            <MapPin className="h-3.5 w-3.5 text-[#2E7D32]" />
            {AI_ADVISOR.market}
            <span className="font-medium text-[#777777]">· {AI_ADVISOR.marketPrice}</span>
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-3">
          <dt className="text-[#777777]">Expected Net Return</dt>
          <dd className="font-display text-[15px] font-bold text-[#2E7D32]">{AI_ADVISOR.netReturn}</dd>
        </div>
      </dl>

      <div className="mt-auto pt-5">
        <Link
          to="/dashboard/ai-advisor"
          className="group inline-flex h-[44px] w-full items-center justify-center gap-2 rounded-xl border-[1.5px] border-[#2E7D32] text-[13.5px] font-semibold text-[#2E7D32] transition-all duration-200 hover:bg-[#2E7D32] hover:text-white"
        >
          View Full Analysis
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={2.4} />
        </Link>
        <p className="mt-3 text-[10.5px] text-[#999999]">Mock AI insight — not a live ML prediction.</p>
      </div>
    </section>
  );
}
