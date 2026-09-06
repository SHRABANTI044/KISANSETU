import { ChartColumn } from "lucide-react";
import type { MandiRow } from "../../data/marketPrices";

export default function CompareMarkets({ rows }: { rows: MandiRow[] }) {
  const maxAvg = Math.max(...rows.map((r) => r.avg), 1);

  return (
    <section className="rounded-2xl border border-[#E1E5E1] bg-white p-5 shadow-[0_10px_30px_-18px_rgba(17,17,17,0.12)] sm:p-6">
      <div className="flex items-center gap-3">
        <span className="grid h-[42px] w-[42px] place-items-center rounded-2xl bg-[#EAF6EA] text-[#2E7D32]">
          <ChartColumn className="h-[20px] w-[20px]" strokeWidth={2} />
        </span>
        <div>
          <h2 className="font-display text-[16.5px] font-semibold text-[#111111]">Compare Markets</h2>
          <p className="mt-0.5 text-[12px] text-[#666666]">Compare average prices across markets</p>
        </div>
      </div>

      <ul className="mt-6 flex flex-col gap-4">
        {rows.map((row, i) => {
          const pct = Math.max(8, Math.round((row.avg / maxAvg) * 100));
          return (
            <li key={row.market}>
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-[12.5px] font-semibold text-[#111111]">{row.market}</span>
                <span className="font-display text-[13px] font-bold text-[#2E7D32]">
                  ₹{row.avg.toFixed(2)}
                </span>
              </div>
              <div
                className="mt-1.5 h-[10px] overflow-hidden rounded-full bg-[#EEF3EE]"
                role="img"
                aria-label={`${row.market} average price ₹${row.avg.toFixed(2)} per kg`}
              >
                <div
                  className="h-full rounded-full transition-[width] duration-700 ease-out"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: i === 0 ? "#2E7D32" : i === rows.length - 1 ? "#9fd0a5" : "#45a05a",
                  }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
