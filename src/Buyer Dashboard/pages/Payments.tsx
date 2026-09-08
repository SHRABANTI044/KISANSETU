import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  Check,
  ChevronDown,
  ChevronRight,
  CreditCard,
  Download,
  EllipsisVertical,
  Eye,
  FileText,
  Landmark,
  Leaf,
  MessageCircle,
  Package,
  Phone,
  RotateCcw,
  ShieldCheck,
  Sprout,
  TrendingUp,
  Users,
  Wallet,
  X,
} from "lucide-react";
import BuyerDashboardLayout from "../layouts/BuyerDashboardLayout";
import { downloadTextFile } from "../utils/download";
import type { BuyerTransaction, PaymentStatus } from "../data/buyerPaymentsData";
import {
  buildPaymentReceipt,
  INITIAL_BUYER_TRANSACTIONS,
  PAYMENT_METHODS,
  PAYMENT_STATS,
  PAYMENT_STATUS_META,
} from "../data/buyerPaymentsData";
import { cn } from "../../utils/cn";
import { useBuyerToast } from "../hooks/useBuyerToast";

type PaymentTabKey = "all" | PaymentStatus;

const TABS: { key: PaymentTabKey; label: string }[] = [
  { key: "all", label: "All Transactions" },
  { key: "pending", label: "Pending" },
  { key: "completed", label: "Completed" },
  { key: "failed", label: "Failed" },
];

const DATE_RANGES = ["Last 7 Days", "Last 30 Days", "Last 3 Months", "All Time"];
const DEMO_TODAY = new Date("2026-05-28T00:00:00");

function cutoffIso(days: number): string {
  const d = new Date(DEMO_TODAY.getTime() - days * 86_400_000);
  return d.toISOString().slice(0, 10);
}

function cropTileClass(key: BuyerTransaction["cropKey"]): string {
  const map: Record<BuyerTransaction["cropKey"], string> = {
    paddy: "bg-amber-100 text-amber-700",
    wheat: "bg-[#F0E2B8] text-[#C08A18]",
    maize: "bg-[#DCEAF7] text-[#1D6FB8]",
    moong: "bg-emerald-100 text-emerald-700",
    potato: "bg-orange-100 text-orange-600",
    onion: "bg-violet-100 text-violet-700",
  };
  return map[key];
}

function CropThumb({ tx, size = 44 }: { tx: BuyerTransaction; size?: number }) {
  const style = { height: size, width: size };
  if (tx.image) {
    return <img src={tx.image} alt={tx.crop} className="shrink-0 rounded-xl object-cover" style={style} />;
  }
  return (
    <span className={cn("grid shrink-0 place-items-center rounded-xl", cropTileClass(tx.cropKey))} style={style}>
      <Sprout className="h-[20px] w-[20px]" strokeWidth={1.9} />
    </span>
  );
}

function SupplierBadge({ type }: { type: BuyerTransaction["supplierType"] }) {
  return (
    <span className={cn(
      "rounded-full px-2 py-0.5 text-[9.5px] font-bold",
      type === "Farmer" ? "bg-[#EAF6EA] text-[#2E7D32]" : "bg-violet-100 text-violet-700"
    )}>
      {type}
    </span>
  );
}

/* ------------------------------ Modal shell -------------------------------- */

function ModalShell({
  title,
  onClose,
  children,
  wide = false,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  wide?: boolean;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/45 p-5 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <div
        className={cn(
          "animate-pop-in max-h-[92dvh] w-full overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-7",
          wide ? "max-w-[620px]" : "max-w-[480px]"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-display text-[18px] font-bold text-[#111111]">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[#E1E5E1] text-[#666666] transition-colors hover:bg-[#EAF6EA] hover:text-[#2E7D32]"
          >
            <X className="h-[18px] w-[18px]" strokeWidth={2.2} />
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}

/* ------------------------------- Page ------------------------------------- */

export default function Payments() {
  const [transactions, setTransactions] = useState<BuyerTransaction[]>(INITIAL_BUYER_TRANSACTIONS);
  const [tab, setTab] = useState<PaymentTabKey>("all");
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState(DATE_RANGES[2]!);
  const [filterOpen, setFilterOpen] = useState(false);
  const [cropFilter, setCropFilter] = useState("All Crops");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [modal, setModal] = useState<
    | { kind: "receipt"; transaction: BuyerTransaction }
    | { kind: "pay"; transaction: BuyerTransaction }
    | { kind: "methods" }
    | { kind: "receipts" }
    | { kind: "history" }
    | null
  >(null);
  const [processing, setProcessing] = useState(false);
  const [paySuccess, setPaySuccess] = useState<BuyerTransaction | null>(null);
  const [selectedMethodId, setSelectedMethodId] = useState(PAYMENT_METHODS[0]!.id);
  const { toast, showToast } = useBuyerToast();

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => { void 0; }, 0);
    return () => window.clearTimeout(t);
  }, [toast]);

  /* ----------------------------- Derived lists ------------------------------ */
  const pendingTransactions = useMemo(() => transactions.filter((t) => t.status === "pending"), [transactions]);
  const completedTransactions = useMemo(() => transactions.filter((t) => t.status === "completed"), [transactions]);
  const pendingAmount = useMemo(() => pendingTransactions.reduce((sum, t) => sum + t.amount, 0), [pendingTransactions]);

  const cropOptions = useMemo(() => ["All Crops", ...Array.from(new Set(transactions.map((t) => t.crop)))], [transactions]);

  const visibleTransactions = useMemo(() => {
    const q = search.trim().toLowerCase();
    const days = dateRange === "All Time" ? 0 : dateRange === "Last 7 Days" ? 7 : dateRange === "Last 30 Days" ? 30 : 92;
    const cutoff = days ? cutoffIso(days) : "";

    return transactions.filter((t) => {
      if (tab !== "all" && t.status !== tab) return false;
      if (cutoff && t.paymentDateIso < cutoff) return false;
      if (cropFilter !== "All Crops" && t.crop !== cropFilter) return false;
      if (statusFilter !== "All Status" && t.status !== statusFilter.toLowerCase()) return false;
      if (q && ![t.id, t.orderId, t.crop, t.variety, t.supplierName].some((f) => f.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [transactions, tab, search, dateRange, cropFilter, statusFilter]);

  const summaryCards = useMemo(
    () => [
      { key: "spent", title: "Total Spent", value: `₹ ${PAYMENT_STATS.totalSpent.toLocaleString("en-IN")}`, supporting: "↑ 12% vs last month", icon: Wallet, iconClass: "bg-[#EAF6EA] text-[#2E7D32]", trend: "up" },
      { key: "pending", title: "Pending Payments", value: `₹ ${pendingAmount.toLocaleString("en-IN")}`, supporting: `◷ ${pendingTransactions.length} order${pendingTransactions.length === 1 ? "" : "s"}`, icon: FileText, iconClass: "bg-[#DCEAF7] text-[#1D6FB8]", trend: "down" },
      { key: "completed", title: "Completed Payments", value: `₹ ${PAYMENT_STATS.completedAmount.toLocaleString("en-IN")}`, supporting: `✓ ${completedTransactions.length} transactions`, icon: Check, iconClass: "bg-amber-100 text-amber-700", trend: "up" },
      { key: "refund", title: "Refunds / Cancelled", value: "₹ 0", supporting: "◷ No refunds", icon: TrendingUp, iconClass: "bg-violet-100 text-violet-700", trend: "flat" },
    ],
    [pendingAmount, pendingTransactions.length, completedTransactions.length]
  );

  const tabCounts = useMemo(
    () => ({
      all: transactions.length,
      pending: pendingTransactions.length,
      completed: completedTransactions.length,
      failed: transactions.filter((t) => t.status === "failed").length,
    }),
    [transactions, pendingTransactions, completedTransactions]
  );

  /* ------------------------------- Mutations ------------------------------- */
  const openReceipt = (transaction: BuyerTransaction) => setModal({ kind: "receipt", transaction });
  const openPay = (transaction: BuyerTransaction) => {
    setProcessing(false);
    setPaySuccess(null);
    setSelectedMethodId(PAYMENT_METHODS[0]!.id);
    setModal({ kind: "pay", transaction });
  };

  const completePay = () => {
    if (processing) return;
    const tx = modal?.kind === "pay" ? modal.transaction : null;
    if (!tx) return;
    const method = PAYMENT_METHODS.find((m) => m.id === selectedMethodId);
    setProcessing(true);
    window.setTimeout(() => {
      setProcessing(false);
      setTransactions((prev) =>
        prev.map((t) =>
          t.orderId === tx.orderId
            ? { ...t, status: "completed", paymentDate: "28 May 2026", paymentDateIso: "2026-05-28", method: method?.label ?? t.method }
            : t
        )
      );
      setPaySuccess({
        ...tx,
        status: "completed",
        paymentDate: "28 May 2026",
        paymentDateIso: "2026-05-28",
        method: method?.label ?? tx.method,
      });
      showToast(`Payment of ₹ ${tx.amount.toLocaleString("en-IN")} completed via ${method?.label ?? "UPI"}.`);
    }, 1200);
  };

  const downloadReceipt = (transaction: BuyerTransaction) => {
    downloadTextFile(`kisansetu-payment-${transaction.id}.txt`, buildPaymentReceipt(transaction));
    showToast(`Receipt ${transaction.id} downloaded.`);
  };

  const payNowAll = () => {
    if (pendingTransactions.length === 0) {
      showToast("All pending invoices are settled — no pending payments right now.");
      return;
    }
    openPay(pendingTransactions[0]!);
  };

  /* --------------------------------- Render --------------------------------- */
  return (
    <BuyerDashboardLayout>
      <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-5 sm:gap-6">
        {/* Page header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <span className="grid h-[52px] w-[52px] shrink-0 place-items-center rounded-2xl bg-[#EAF6EA] text-[#2E7D32]">
              <Wallet className="h-[25px] w-[25px]" strokeWidth={2} />
            </span>
            <div>
              <h1 className="font-display text-[24px] font-bold tracking-[-0.01em] text-[#111111] sm:text-[28px]">
                Payments
              </h1>
              <p className="mt-1 max-w-xl text-[13.5px] text-[#666666]">
                Secure and transparent payments for a trusted agri-trade ecosystem.
              </p>
            </div>
          </div>

          <div className="relative isolate overflow-hidden rounded-2xl border border-[#BFE3C5] bg-[#F0FAF1] px-5 py-3.5">
            <div aria-hidden="true" className="pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full bg-[#2E7D32]/10" />
            <div className="relative z-10 flex items-center gap-3.5">
              <span className="grid h-[42px] w-[42px] shrink-0 place-items-center rounded-2xl bg-[#2E7D32] text-white">
                <ShieldCheck className="h-[21px] w-[21px]" strokeWidth={2} />
              </span>
              <div>
                <p className="font-display text-[14px] font-bold text-[#155B32]">Secure Payments</p>
                <p className="mt-0.5 text-[11.5px] font-medium text-[#5B7A63]">Safe for you. Fair for farmers.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => (
            <article
              key={card.key}
              className="rounded-2xl border border-[#E1E5E1] bg-white p-5 shadow-[0_10px_30px_-18px_rgba(17,17,17,0.12)] transition-shadow duration-300 hover:shadow-[0_16px_40px_-18px_rgba(17,17,17,0.18)]"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-[12.5px] font-medium text-[#666666]">{card.title}</p>
                <span className={cn("grid h-[38px] w-[38px] shrink-0 place-items-center rounded-full", card.iconClass)}>
                  <card.icon className="h-[18px] w-[18px]" strokeWidth={2.1} />
                </span>
              </div>
              <p className="mt-3 font-display text-[24px] leading-none font-bold text-[#111111]">{card.value}</p>
              <p className={cn("mt-2 text-[11.5px] font-semibold", card.trend === "up" ? "text-[#2E7D32]" : card.trend === "down" ? "text-[#666666]" : "text-[#8A938A]")}>{card.supporting}</p>
            </article>
          ))}
        </div>

        {/* Tabs + date + filter */}
        <div className="flex flex-col gap-4 border-b border-[#E1E5E1] lg:flex-row lg:items-end lg:justify-between">
          <div className="no-scrollbar flex items-end gap-6 overflow-x-auto" role="tablist" aria-label="Payment status">
            {TABS.map((t) => {
              const selected = tab === t.key;
              return (
                <button
                  key={t.key}
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setTab(t.key)}
                  className={cn(
                    "relative shrink-0 pb-3 text-[13.5px] whitespace-nowrap transition-colors duration-200",
                    selected ? "font-semibold text-[#2E7D32]" : "font-medium text-[#666666] hover:text-[#111111]"
                  )}
                >
                  {t.label} ({tabCounts[t.key]})
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

          <div className="relative flex items-center justify-between gap-2.5 pb-3">
            <div className="relative">
              <select
                aria-label="Select date range"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="h-[42px] appearance-none rounded-xl border border-[#E1E5E1] bg-white pr-9 pl-3.5 text-[12.5px] font-semibold text-[#444444] transition-colors outline-none focus:border-[#2E7D32]"
              >
                {DATE_RANGES.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-[#8A938A]" />
            </div>
            <div className="relative">
              <button
                type="button"
                onClick={() => setFilterOpen((v) => !v)}
                aria-expanded={filterOpen}
                className="inline-flex h-[42px] items-center gap-2 rounded-xl border-[1.5px] border-[#E1E5E1] bg-white px-4 text-[12.5px] font-semibold text-[#555555] transition-colors hover:text-[#2E7D32]"
              >
                <BarChart3 className="h-4 w-4" strokeWidth={2.2} />
                Filter
              </button>
            </div>
          </div>
          {filterOpen && (
            <>
              <span className="fixed inset-0 z-30 cursor-default" onClick={() => setFilterOpen(false)} aria-hidden="true" />
              <div className="animate-pop-in absolute top-[calc(100%+8px)] right-0 z-40 w-[280px] rounded-2xl border border-[#E1E5E1] bg-white p-4 shadow-[0_20px_50px_-18px_rgba(17,17,17,0.25)]">
                <div className="flex items-center justify-between">
                  <p className="text-[13px] font-bold text-[#111111]">Filter Payments</p>
                  <button
                    type="button"
                    onClick={() => {
                      setCropFilter("All Crops");
                      setStatusFilter("All Status");
                      setSearch("");
                    }}
                    className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-[#666666] transition-colors hover:text-[#2E7D32]"
                  >
                    <RotateCcw className="h-3 w-3" />
                    Reset
                  </button>
                </div>
                <div className="mt-3.5 flex flex-col gap-3">
                  <div>
                    <span className="mb-1 block text-[10.5px] font-bold tracking-[0.08em] text-[#8A938A] uppercase">Crop</span>
                    <select
                      aria-label="Crop filter"
                      value={cropFilter}
                      onChange={(e) => setCropFilter(e.target.value)}
                      className="h-[42px] w-full appearance-none rounded-xl border border-[#E1E5E1] bg-white px-3 text-[12.5px] font-medium text-[#111111] transition-colors outline-none focus:border-[#2E7D32]"
                    >
                      {cropOptions.map((o) => (
                        <option key={o}>{o}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <span className="mb-1 block text-[10.5px] font-bold tracking-[0.08em] text-[#8A938A] uppercase">Status</span>
                    <select
                      aria-label="Status filter"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="h-[42px] w-full appearance-none rounded-xl border border-[#E1E5E1] bg-white px-3 text-[12.5px] font-medium text-[#111111] transition-colors outline-none focus:border-[#2E7D32]"
                    >
                      {["All Status", "pending", "completed", "failed"].map((o) => (
                        <option key={o}>{o}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <span className="mb-1 block text-[10.5px] font-bold tracking-[0.08em] text-[#8A938A] uppercase">Search</span>
                    <input
                      type="search"
                      aria-label="Search transactions"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="ID, crop, supplier..."
                      className="h-[42px] w-full rounded-xl border border-[#E1E5E1] bg-white px-3 text-[12.5px] font-medium text-[#111111] transition-colors outline-none focus:border-[#2E7D32] placeholder:text-[#999999]"
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Main content: table + right rail */}
        <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_370px]">
          {/* Transactions table */}
          <div className="overflow-hidden rounded-2xl border border-[#E1E5E1] bg-white shadow-[0_10px_30px_-18px_rgba(17,17,17,0.12)]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1020px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-[#E1E5E1] bg-[#F7FAF7]">
                    {["Payment ID", "Order ID", "Crop & Variety", "Supplier (Farmer/FPO)", "Amount (₹)", "Payment Date", "Status", "Action", ""].map((head) => (
                      <th key={head} className="px-4 py-3.5 text-[10.5px] font-bold tracking-[0.08em] whitespace-nowrap text-[#777777] uppercase">
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visibleTransactions.map((transaction) => {
                    const meta = PAYMENT_STATUS_META[transaction.status];
                    const isPending = transaction.status === "pending";
                    return (
                      <tr key={transaction.id} className="border-b border-[#F0F3F0] transition-colors last:border-0 hover:bg-[#FAFCFA]">
                        {/* Payment ID */}
                        <td className="px-4 py-3.5">
                          <p className="text-[13px] font-bold whitespace-nowrap text-[#2E7D32]">{transaction.id}</p>
                        </td>

                        {/* Order ID */}
                        <td className="px-4 py-3.5 text-[12px] font-semibold whitespace-nowrap text-[#1D6FB8]">{transaction.orderId}</td>

                        {/* Crop */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-3">
                            <CropThumb tx={transaction} />
                            <div className="min-w-0">
                              <p className="text-[13px] leading-tight font-bold text-[#111111]">{transaction.crop}</p>
                              <p className="mt-0.5 text-[11px] text-[#999999]">Variety: {transaction.variety}</p>
                            </div>
                          </div>
                        </td>

                        {/* Supplier */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2">
                            <p className="text-[12.5px] font-semibold text-[#111111]">{transaction.supplierName}</p>
                            <SupplierBadge type={transaction.supplierType} />
                          </div>
                          <p className="mt-0.5 flex items-center gap-1 text-[10.5px] text-[#777777]">
                            <Leaf className="h-3 w-3 text-[#2E7D32]" />
                            {transaction.location}
                          </p>
                        </td>

                        {/* Amount */}
                        <td className="px-4 py-3.5 font-display text-[13.5px] font-bold whitespace-nowrap text-[#2E7D32]">
                          ₹ {transaction.amount.toLocaleString("en-IN")}
                        </td>

                        {/* Date */}
                        <td className="px-4 py-3.5 text-[12px] whitespace-nowrap text-[#666666]">{transaction.paymentDate}</td>

                        {/* Status */}
                        <td className="px-4 py-3.5">
                          <span className={cn("inline-flex rounded-full px-3 py-1 text-[10.5px] font-bold whitespace-nowrap", meta.badgeClass)}>
                            {meta.label}
                          </span>
                        </td>

                        {/* Action */}
                        <td className="px-4 py-3.5">
                          {isPending ? (
                            <button
                              type="button"
                              onClick={() => openPay(transaction)}
                              className="inline-flex h-9 items-center rounded-lg bg-[#2E7D32] px-3.5 text-[12px] font-semibold whitespace-nowrap text-white transition-colors hover:bg-[#256628]"
                            >
                              Pay Now
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => openReceipt(transaction)}
                              className="inline-flex h-9 items-center rounded-lg border-[1.5px] border-[#2E7D32] bg-white px-3.5 text-[12px] font-semibold whitespace-nowrap text-[#2E7D32] transition-colors hover:bg-[#EAF6EA]"
                            >
                              View Receipt
                            </button>
                          )}
                        </td>

                        {/* Menu */}
                        <td className="px-2 py-3.5">
                          <PaymentRowMenu
                            isPending={isPending}
                            onAction={(action) => {
                              if (action === "receipt") openReceipt(transaction);
                              else if (action === "download") downloadReceipt(transaction);
                              else if (action === "pay") openPay(transaction);
                              else if (action === "contact") showToast(`Contact initiated with ${transaction.supplierName} — they'll respond shortly.`);
                            }}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {visibleTransactions.length === 0 && (
              <p className="px-4 py-12 text-center text-[12.5px] text-[#666666]">
                No transactions match your filters — adjust the date range or reset filters.
              </p>
            )}
          </div>

          {/* Right rail */}
          <div className="flex min-w-0 flex-col gap-5">
            {/* Payment actions */}
            <section className="rounded-2xl border border-[#E1E5E1] bg-white p-5 shadow-[0_10px_30px_-18px_rgba(17,17,17,0.12)] sm:p-6">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#EAF6EA] text-[#2E7D32]">
                  <Package className="h-[19px] w-[19px]" strokeWidth={2} />
                </span>
                <h2 className="font-display text-[16.5px] font-semibold text-[#111111]">Payment Actions</h2>
              </div>

              <div className="mt-5 flex flex-col gap-3">
                {[
                  { key: "pay", title: "Make a Payment", desc: "Pay for pending orders", icon: CreditCard, iconClass: "bg-[#EAF6EA] text-[#2E7D32]" },
                  { key: "receipts", title: "View Receipts", desc: "Download payment receipts", icon: FileText, iconClass: "bg-[#DCEAF7] text-[#1D6FB8]" },
                  { key: "methods", title: "Payment Methods", desc: "Manage bank accounts, UPI etc.", icon: Wallet, iconClass: "bg-violet-100 text-violet-700" },
                  { key: "history", title: "Transaction History", desc: "View all past transactions", icon: BarChart3, iconClass: "bg-amber-100 text-amber-700" },
                ].map((action) => (
                  <button
                    key={action.key}
                    type="button"
                    onClick={() => {
                      if (action.key === "pay") payNowAll();
                      else if (action.key === "receipts") setModal({ kind: "receipts" });
                      else if (action.key === "methods") setModal({ kind: "methods" });
                      else setModal({ kind: "history" });
                    }}
                    className="group flex w-full items-center gap-3 rounded-2xl border border-[#E1E5E1] bg-[#F7FAF7] p-3.5 text-left transition-all duration-200 hover:border-[#2E7D32]/40 hover:bg-[#EAF6EA]/50"
                  >
                    <span className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-2xl", action.iconClass)}>
                      <action.icon className="h-[20px] w-[20px]" strokeWidth={2} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[13px] font-semibold text-[#111111]">{action.title}</span>
                      <span className="mt-0.5 block text-[11px] text-[#777777]">{action.desc}</span>
                    </span>
                    <ChevronRight className="h-4 w-4 shrink-0 text-[#B9BFB9] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-[#2E7D32]" />
                  </button>
                ))}
              </div>
            </section>

            {/* Recent payment */}
            <section className="rounded-2xl border border-[#E1E5E1] bg-white p-5 shadow-[0_10px_30px_-18px_rgba(17,17,17,0.12)] sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-display text-[16.5px] font-semibold text-[#111111]">Recent Payment</h2>
                <button
                  type="button"
                  onClick={() => setModal({ kind: "receipts" })}
                  className="group inline-flex items-center gap-1 text-[12px] font-semibold text-[#2E7D32] transition-colors hover:text-[#155B32]"
                >
                  View All
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={2.4} />
                </button>
              </div>

              {completedTransactions.length > 0 && (() => {
                const recent = completedTransactions[0]!;
                return (
                  <div className="mt-4 rounded-2xl border border-[#BFE3C5]/70 bg-[#F0FAF1] p-4">
                    <div className="flex items-center gap-3.5">
                      <CropThumb tx={recent} size={56} />
                      <div className="min-w-0 flex-1">
                        <p className="text-[14px] font-bold text-[#111111]">
                          {recent.crop} ({recent.variety})
                        </p>
                        <p className="mt-0.5 text-[11.5px] text-[#777777]">To: {recent.supplierName} ({recent.supplierType})</p>
                        <p className="mt-0.5 flex items-center gap-1 text-[11px] text-[#777777]">
                          <Leaf className="h-3 w-3 text-[#2E7D32]" />
                          Order {recent.orderId}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-display text-[19px] font-bold text-[#155B32]">₹ {recent.amount.toLocaleString("en-IN")}</p>
                        <p className="mt-1 flex items-center justify-end gap-1.5 text-[11px] font-semibold text-[#2E7D32]">
                          <Check className="h-3.5 w-3.5" strokeWidth={2.6} />
                          Completed
                        </p>
                      </div>
                    </div>
                    <p className="mt-3.5 flex items-center justify-between text-[11.5px] text-[#8A938A]">
                      <span>Date: <span className="font-semibold text-[#555555]">{recent.paymentDate}</span></span>
                      <span className="font-semibold text-[#555555]">{recent.method}</span>
                    </p>
                    <button
                      type="button"
                      onClick={() => openReceipt(recent)}
                      className="mt-4 inline-flex h-[44px] w-full items-center justify-center rounded-xl bg-[#2E7D32] text-[13px] font-semibold text-white transition-all duration-200 hover:bg-[#256628]"
                    >
                      View Receipt
                    </button>
                  </div>
                );
              })()}
              {completedTransactions.length === 0 && (
                <p className="mt-4 rounded-xl border border-dashed border-[#D8DED8] bg-[#FAFBFA] px-4 py-6 text-center text-[12px] text-[#777777]">
                  No completed payments yet — receipts will appear here as you settle orders.
                </p>
              )}
            </section>
          </div>
        </div>

        {/* Bottom information cards */}
        <div className="grid gap-5 lg:grid-cols-3">
          <section className="flex flex-col rounded-2xl border border-[#BFE3C5] bg-[#F0FAF1] p-5">
            <span className="grid h-[46px] w-[46px] place-items-center rounded-2xl bg-[#2E7D32] text-white">
              <ShieldCheck className="h-[22px] w-[22px]" strokeWidth={2} />
            </span>
            <h2 className="mt-4 font-display text-[15.5px] font-semibold text-[#155B32]">100% Secure Payments</h2>
            <p className="mt-1.5 flex-1 text-[12px] leading-relaxed text-[#3E5B47]">
              Your payments are protected with bank-level security.
            </p>
            <button
              type="button"
              onClick={() => showToast("Payment security guide — encryption, verification and dispute support (demo).")}
              className="group mt-4 inline-flex items-center gap-1 text-[12.5px] font-semibold text-[#2E7D32] transition-colors hover:text-[#155B32]"
            >
              Learn More
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={2.4} />
            </button>
          </section>

          <section className="flex flex-col rounded-2xl border border-[#DCEAF7] bg-[#F3F8FD] p-5">
            <span className="grid h-[46px] w-[46px] place-items-center rounded-2xl bg-[#1D6FB8] text-white">
              <Users className="h-[22px] w-[22px]" strokeWidth={2} />
            </span>
            <h2 className="mt-4 font-display text-[15.5px] font-semibold text-[#111111]">Direct Support to Farmers</h2>
            <p className="mt-1.5 flex-1 text-[12px] leading-relaxed text-[#666666]">
              Your payments help farmers and FPOs grow.
            </p>
            <button
              type="button"
              onClick={() => showToast("Your procurement this season has supported 24 farmers and 6 FPOs across West Bengal (demo).")}
              className="group mt-4 inline-flex items-center gap-1 text-[12.5px] font-semibold text-[#1D6FB8] transition-colors hover:text-[#175C99]"
            >
              Our Impact
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={2.4} />
            </button>
          </section>

          <section className="flex flex-col rounded-2xl border border-[#E3D3F4] bg-[#F7F2FD] p-5">
            <span className="grid h-[46px] w-[46px] place-items-center rounded-2xl bg-[#7C3AED] text-white">
              <Phone className="h-[22px] w-[22px]" strokeWidth={2} />
            </span>
            <h2 className="mt-4 font-display text-[15.5px] font-semibold text-[#111111]">Need Help?</h2>
            <p className="mt-1.5 flex-1 text-[12px] leading-relaxed text-[#666666]">
              Our support team is here to assist you with any payment related queries.
            </p>
            <Link
              to="/buyer/help-support"
              className="mt-4 inline-flex h-[42px] items-center justify-center rounded-xl bg-[#7C3AED] text-[12.5px] font-semibold text-white transition-colors hover:bg-[#682ec9]"
            >
              Contact Support
            </Link>
          </section>
        </div>
      </div>

      {/* =============================== Modals =============================== */}

      {/* Receipt modal */}
      {modal?.kind === "receipt" && (
        <ModalShell title={`Receipt ${modal.transaction.id}`} onClose={() => setModal(null)}>
          {(() => {
            const transaction = modal.transaction;
            const meta = PAYMENT_STATUS_META[transaction.status];
            const rows: [string, string][] = [
              ["Payment ID", transaction.id],
              ["Order ID", transaction.orderId],
              ["Crop", `${transaction.crop} (${transaction.variety})`],
              ["Supplier", `${transaction.supplierName} (${transaction.supplierType})`],
              ["Amount", `₹ ${transaction.amount.toLocaleString("en-IN")}`],
              ["Payment Method", transaction.method],
              ["Payment Date", transaction.paymentDate],
            ];
            return (
              <>
                <div className="flex items-center gap-3.5 rounded-2xl border border-[#BFE3C5]/70 bg-[#F0FAF1] p-4">
                  <CropThumb tx={transaction} size={56} />
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-bold text-[#111111]">
                      {transaction.crop} ({transaction.variety})
                    </p>
                    <p className="mt-0.5 text-[11.5px] text-[#777777]">Order {transaction.orderId} · {transaction.location}</p>
                    <span className={cn("mt-1.5 inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold", meta.badgeClass)}>
                      {meta.label}
                    </span>
                  </div>
                  <p className="font-display text-[21px] font-bold text-[#155B32]">₹ {transaction.amount.toLocaleString("en-IN")}</p>
                </div>

                <dl className="mt-4 flex flex-col gap-2.5">
                  {rows.map(([label, value]) => (
                    <div key={label} className="flex items-baseline justify-between gap-3 border-b border-[#F0F3F0] pb-2">
                      <dt className="text-[11.5px] font-medium text-[#888888]">{label}</dt>
                      <dd className="text-right text-[12.5px] font-semibold text-[#111111]">{value}</dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-5 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setModal(null)}
                    className="inline-flex h-[46px] flex-1 items-center justify-center rounded-xl border-[1.5px] border-[#D8DED8] bg-white text-[13.5px] font-semibold text-[#444444] transition-colors hover:border-[#2E7D32]/50 hover:text-[#2E7D32]"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={() => downloadReceipt(transaction)}
                    className="inline-flex h-[46px] items-center justify-center gap-2 rounded-xl bg-[#2E7D32] text-[13.5px] font-semibold text-white transition-all duration-200 hover:bg-[#256628]"
                  >
                    <Download className="h-4 w-4" strokeWidth={2.2} />
                    Download Receipt
                  </button>
                </div>
              </>
            );
          })()}
        </ModalShell>
      )}

      {/* Pay Now modal */}
      {modal?.kind === "pay" && (
        <ModalShell title={paySuccess ? "Payment Successful" : "Confirm Payment"} onClose={() => setModal(null)}>
          {(() => {
            const transaction = modal.transaction;
            if (paySuccess) {
              return (
                <div className="flex flex-col items-center gap-3 py-2 text-center">
                  <span className="grid h-[68px] w-[68px] place-items-center rounded-full bg-[#EAF6EA]">
                    <Check className="h-8 w-8 text-[#2E7D32]" strokeWidth={2.6} />
                  </span>
                  <h3 className="font-display text-[19px] font-bold text-[#111111]">Payment completed successfully!</h3>
                  <p className="max-w-sm text-[12.5px] leading-relaxed text-[#666666]">
                    ₹ {paySuccess.amount.toLocaleString("en-IN")} settled to {paySuccess.supplierName} via {paySuccess.method}.
                    Receipts are available for download anytime.
                  </p>
                  <div className="flex w-full gap-3">
                    <button
                      type="button"
                      onClick={() => setModal(null)}
                      className="inline-flex h-[46px] flex-1 items-center justify-center rounded-xl border-[1.5px] border-[#D8DED8] bg-white text-[13.5px] font-semibold text-[#444444] transition-colors hover:border-[#2E7D32]/50 hover:text-[#2E7D32]"
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      onClick={() => openReceipt(paySuccess)}
                      className="inline-flex h-[46px] flex-1 items-center justify-center rounded-xl bg-[#2E7D32] text-[13.5px] font-semibold text-white transition-all duration-200 hover:bg-[#256628]"
                    >
                      View Receipt
                    </button>
                  </div>
                </div>
              );
            }

            const rows: [string, string][] = [
              ["Payment ID", transaction.id],
              ["Order", `${transaction.orderId} — ${transaction.crop} (${transaction.variety})`],
              ["Supplier", `${transaction.supplierName} (${transaction.supplierType})`],
              ["Amount", `₹ ${transaction.amount.toLocaleString("en-IN")}`],
            ];

            return (
              <>
                <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[11.5px] font-bold uppercase tracking-wide text-amber-700">Amount Payable</p>
                      <p className="mt-0.5 font-display text-[22px] font-bold text-[#7A1F1F]">₹ {transaction.amount.toLocaleString("en-IN")}</p>
                    </div>
                    <CropThumb tx={transaction} size={56} />
                  </div>
                  <p className="mt-2 text-[11.5px] leading-relaxed text-[#8A5B18]">
                    Pay via your selected method to mark this invoice as settled.
                  </p>
                </div>

                <dl className="mt-4 flex flex-col gap-2.5">
                  {rows.map(([label, value]) => (
                    <div key={label} className="flex items-baseline justify-between gap-3 border-b border-[#F0F3F0] pb-2">
                      <dt className="text-[11.5px] font-medium text-[#888888]">{label}</dt>
                      <dd className="text-right text-[12.5px] font-semibold text-[#111111]">{value}</dd>
                    </div>
                  ))}
                </dl>

                <form onSubmit={(e) => { e.preventDefault(); completePay(); }} className="mt-4 flex flex-col gap-4">
                  <div>
                    <p className="mb-2.5 text-[12px] font-semibold text-[#111111]">Select Payment Method</p>
                    <div className="flex flex-col gap-2">
                      {PAYMENT_METHODS.map((method) => (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() => setSelectedMethodId(method.id)}
                          className={cn(
                            "flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition-all duration-150",
                            selectedMethodId === method.id
                              ? "border-[#2E7D32] bg-[#F0FAF1] shadow-[0_8px_18px_-8px_rgba(46,125,50,0.35)]"
                              : "border-[#E1E5E1] bg-white hover:border-[#2E7D32]/40"
                          )}
                        >
                          <span className="flex items-center gap-3">
                            <span className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-lg", method.tone)}>
                              {method.kind === "upi" ? <CreditCard className="h-4 w-4" strokeWidth={2} /> : <Landmark className="h-4 w-4" strokeWidth={2} />}
                            </span>
                            <span>
                              <span className="block text-[13px] font-semibold text-[#111111]">{method.label}</span>
                              <span className="block text-[10.5px] text-[#777777]">{method.detail}</span>
                            </span>
                          </span>
                          {selectedMethodId === method.id && <Check className="h-4 w-4 shrink-0 text-[#2E7D32]" strokeWidth={2.6} />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      onClick={() => setModal(null)}
                      className="inline-flex h-[48px] items-center justify-center rounded-xl border-[1.5px] border-[#D8DED8] bg-white px-6 text-[13.5px] font-semibold text-[#444444] transition-colors hover:border-[#2E7D32]/50 hover:text-[#2E7D32]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={processing}
                      aria-busy={processing}
                      className="inline-flex h-[48px] items-center justify-center gap-2 rounded-xl bg-[#2E7D32] px-7 text-[14px] font-semibold text-white shadow-[0_10px_22px_-10px_rgba(46,125,50,0.55)] transition-all duration-200 enabled:hover:bg-[#256628] disabled:cursor-wait disabled:opacity-85"
                    >
                      {processing ? (
                        <>
                          <BarChart3 className="h-4 w-4 animate-spin" strokeWidth={2.4} />
                          Processing...
                        </>
                      ) : (
                        <>
                          Confirm &amp; Pay ₹ {transaction.amount.toLocaleString("en-IN")}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </>
            );
          })()}
        </ModalShell>
      )}

      {/* Payment methods modal */}
      {modal?.kind === "methods" && (
        <ModalShell title="Payment Methods" onClose={() => setModal(null)}>
          <p className="-mt-1 text-[12.5px] text-[#666666]">Linked cards, UPI accounts and settlement banks (demo).</p>

          <div className="mt-5 flex flex-col gap-3">
            {PAYMENT_METHODS.map((method) => (
              <div key={method.id} className="flex flex-col gap-3 rounded-2xl border border-[#E1E5E1] bg-[#F7FAF7] p-4">
                <div className="flex items-center gap-3">
                  <span className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-xl", method.tone)}>
                    {method.kind === "upi" ? <CreditCard className="h-[20px] w-[20px]" strokeWidth={2} /> : <Landmark className="h-[20px] w-[20px]" strokeWidth={2} />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13.5px] font-semibold text-[#111111]">{method.label}</p>
                    <p className="mt-0.5 text-[11px] text-[#777777]">{method.detail}</p>
                  </div>
                  <span className="flex items-center gap-1.5 rounded-full bg-[#EAF6EA] px-2.5 py-1 text-[10px] font-bold text-[#2E7D32]">
                    <Check className="h-3 w-3" strokeWidth={2.6} />
                    {method.kind === "upi" ? "Primary" : "Verified"}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => showToast(`${method.label} set as default for settlement (demo).`)}
                    className="inline-flex h-9 flex-1 items-center justify-center rounded-lg border-[1.5px] border-[#2E7D32] bg-white px-3.5 text-[12px] font-semibold text-[#2E7D32] transition-colors hover:bg-[#EAF6EA]"
                  >
                    Set Default
                  </button>
                  <button
                    type="button"
                    onClick={() => showToast(`Manage ${method.label} — editing comes with your account API (demo).`)}
                    className="inline-flex h-9 flex-1 items-center justify-center rounded-lg border-[1.5px] border-[#D8DED8] bg-white px-3.5 text-[12px] font-semibold text-[#444444] transition-colors hover:border-[#2E7D32]/40 hover:text-[#2E7D32]"
                  >
                    Manage
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => showToast("Adding a new payment method requires secure verification — coming with your account API (demo).")}
              className="group inline-flex h-[46px] items-center justify-center gap-2 rounded-xl border-[1.5px] border-dashed border-[#2E7D32]/50 bg-[#EAF6EA]/40 px-6 text-[13px] font-semibold text-[#2E7D32] transition-colors hover:bg-[#EAF6EA]"
            >
              <CreditCard className="h-4 w-4" strokeWidth={2.2} />
              Add New Payment Method
            </button>
          </div>
        </ModalShell>
      )}

      {/* Receipts list modal */}
      {modal?.kind === "receipts" && (
        <ModalShell title="Payment Receipts" onClose={() => setModal(null)} wide>
          <p className="-mt-1 text-[12.5px] text-[#666666]">Download any settled-payment proof, anytime.</p>

          <ul className="mt-5 flex max-h-[55dvh] flex-col gap-3 overflow-y-auto pr-1">
            {completedTransactions.map((transaction) => (
              <li key={transaction.id} className="flex flex-wrap items-center gap-3 rounded-2xl border border-[#E1E5E1] bg-white p-3.5 sm:gap-4">
                <CropThumb tx={transaction} />
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold text-[#111111]">
                    {transaction.crop} ({transaction.variety}) — Order {transaction.orderId}
                  </p>
                  <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-[#777777]">
                    <span>{transaction.paymentDate}</span>
                    <span className="font-semibold text-[#2E7D32]">₹ {transaction.amount.toLocaleString("en-IN")}</span>
                    <span>{transaction.method}</span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => openReceipt(transaction)}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg border-[1.5px] border-[#2E7D32] bg-white px-3.5 text-[12px] font-semibold text-[#2E7D32] transition-colors hover:bg-[#EAF6EA]"
                >
                  <Download className="h-3.5 w-3.5" strokeWidth={2.2} />
                  Download
                </button>
              </li>
            ))}
          </ul>

          {completedTransactions.length === 0 && (
            <p className="mt-5 rounded-xl border border-dashed border-[#D8DED8] bg-[#FAFBFA] px-4 py-8 text-center text-[12.5px] text-[#777777]">
              Once payments complete, you'll find every downloadable receipt here.
            </p>
          )}
        </ModalShell>
      )}

      {/* Transaction history modal */}
      {modal?.kind === "history" && (
        <ModalShell title="Transaction History" onClose={() => setModal(null)} wide>
          <p className="-mt-1 text-[12.5px] text-[#666666]">Every settlement — past and present (demo).</p>

          <ul className="mt-5 flex max-h-[55dvh] flex-col gap-2.5 overflow-y-auto pr-1">
            {[...transactions].sort((a, b) => b.paymentDateIso.localeCompare(a.paymentDateIso)).map((transaction) => {
              const meta = PAYMENT_STATUS_META[transaction.status];
              return (
                <li key={transaction.id} className="flex items-center gap-3.5 rounded-xl border border-[#E1E5E1] bg-white p-3.5">
                  <CropThumb tx={transaction} size={40} />
                  <div className="min-w-0 flex-1">
                    <p className="text-[12.5px] font-semibold text-[#111111]">
                      {transaction.id} · Order {transaction.orderId}
                    </p>
                    <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-[#777777]">
                      <span>{transaction.crop}</span>
                      <span>{transaction.paymentDate}</span>
                      <span className="font-semibold text-[#2E7D32]">₹ {transaction.amount.toLocaleString("en-IN")}</span>
                    </p>
                  </div>
                  <span className={cn("shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold", meta.badgeClass)}>
                    {meta.label}
                  </span>
                </li>
              );
            })}
          </ul>
        </ModalShell>
      )}

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
    </BuyerDashboardLayout>
  );
}

function PaymentRowMenu({
  isPending,
  onAction,
}: {
  isPending: boolean;
  onAction: (action: "receipt" | "download" | "pay" | "contact") => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const items: { action: "receipt" | "download" | "pay" | "contact"; label: string; icon: typeof Eye; tone?: string }[] = [
    { action: "receipt", label: "View Receipt", icon: Eye },
    { action: "download", label: "Download Receipt", icon: Download },
  ];
  if (isPending) items.push({ action: "pay", label: "Pay Now", icon: Wallet });
  items.push({ action: "contact", label: "Contact Supplier", icon: MessageCircle });

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        aria-expanded={open}
        aria-label="More actions"
        className="grid h-8 w-8 place-items-center rounded-lg text-[#999999] transition-colors hover:bg-[#EAF6EA] hover:text-[#2E7D32]"
      >
        <EllipsisVertical className="h-[18px] w-[18px]" strokeWidth={2} />
      </button>
      {open && (
        <div className="animate-pop-in absolute top-[calc(100%+6px)] right-0 z-30 w-[190px] rounded-xl border border-[#E1E5E1] bg-white p-1.5 shadow-[0_18px_44px_-16px_rgba(17,17,17,0.25)]">
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
                onAction(item.action);
              }}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-[12.5px] font-medium transition-colors hover:bg-[#F0FAF1] hover:text-[#2E7D32]"
            >
              <item.icon className="h-4 w-4 shrink-0" strokeWidth={2.1} />
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
