import { BUYER_SUMMARY_STATS, TONE_STYLES } from "../data/buyerDashboardData";
import { cn } from "../../utils/cn";

export default function SummaryCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {BUYER_SUMMARY_STATS.map((stat) => (
        <article
          key={stat.id}
          className="rounded-2xl border border-[#E1E5E1] bg-white p-5 shadow-[0_10px_30px_-18px_rgba(17,17,17,0.12)] transition-shadow duration-300 hover:shadow-[0_16px_40px_-18px_rgba(17,17,17,0.18)]"
        >
          <div className="flex items-start justify-between gap-3">
            <p className="text-[12.5px] font-medium text-[#666666]">{stat.label}</p>
            <span className={cn("grid h-[38px] w-[38px] shrink-0 place-items-center rounded-full", TONE_STYLES[stat.tone])}>
              <stat.icon className="h-[18px] w-[18px]" strokeWidth={2.1} />
            </span>
          </div>
          <p className="mt-3 font-display text-[24px] leading-none font-bold text-[#111111]">
            {stat.value}
          </p>
          <p
            className={cn(
              "mt-2 text-[11.5px] font-semibold",
              stat.supporting.startsWith("↑") ? "text-[#2E7D32]" : "text-[#8A938A]"
            )}
          >
            {stat.supporting}
          </p>
        </article>
      ))}
    </div>
  );
}
