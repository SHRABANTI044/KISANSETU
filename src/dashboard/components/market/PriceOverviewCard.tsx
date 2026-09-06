import {
  Area,
  AreaChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TrendingUp, Wheat } from "lucide-react";
import type { CropData, PriceStats, TimeRange } from "../../data/marketPrices";
import { cn } from "../../../utils/cn";

const RANGES: { key: TimeRange; label: string }[] = [
  { key: "7d", label: "7 Days" },
  { key: "30d", label: "30 Days" },
  { key: "3m", label: "3 Months" },
  { key: "1y", label: "1 Year" },
];

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: { value?: number }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-[#E1E5E1] bg-white px-3.5 py-2.5 shadow-[0_12px_30px_-12px_rgba(17,17,17,0.25)]">
      <p className="text-[11px] font-medium text-[#777777]">{label}</p>
      <p className="mt-0.5 font-display text-[14px] font-bold text-[#155B32]">
        ₹{payload[0]!.value?.toFixed(2)}
        <span className="ml-1 font-sans text-[11px] font-medium text-[#777777]">/kg</span>
      </p>
    </div>
  );
}

export default function PriceOverviewCard({
  crop,
  variety,
  stats,
  series,
  range,
  onRangeChange,
}: {
  crop: CropData;
  variety: string;
  stats: PriceStats;
  series: { label: string; price: number }[];
  range: TimeRange;
  onRangeChange: (range: TimeRange) => void;
}) {
  const statCards = [
    { value: `₹ ${stats.min.toFixed(2)}`, label: "Minimum Price", sub: "(per kg)" },
    { value: `₹ ${stats.max.toFixed(2)}`, label: "Maximum Price", sub: "(per kg)" },
    { value: `₹ ${stats.avg.toFixed(2)}`, label: "Average Price", sub: "(per kg)" },
  ];

  return (
    <section className="rounded-2xl border border-[#E1E5E1] bg-white p-5 shadow-[0_10px_30px_-18px_rgba(17,17,17,0.12)] sm:p-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center overflow-hidden rounded-xl bg-[#EAF6EA]">
            {crop.image ? (
              <img src={crop.image} alt={crop.label} className="h-full w-full object-cover" />
            ) : (
              <Wheat className="h-[22px] w-[22px] text-[#2E7D32]" strokeWidth={2} />
            )}
          </span>
          <div>
            <div className="flex flex-wrap items-baseline gap-x-2">
              <h2 className="font-display text-[19px] font-bold text-[#111111]">{crop.label}</h2>
              <span className="text-[12.5px] font-medium text-[#777777]">({variety})</span>
            </div>
            <span className="mt-1 inline-flex rounded-full bg-[#EAF6EA] px-2.5 py-0.5 text-[11px] font-bold text-[#2E7D32]">
              Season: {crop.season}
            </span>
          </div>
        </div>

        {/* Time range buttons */}
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Select time range">
          {RANGES.map((r) => {
            const active = range === r.key;
            return (
              <button
                key={r.key}
                role="tab"
                aria-selected={active}
                onClick={() => onRangeChange(r.key)}
                className={cn(
                  "h-[38px] rounded-lg border px-4 text-[12.5px] font-semibold transition-all duration-150",
                  active
                    ? "border-[#2E7D32] bg-[#2E7D32] text-white shadow-[0_8px_18px_-8px_rgba(46,125,50,0.55)]"
                    : "border-[#E1E5E1] bg-white text-[#555555] hover:border-[#2E7D32]/50 hover:text-[#2E7D32]"
                )}
              >
                {r.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Statistic cards */}
      <div className="mt-6 grid grid-cols-2 gap-3.5 lg:grid-cols-4">
        {statCards.map((card) => (
          <div key={card.label} className="rounded-xl border border-[#E1E5E1] bg-[#FAFBFA] px-4 py-3.5">
            <p className="font-display text-[19px] leading-none font-bold text-[#111111] sm:text-[21px]">
              {card.value}
            </p>
            <p className="mt-1.5 text-[11.5px] font-medium text-[#777777]">
              {card.label} <span className="text-[#999999]">{card.sub}</span>
            </p>
          </div>
        ))}
        <div className="rounded-xl border border-[#BFE3C5] bg-[#F0FAF1] px-4 py-3.5">
          <p className="flex items-center gap-1.5 font-display text-[19px] leading-none font-bold text-[#2E7D32] sm:text-[21px]">
            <TrendingUp className="h-5 w-5" strokeWidth={2.4} />
            {stats.weeklyChange}%
          </p>
          <p className="mt-1.5 text-[11.5px] font-medium text-[#555555]">vs. last week</p>
        </div>
      </div>

      {/* Chart */}
      <div className="mt-6">
        <p className="text-[11.5px] font-semibold text-[#8A938A]">Price (₹/kg)</p>
        <div className="mt-2 h-[240px] w-full sm:h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={series} margin={{ top: 22, right: 10, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="marketFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2E7D32" stopOpacity={0.18} />
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
                width={48}
                domain={["dataMin - 2", "dataMax + 2"]}
                tickFormatter={(v: number) => `₹${Math.round(v)}`}
              />
              <Tooltip content={<ChartTooltip />} cursor={{ stroke: "#2E7D32", strokeOpacity: 0.25 }} />
              <Area
                type="monotone"
                dataKey="price"
                stroke="#2E7D32"
                strokeWidth={2.6}
                fill="url(#marketFill)"
                dot={{ r: 3.5, fill: "#2E7D32", stroke: "#ffffff", strokeWidth: 1.6 }}
                activeDot={{ r: 5.5, fill: "#2E7D32", stroke: "#ffffff", strokeWidth: 2 }}
              >
                <LabelList
                  dataKey="price"
                  position="top"
                  offset={8}
                  formatter={(v: any) => {
                    const n = Number(v);
                    return `₹${n.toFixed(n >= 100 ? 0 : 1)}`;
                  }}
                  style={{ fontSize: 10, fill: "#2E7D32", fontWeight: 700 }}
                />
              </Area>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <p className="mt-3 text-[11px] text-[#999999]">Demo mandi data — not connected to a live feed.</p>
    </section>
  );
}
