import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChevronDown, Info } from "lucide-react";
import { MARKET_TREND_INFO, PRICE_RANGES, PRICE_SERIES } from "../data/buyerDashboardData";
import { cn } from "../../utils/cn";

type RangeKey = keyof typeof PRICE_SERIES;

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: { value?: number }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-[#E1E5E1] bg-white px-3.5 py-2.5 shadow-[0_12px_30px_-12px_rgba(17,17,17,0.25)]">
      <p className="text-[11px] font-medium text-[#777777]">{label}</p>
      <p className="mt-0.5 font-display text-[14px] font-bold text-[#155B32]">
        ₹{payload[0]!.value?.toLocaleString("en-IN")}
        <span className="ml-1 font-sans text-[11px] font-medium text-[#777777]">/quintal</span>
      </p>
    </div>
  );
}

/** Market Price Trend card with working 7/15/30-day range switching (mock data). */
export default function PriceTrendChart() {
  const [range, setRange] = useState<RangeKey>("7d");
  const series = PRICE_SERIES[range];

  return (
    <section className="flex flex-col rounded-2xl border border-[#E1E5E1] bg-white p-5 shadow-[0_10px_30px_-18px_rgba(17,17,17,0.12)] sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-2 font-display text-[16.5px] font-semibold text-[#111111]">
            Market Price Trend
            <span className="group relative">
              <Info className="h-4 w-4 cursor-help text-[#B9BFB9] transition-colors hover:text-[#2E7D32]" aria-label="Demo data information" />
              <span className="pointer-events-none absolute top-6 left-1/2 z-20 hidden w-56 -translate-x-1/2 rounded-xl border border-[#E1E5E1] bg-white p-3 text-[11px] font-medium leading-relaxed text-[#666666] shadow-panel group-hover:block">
                Demo dataset — will be connected to the market_prices table.
              </span>
            </span>
          </h2>
          <p className="mt-0.5 text-[12.5px] text-[#777777]">{MARKET_TREND_INFO.crop}</p>
        </div>

        <div className="relative">
          <select
            aria-label="Select time range"
            value={range}
            onChange={(e) => setRange(e.target.value as RangeKey)}
            className="h-[40px] appearance-none rounded-xl border border-[#E1E5E1] bg-[#F7FAF7] pr-9 pl-3.5 text-[12.5px] font-semibold text-[#444444] transition-colors outline-none focus:border-[#2E7D32]"
          >
            {PRICE_RANGES.map((r) => (
              <option key={r.key} value={r.key}>
                {r.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-[#8A938A]" />
        </div>
      </div>

      {/* Avg stats */}
      <div className="mt-4 flex items-center gap-8">
        <div>
          <p className="text-[11px] font-medium text-[#777777]">Avg Price</p>
          <p className="mt-0.5 font-display text-[22px] leading-none font-bold text-[#111111]">
            {MARKET_TREND_INFO.avgPrice}
            <span className="ml-1 font-sans text-[12px] font-medium text-[#777777]">{MARKET_TREND_INFO.avgUnit}</span>
          </p>
        </div>
        <p className="mt-5 text-[12px] font-semibold text-[#2E7D32]">{MARKET_TREND_INFO.change}</p>
      </div>

      <div className="mt-4 h-[230px] w-full sm:h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={series} margin={{ top: 10, right: 8, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="buyerTrendFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2E7D32" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#2E7D32" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ECF1EC" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 10.5, fill: "#8A938A" }} axisLine={false} tickLine={false} dy={8} />
            <YAxis
              tick={{ fontSize: 10.5, fill: "#8A938A" }}
              axisLine={false}
              tickLine={false}
              dx={-4}
              width={52}
              domain={["dataMin - 120", "dataMax + 120"]}
              tickFormatter={(v: number) => `₹${(v / 1000).toFixed(1)}k`}
            />
            <Tooltip content={<ChartTooltip />} cursor={{ stroke: "#2E7D32", strokeOpacity: 0.25 }} />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#2E7D32"
              strokeWidth={2.6}
              fill="url(#buyerTrendFill)"
              dot={{ r: 3.5, fill: "#2E7D32", stroke: "#ffffff", strokeWidth: 1.6 }}
              activeDot={{ r: 5.5, fill: "#2E7D32", stroke: "#ffffff", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <p className={cn("mt-3 text-[11px] text-[#999999]")}>
        Demo data shown for {PRICE_RANGES.find((r) => r.key === range)!.label} — not live market data.
      </p>
    </section>
  );
}
