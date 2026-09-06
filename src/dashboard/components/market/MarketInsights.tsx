import { Clock, FileText, MapPin, PackageCheck, Route, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { getInsights } from "../../data/marketPrices";

const ICONS: Record<string, LucideIcon> = {
  trend: TrendingUp,
  market: MapPin,
  clock: Clock,
  store: PackageCheck,
  route: Route,
};

export default function MarketInsights({ cropLabel, weeklyChange }: { cropLabel: string; weeklyChange: number }) {
  const insights = getInsights(cropLabel, weeklyChange);

  return (
    <section className="rounded-2xl border border-[#D8E4F0] bg-[#F3F8FD] p-5 shadow-[0_10px_30px_-18px_rgba(25,80,130,0.18)] sm:p-6">
      <div className="flex items-center gap-3">
        <span className="grid h-[42px] w-[42px] place-items-center rounded-2xl bg-[#DCEAF7] text-[#1D6FB8]">
          <FileText className="h-[20px] w-[20px]" strokeWidth={2} />
        </span>
        <h2 className="font-display text-[16.5px] font-semibold text-[#111111]">Market Insights</h2>
      </div>

      <ul className="mt-5 flex flex-col gap-3.5">
        {insights.map((item) => {
          const Icon = ICONS[item.icon] ?? TrendingUp;
          return (
            <li key={item.text} className="flex items-start gap-2.5">
              <span className="mt-[1px] grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full bg-white/80 text-[#1D6FB8] ring-1 ring-[#D8E4F0]">
                <Icon className="h-3 w-3" strokeWidth={2.4} />
              </span>
              <span className="text-[12.5px] leading-relaxed font-medium text-[#3D4E63]">{item.text}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
