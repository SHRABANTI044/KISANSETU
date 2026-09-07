import { Calendar, ChevronDown } from "lucide-react";

export default function EarningsHeader({
  dateRange,
  onDateRangeChange,
  options,
}: {
  dateRange: string;
  onDateRangeChange: (label: string) => void;
  options: string[];
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-[24px] font-bold tracking-[-0.01em] text-[#111111] sm:text-[28px]">
          Earnings
        </h1>
        <p className="mt-1 text-[13.5px] text-[#666666]">
          Track your income from crop sales and manage your settlements.
        </p>
      </div>

      <div className="relative">
        <Calendar className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#2E7D32]" />
        <select
          aria-label="Select date range"
          value={dateRange}
          onChange={(e) => onDateRangeChange(e.target.value)}
          className="h-[44px] appearance-none rounded-xl border border-[#E1E5E1] bg-white pr-9 pl-10 text-[13px] font-semibold whitespace-nowrap text-[#111111] transition-colors outline-none focus:border-[#2E7D32]"
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-[#8A938A]" />
      </div>
    </div>
  );
}
