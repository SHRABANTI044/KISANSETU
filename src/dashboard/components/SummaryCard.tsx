import type { SummaryMetric } from "../data/farmerDashboardData";
import { cn } from "../../utils/cn";

export default function SummaryCard({ metric }: { metric: SummaryMetric }) {
  return (
    <article className="rounded-2xl border border-[#E1E5E1] bg-white p-5 shadow-[0_10px_30px_-18px_rgba(17,17,17,0.12)] transition-shadow duration-300 hover:shadow-[0_16px_40px_-18px_rgba(17,17,17,0.18)]">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[12.5px] font-medium text-[#666666]">{metric.label}</p>
        <span className="grid h-[38px] w-[38px] shrink-0 place-items-center rounded-full bg-[#EAF6EA] text-[#2E7D32]">
          <metric.icon className="h-[18px] w-[18px]" strokeWidth={2.1} />
        </span>
      </div>
      <p className="mt-3 font-display text-[24px] leading-none font-bold text-[#111111]">
        {metric.value}
      </p>
      <p
        className={cn(
          "mt-2 text-[11.5px] font-semibold",
          metric.trend === "up" ? "text-[#2E7D32]" : "text-[#8A938A]"
        )}
      >
        {metric.supporting}
      </p>
    </article>
  );
}
