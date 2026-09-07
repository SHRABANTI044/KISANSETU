import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import EarningsByCropChart from "../components/earnings/EarningsByCropChart";
import EarningsHeader from "../components/earnings/EarningsHeader";
import EarningsHistory from "../components/earnings/EarningsHistory";
import EarningsSummaryCards from "../components/earnings/EarningsSummaryCards";
import MonthlyEarningsChart from "../components/earnings/MonthlyEarningsChart";
import {
  BankAccountCard,
  PendingSettlementCard,
  ProgressCard,
  TipCard,
} from "../components/earnings/EarningsSideRail";
import { DATE_RANGES, EARNINGS_TRANSACTIONS } from "../data/earnings";
import { cn } from "../../utils/cn";

/** /earnings — farmer settlements overview (frontend prototype). */
export default function EarningsPage() {
  const [dateRange, setDateRange] = useState(DATE_RANGES[0]!.label);
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(t);
  }, [toast]);

  const rangeTransactions = useMemo(() => {
    const range = DATE_RANGES.find((r) => r.label === dateRange) ?? DATE_RANGES[0]!;
    return EARNINGS_TRANSACTIONS.filter((t) => t.isoDate >= range.from && t.isoDate <= range.to);
  }, [dateRange]);

  const handleRangeChange = (label: string) => {
    setDateRange(label);
    setToast(`Showing transactions for ${label}.`);
  };

  return (
    <DashboardLayout>
      <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-5 sm:gap-6">
        <EarningsHeader dateRange={dateRange} onDateRangeChange={handleRangeChange} options={DATE_RANGES.map((r) => r.label)} />

        <EarningsSummaryCards />

        {/* Charts + right rail */}
        <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_370px]">
          {/* Main column */}
          <div className="flex min-w-0 flex-col gap-5">
            <div className="grid items-start gap-5 xl:grid-cols-[1.6fr_1fr]">
              <MonthlyEarningsChart />
              <EarningsByCropChart />
            </div>
            <EarningsHistory
              transactions={rangeTransactions}
              onDownloaded={() => setToast("Statement downloaded as CSV.")}
            />
          </div>

          {/* Right rail */}
          <div className="flex min-w-0 flex-col gap-5">
            <ProgressCard />
            <PendingSettlementCard />
            <BankAccountCard onSaved={() => setToast("Bank details updated.")} />
            <TipCard />
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <p
          role="status"
          className={cn(
            "animate-pop-in fixed bottom-6 left-1/2 z-[90] max-w-[92vw] -translate-x-1/2 rounded-full",
            "bg-[#155B32] px-5 py-3 text-center text-[13px] font-medium text-white shadow-[0_16px_40px_-12px_rgba(0,0,0,0.4)]"
          )}
        >
          {toast}
        </p>
      )}
    </DashboardLayout>
  );
}
