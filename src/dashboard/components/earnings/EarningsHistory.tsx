import { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  ReceiptText,
  X,
} from "lucide-react";
import type { EarningsTransaction, PaymentStatus } from "../../data/earnings";
import { buildStatementCsv, inr } from "../../data/earnings";
import { cn } from "../../../utils/cn";

type TabKey = "all" | PaymentStatus;

const TAB_LABELS: { key: TabKey; label: string }[] = [
  { key: "all", label: "All Transactions" },
  { key: "received", label: "Received" },
  { key: "pending", label: "Pending" },
  { key: "failed", label: "Failed" },
];

const PAGE_SIZE = 6;

function StatusBadge({ status }: { status: PaymentStatus }) {
  const map: Record<PaymentStatus, { cls: string; label: string }> = {
    received: { cls: "bg-[#EAF6EA] text-[#2E7D32]", label: "Received" },
    pending: { cls: "bg-amber-100 text-amber-700", label: "Pending" },
    failed: { cls: "bg-red-50 text-red-600", label: "Failed" },
  };
  const { cls, label } = map[status];
  return <span className={cn("inline-flex rounded-full px-3 py-1 text-[11px] font-bold", cls)}>{label}</span>;
}

/* --------------------------- Transaction modal ----------------------------- */

function TransactionModal({ txn, onClose }: { txn: EarningsTransaction; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const settlementNote =
    txn.status === "received"
      ? "Settled to SBI (XXXX XXXX 1234) on the same day."
      : txn.status === "pending"
        ? "Amount will be released to your bank after delivery confirmation."
        : "This payment could not be processed.";

  const rows: [string, string][] = [
    ["Order ID", txn.orderId],
    ["Date", txn.date],
    ["Crop", txn.crop],
    ["Quantity", `${txn.quantityKg.toLocaleString("en-IN")} kg`],
    ["Rate", `₹ ${txn.rate.toFixed(2)}/kg`],
    ["Total Amount", `${inr(txn.total)}`],
  ];

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/45 p-5 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-label={`Transaction ${txn.orderId}`}
      onClick={onClose}
    >
      <div
        className="animate-pop-in w-full max-w-[440px] rounded-3xl bg-white p-6 shadow-2xl sm:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#EAF6EA] text-[#2E7D32]">
              <ReceiptText className="h-5 w-5" strokeWidth={2} />
            </span>
            <div>
              <h2 className="font-display text-[17px] font-bold text-[#111111]">Transaction Details</h2>
              <StatusBadge status={txn.status} />
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[#E1E5E1] text-[#666666] transition-colors hover:bg-[#EAF6EA] hover:text-[#2E7D32]"
          >
            <X className="h-[18px] w-[18px]" />
          </button>
        </div>

        <dl className="mt-5 flex flex-col gap-2.5">
          {rows.map(([label, value]) => (
            <div key={label} className="flex items-baseline justify-between gap-3 border-b border-[#F0F3F0] pb-2">
              <dt className="text-[12px] font-medium text-[#777777]">{label}</dt>
              <dd className="text-right text-[12.5px] font-semibold text-[#111111]">{value}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-4 rounded-xl bg-[#F7FAF7] px-4 py-3 text-[12px] leading-relaxed font-medium text-[#555555] ring-1 ring-[#E1E5E1]">
          {settlementNote}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------ Main section ------------------------------- */

export default function EarningsHistory({
  transactions,
  onDownloaded,
}: {
  transactions: EarningsTransaction[];
  onDownloaded: () => void;
}) {
  const [tab, setTab] = useState<TabKey>("all");
  const [page, setPage] = useState(1);
  const [viewing, setViewing] = useState<EarningsTransaction | null>(null);

  const counts = useMemo(() => {
    const c: Record<TabKey, number> = { all: transactions.length, received: 0, pending: 0, failed: 0 };
    for (const t of transactions) c[t.status] += 1;
    return c;
  }, [transactions]);

  const filtered = useMemo(
    () => (tab === "all" ? transactions : transactions.filter((t) => t.status === tab)),
    [transactions, tab]
  );

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const paged = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [tab, transactions]);

  const switchTab = (key: TabKey) => {
    setTab(key);
    setPage(1);
  };

  const downloadStatement = () => {
    const csv = buildStatementCsv(filtered);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "kisansetu-earnings-statement.csv";
    anchor.click();
    URL.revokeObjectURL(url);
    onDownloaded();
  };

  const from = filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const to = Math.min(safePage * PAGE_SIZE, filtered.length);

  return (
    <section className="rounded-2xl border border-[#E1E5E1] bg-white p-5 shadow-[0_10px_30px_-18px_rgba(17,17,17,0.12)] sm:p-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-[16.5px] font-semibold text-[#111111]">Earnings History</h2>
        <button
          type="button"
          onClick={downloadStatement}
          className="inline-flex h-[38px] items-center gap-2 rounded-xl border-[1.5px] border-[#CBDCF2] bg-white px-4 text-[12.5px] font-semibold text-[#1D6FB8] transition-colors hover:bg-[#F3F8FD]"
        >
          <Download className="h-4 w-4" strokeWidth={2.2} />
          Download Statement
        </button>
      </div>

      {/* Tabs */}
      <div className="no-scrollbar mt-4 flex gap-6 overflow-x-auto border-b border-[#E1E5E1]" role="tablist" aria-label="Transaction status">
        {TAB_LABELS.map((t) => {
          const selected = tab === t.key;
          return (
            <button
              key={t.key}
              role="tab"
              aria-selected={selected}
              onClick={() => switchTab(t.key)}
              className={cn(
                "relative shrink-0 pb-3 text-[13px] whitespace-nowrap transition-colors duration-200",
                selected ? "font-semibold text-[#2E7D32]" : "font-medium text-[#666666] hover:text-[#111111]"
              )}
            >
              {t.label} ({counts[t.key]})
              <span
                aria-hidden="true"
                className={cn(
                  "absolute right-0 -bottom-px left-0 h-[2.5px] rounded-full bg-[#2E7D32] transition-all duration-300",
                  selected ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
                )}
              />
            </button>
          );
        })}
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <p className="py-10 text-center text-[12.5px] text-[#888888]">
          No {tab === "all" ? "" : tab} transactions in this period.
        </p>
      ) : (
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[840px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[#E1E5E1]">
                {["Date", "Order ID", "Crop", "Quantity", "Rate (₹/kg)", "Total Amount (₹)", "Payment Status", "Action"].map((head) => (
                  <th key={head} className="pb-2.5 pr-3 text-[10.5px] font-bold tracking-[0.08em] whitespace-nowrap text-[#999999] uppercase">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.map((txn) => (
                <tr key={txn.id} className="border-b border-[#F0F3F0] last:border-0">
                  <td className="py-3.5 pr-3 text-[12.5px] font-medium whitespace-nowrap text-[#444444]">{txn.date}</td>
                  <td className="py-3.5 pr-3 text-[12.5px] font-semibold whitespace-nowrap text-[#111111]">{txn.orderId}</td>
                  <td className="py-3.5 pr-3 text-[12.5px] whitespace-nowrap text-[#444444]">{txn.crop}</td>
                  <td className="py-3.5 pr-3 text-[12.5px] whitespace-nowrap text-[#444444]">
                    {txn.quantityKg.toLocaleString("en-IN")} kg
                  </td>
                  <td className="py-3.5 pr-3 text-[12.5px] font-medium text-[#444444]">{txn.rate.toFixed(2)}</td>
                  <td className="py-3.5 pr-3 text-[13px] font-bold whitespace-nowrap text-[#2E7D32]">
                    {txn.total.toLocaleString("en-IN")}
                  </td>
                  <td className="py-3.5 pr-3">
                    <StatusBadge status={txn.status} />
                  </td>
                  <td className="py-3.5">
                    <button
                      type="button"
                      onClick={() => setViewing(txn)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-[#CBDCF2] bg-[#F3F8FD] px-3 py-1.5 text-[11.5px] font-semibold text-[#1D6FB8] transition-colors hover:bg-[#DCEAF7]"
                    >
                      <Eye className="h-3.5 w-3.5" strokeWidth={2.2} />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer / pagination */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[12px] text-[#888888]">
          Showing {from} – {to} of {filtered.length} transactions
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={safePage === 1}
            aria-label="Previous page"
            className="grid h-9 w-9 place-items-center rounded-lg border border-[#E1E5E1] bg-white text-[#666666] transition-colors hover:text-[#2E7D32] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          {Array.from({ length: pageCount }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => setPage(num)}
              aria-current={num === safePage ? "page" : undefined}
              className={cn(
                "h-9 w-9 rounded-lg text-[12.5px] font-semibold transition-colors",
                num === safePage
                  ? "bg-[#2E7D32] text-white shadow-[0_8px_18px_-8px_rgba(46,125,50,0.6)]"
                  : "border border-[#E1E5E1] bg-white text-[#555555] hover:text-[#2E7D32]"
              )}
            >
              {num}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
            disabled={safePage === pageCount}
            aria-label="Next page"
            className="grid h-9 w-9 place-items-center rounded-lg border border-[#E1E5E1] bg-white text-[#666666] transition-colors hover:text-[#2E7D32] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {viewing && <TransactionModal txn={viewing} onClose={() => setViewing(null)} />}
    </section>
  );
}
