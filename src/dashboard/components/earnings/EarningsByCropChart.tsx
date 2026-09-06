import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { EARNINGS_BY_CROP, EARNINGS_SUMMARY, inr } from "../../data/earnings";

function DonutTooltip({ active, payload }: { active?: boolean; payload?: { name?: string; value?: number }[] }) {
  if (!active || !payload?.length) return null;
  const item = payload[0]!;
  return (
    <div className="rounded-xl border border-[#E1E5E1] bg-white px-3.5 py-2.5 shadow-[0_12px_30px_-12px_rgba(17,17,17,0.25)]">
      <p className="text-[12px] font-semibold text-[#111111]">{item.name}</p>
      <p className="font-display text-[13px] font-bold text-[#2E7D32]">{item.value}%</p>
    </div>
  );
}

export default function EarningsByCropChart() {
  return (
    <section className="flex h-full flex-col rounded-2xl border border-[#E1E5E1] bg-white p-5 shadow-[0_10px_30px_-18px_rgba(17,17,17,0.12)] sm:p-6">
      <h2 className="font-display text-[16.5px] font-semibold text-[#111111]">Earnings by Crop</h2>

      {/* Donut with centered total */}
      <div className="relative mx-auto mt-2 h-[190px] w-[190px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<DonutTooltip />} />
            <Pie
              data={EARNINGS_BY_CROP}
              dataKey="percentage"
              nameKey="crop"
              cx="50%"
              cy="50%"
              innerRadius={58}
              outerRadius={84}
              paddingAngle={2}
              cornerRadius={5}
              stroke="#ffffff"
              strokeWidth={2}
            >
              {EARNINGS_BY_CROP.map((slice) => (
                <Cell key={slice.crop} fill={slice.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <p className="font-display text-[19px] leading-none font-bold text-[#111111]">
            {inr(EARNINGS_SUMMARY.totalEarnings)}
          </p>
          <p className="mt-1.5 text-[10.5px] font-medium text-[#888888]">Total Earnings</p>
        </div>
      </div>

      {/* Legend */}
      <ul className="mt-4 grid grid-cols-1 gap-x-6 gap-y-2.5 sm:grid-cols-2 xl:grid-cols-1">
        {EARNINGS_BY_CROP.map((slice) => (
          <li key={slice.crop} className="flex items-center gap-2.5 border-b border-[#F0F3F0] pb-2 last:border-0">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: slice.color }} aria-hidden="true" />
            <span className="flex-1 text-[12.5px] font-medium text-[#444444]">{slice.crop}</span>
            <span className="text-[12px] font-bold text-[#111111]">{slice.percentage}%</span>
            <span className="w-[74px] text-right text-[12px] font-semibold text-[#2E7D32]">
              {inr(slice.amount)}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
