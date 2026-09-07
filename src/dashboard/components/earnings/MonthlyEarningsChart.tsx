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
import { ChevronDown } from "lucide-react";
import { MONTHLY_EARNINGS } from "../../data/earnings";

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
      <p className="text-[11px] font-medium text-[#777777]">{label} 2025</p>
      <p className="mt-0.5 font-display text-[14px] font-bold text-[#155B32]">
        ₹ {payload[0]!.value?.toLocaleString("en-IN")}
      </p>
    </div>
  );
}

const RANGE_OPTIONS = ["Last 6 Months", "Last 12 Months"];

export default function MonthlyEarningsChart() {
  const [range, setRange] = useState(RANGE_OPTIONS[0]!);
  const data = MONTHLY_EARNINGS.slice(range === "Last 6 Months" ? -6 : -12);

  return (
    <section className="rounded-2xl border border-[#E1E5E1] bg-white p-5 shadow-[0_10px_30px_-18px_rgba(17,17,17,0.12)] sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-[16.5px] font-semibold text-[#111111]">
            Monthly Earnings Trend
          </h2>
          <p className="mt-0.5 text-[12px] text-[#777777]">Show the monthly income trend.</p>
        </div>
        <div className="relative">
          <select
            aria-label="Select chart range"
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="h-[38px] appearance-none rounded-xl border border-[#E1E5E1] bg-[#F7FAF7] pr-8 pl-3 text-[12px] font-semibold text-[#444444] transition-colors outline-none focus:border-[#2E7D32]"
          >
            {RANGE_OPTIONS.map((opt) => (
              <option key={opt}>{opt}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 h-3.5 w-3.5 -translate-y-1/2 text-[#8A938A]" />
        </div>
      </div>

      <div className="mt-5 h-[240px] w-full sm:h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 12, right: 10, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="earningsFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2E7D32" stopOpacity={0.22} />
                <stop offset="100%" stopColor="#2E7D32" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ECF1EC" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 10.5, fill: "#8A938A" }} axisLine={false} tickLine={false} dy={8} />
            <YAxis
              tick={{ fontSize: 10.5, fill: "#8A938A" }}
              axisLine={false}
              tickLine={false}
              dx={-4}
              width={52}
              domain={[0, 80000]}
              ticks={[0, 20000, 40000, 60000, 80000]}
              tickFormatter={(v: number) => (v === 0 ? "₹ 0" : `₹ ${v / 1000}K`)}
            />
            <Tooltip content={<ChartTooltip />} cursor={{ stroke: "#2E7D32", strokeOpacity: 0.25 }} />
            <Area
              type="monotone"
              dataKey="amount"
              stroke="#2E7D32"
              strokeWidth={2.6}
              fill="url(#earningsFill)"
              dot={{ r: 3.5, fill: "#2E7D32", stroke: "#ffffff", strokeWidth: 1.6 }}
              activeDot={{ r: 5.5, fill: "#2E7D32", stroke: "#ffffff", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <p className="mt-3 text-[11px] text-[#999999]">Demo settlement data — not connected to a payment system yet.</p>
    </section>
  );
}
