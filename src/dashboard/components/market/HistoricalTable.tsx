import { Calendar, ChartLine, ChevronDown } from "lucide-react";
import type { HistoryRow } from "../../data/marketPrices";

export default function HistoricalTable({
  rows,
  range,
  onRangeChange,
  onViewFullChart,
}: {
  rows: HistoryRow[];
  range: string;
  onRangeChange: (value: string) => void;
  onViewFullChart: () => void;
}) {
  return (
    <section className="rounded-2xl border border-[#E1E5E1] bg-white p-5 shadow-[0_10px_30px_-18px_rgba(17,17,17,0.12)] sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid h-[42px] w-[42px] place-items-center rounded-2xl bg-[#EAF6EA] text-[#2E7D32]">
            <Calendar className="h-[20px] w-[20px]" strokeWidth={2} />
          </span>
          <div>
            <h2 className="font-display text-[16.5px] font-semibold text-[#111111]">Historical Price Data</h2>
            <p className="mt-0.5 text-[12px] text-[#666666]">View past trends for better planning.</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="relative">
            <select
              aria-label="Select historical range"
              value={range}
              onChange={(e) => onRangeChange(e.target.value)}
              className="h-[38px] appearance-none rounded-xl border border-[#E1E5E1] bg-[#F7FAF7] pr-8 pl-3 text-[12px] font-semibold text-[#444444] transition-colors outline-none focus:border-[#2E7D32]"
            >
              {["Last 30 Days", "Last 90 Days", "Last 1 Year"].map((opt) => (
                <option key={opt}>{opt}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 h-3.5 w-3.5 -translate-y-1/2 text-[#8A938A]" />
          </div>
          <button
            type="button"
            onClick={onViewFullChart}
            className="inline-flex h-[38px] items-center gap-2 rounded-xl border-[1.5px] border-[#2E7D32] bg-white px-3.5 text-[12px] font-semibold text-[#2E7D32] transition-colors hover:bg-[#EAF6EA]"
          >
            <ChartLine className="h-4 w-4" strokeWidth={2} />
            View Full Chart
          </button>
        </div>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[520px] border-collapse text-left">
          <thead>
            <tr className="border-b border-[#E1E5E1]">
              {["Date", "Min Price (₹/kg)", "Max Price (₹/kg)", "Avg Price (₹/kg)"].map((head) => (
                <th key={head} className="pb-2.5 pr-3 text-[10.5px] font-bold tracking-[0.08em] whitespace-nowrap text-[#999999] uppercase">
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.date} className="border-b border-[#F0F3F0] last:border-0">
                <td className="py-3 pr-3 text-[13px] font-semibold whitespace-nowrap text-[#111111]">{row.date}</td>
                <td className="py-3 pr-3 text-[12.5px] font-medium text-[#444444]">{row.min.toFixed(2)}</td>
                <td className="py-3 pr-3 text-[12.5px] font-medium text-[#444444]">{row.max.toFixed(2)}</td>
                <td className="py-3 pr-3 text-[13px] font-bold text-[#2E7D32]">{row.avg.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
