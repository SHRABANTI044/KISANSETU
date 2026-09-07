import { RefreshCw } from "lucide-react";
import { cn } from "../../../utils/cn";

export default function MarketPriceHeader({
  lastUpdated,
  refreshing,
  onRefresh,
}: {
  lastUpdated: string;
  refreshing: boolean;
  onRefresh: () => void;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-[24px] font-bold tracking-[-0.01em] text-[#111111] sm:text-[28px]">
          Market Prices
        </h1>
        <p className="mt-1 max-w-xl text-[13.5px] text-[#666666]">
          Check real-time mandi prices, compare markets and track trends to make better selling
          decisions.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3.5">
        <p className="text-[12px] font-medium text-[#888888]">
          Last Updated: <span className="font-semibold text-[#444444]">{lastUpdated}</span>
        </p>
        <button
          type="button"
          onClick={onRefresh}
          disabled={refreshing}
          aria-busy={refreshing}
          className={cn(
            "inline-flex h-[42px] items-center gap-2 rounded-xl border-[1.5px] border-[#D8DED8] bg-white px-4 text-[13px] font-semibold text-[#2E7D32] transition-all duration-200",
            "hover:border-[#2E7D32]/60 hover:bg-[#EAF6EA] disabled:cursor-wait disabled:opacity-80"
          )}
        >
          <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} strokeWidth={2.2} />
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>
    </div>
  );
}
