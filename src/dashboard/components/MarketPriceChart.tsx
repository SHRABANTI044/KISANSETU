import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { MARKET_OVERVIEW, MARKET_PRICE_SERIES } from "../data/farmerDashboardData";

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value?: number }[];
  label?: string;
}) {
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

/** Market price graph — Recharts area chart fed by typed mock data. */
export default function MarketPriceChart() {
  return (
    <section className="rounded-2xl border border-[#E1E5E1] bg-white p-5 shadow-[0_10px_30px_-18px_rgba(17,17,17,0.12)] sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-[16.5px] font-semibold text-[#111111]">
            {MARKET_OVERVIEW.title}
          </h2>
          <p className="mt-0.5 text-[12.5px] text-[#777777]">{MARKET_OVERVIEW.crop}</p>
        </div>

        <div className="flex items-start gap-5">
          <div className="text-right sm:text-left">
            <p className="text-[11px] font-medium text-[#777777]">{MARKET_OVERVIEW.avgLabel}</p>
            <p className="mt-0.5 font-display text-[19px] leading-none font-bold text-[#111111]">
              {MARKET_OVERVIEW.avgValue}
              <span className="ml-1 font-sans text-[11px] font-medium text-[#777777]">
                {MARKET_OVERVIEW.avgUnit}
              </span>
            </p>
            <p className="mt-1 text-[11px] font-semibold text-[#2E7D32]">{MARKET_OVERVIEW.change}</p>
          </div>
          <select
            aria-label="Select date range"
            defaultValue={MARKET_OVERVIEW.range}
            className="h-[40px] rounded-xl border border-[#E1E5E1] bg-[#F7FAF7] px-3 text-[12.5px] font-semibold text-[#444444] transition-colors outline-none focus:border-[#2E7D32]"
          >
            <option>7 Days</option>
            <option>15 Days</option>
            <option>30 Days</option>
          </select>
        </div>
      </div>

      <div className="mt-5 h-[260px] w-full sm:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={MARKET_PRICE_SERIES} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="priceFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2E7D32" stopOpacity={0.22} />
                <stop offset="100%" stopColor="#2E7D32" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ECF1EC" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10.5, fill: "#8A938A" }}
              axisLine={false}
              tickLine={false}
              dy={8}
            />
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
              fill="url(#priceFill)"
              dot={{ r: 3.5, fill: "#2E7D32", stroke: "#ffffff", strokeWidth: 1.6 }}
              activeDot={{ r: 5.5, fill: "#2E7D32", stroke: "#ffffff", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <p className="mt-3 text-[11px] text-[#999999]">Demo data — not connected to a live market feed.</p>
    </section>
  );
}
