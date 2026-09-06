import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import { PackageOpen, Search, X } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import OrderCard from "../components/orders/OrderCard";
import type { OrderCardAction } from "../components/orders/OrderCard";
import OrderDetailsPanel from "../components/orders/OrderDetailsPanel";
import OrderFilters from "../components/orders/OrderFilters";
import { EMPTY_ORDER_FILTERS } from "../components/orders/OrderFilters";
import type { OrderFilterValues } from "../components/orders/OrderFilters";
import OrderStats from "../components/orders/OrderStats";
import type { Order } from "../data/orders";
import { buildReceiptText, INITIAL_ORDERS, isDeliveredLike } from "../data/orders";
import { cn } from "../../utils/cn";

type OrderTabKey = "all" | "ongoing" | "delivered" | "cancelled";

const TABS: { key: OrderTabKey; label: string }[] = [
  { key: "all", label: "All Orders" },
  { key: "ongoing", label: "Ongoing" },
  { key: "delivered", label: "Delivered" },
  { key: "cancelled", label: "Cancelled" },
];

/* ------------------------- Track-by-Order-ID modal ------------------------- */

function TrackByIdModal({
  onClose,
  onFound,
}: {
  onClose: () => void;
  onFound: (query: string) => boolean;
}) {
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query.trim()) {
      setError("Enter an Order ID to track.");
      return;
    }
    if (!onFound(query.trim())) {
      setError(`No order found matching "${query.trim()}".`);
    }
  };

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
      aria-label="Track by Order ID"
      onClick={onClose}
    >
      <form
        onSubmit={submit}
        className="animate-pop-in w-full max-w-[430px] rounded-3xl bg-white p-6 shadow-2xl sm:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-[18px] font-bold text-[#111111]">Track by Order ID</h2>
            <p className="mt-1 text-[12.5px] text-[#666666]">Enter an order ID to jump straight to its tracking details.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[#E1E5E1] text-[#666666] transition-colors hover:bg-[#EAF6EA] hover:text-[#2E7D32]">
            <X className="h-[18px] w-[18px]" />
          </button>
        </div>

        <div className="relative mt-5">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#8A938A]" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. ORD2505261001"
            aria-label="Order ID"
            className="h-[48px] w-full rounded-xl border border-[#E1E5E1] bg-[#FAFBFA] pr-3.5 pl-10 text-[13.5px] font-semibold text-[#111111] transition-colors outline-none placeholder:font-normal placeholder:text-[#999999] focus:border-[#2E7D32] focus:bg-white"
          />
        </div>
        {error && <p role="alert" className="mt-2 text-[12px] font-medium text-red-500">{error}</p>}

        <button type="submit" className="mt-5 inline-flex h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-[#2E7D32] text-[14px] font-semibold text-white transition-colors hover:bg-[#256628]">
          <Search className="h-4 w-4" strokeWidth={2.4} />
          Track Order
        </button>
      </form>
    </div>
  );
}

/* --------------------------------- Page ----------------------------------- */

export default function OrdersTrackingPage() {
  const [orders] = useState<Order[]>(INITIAL_ORDERS);
  const [selectedId, setSelectedId] = useState(INITIAL_ORDERS[0]!.id);
  const [tab, setTab] = useState<OrderTabKey>("all");
  const [filters, setFilters] = useState<OrderFilterValues>(EMPTY_ORDER_FILTERS);
  const [trackModal, setTrackModal] = useState(false);
  const [toast, setToast] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(t);
  }, [toast]);

  /* ------------------------------ Derived lists ------------------------------ */
  const counts = useMemo<Record<OrderTabKey, number>>(
    () => ({
      all: orders.length,
      ongoing: orders.filter((o) => o.status === "in_transit").length,
      delivered: orders.filter((o) => isDeliveredLike(o.status)).length,
      cancelled: orders.filter((o) => o.status === "cancelled").length,
    }),
    [orders]
  );

  const cropOptions = useMemo(() => ["All Crops", ...Array.from(new Set(orders.map((o) => o.cropKey)))], [orders]);

  const visibleOrders = useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    return orders.filter((o) => {
      if (tab === "ongoing" && o.status !== "in_transit") return false;
      if (tab === "delivered" && !isDeliveredLike(o.status)) return false;
      if (tab === "cancelled" && o.status !== "cancelled") return false;
      if (filters.crop !== "All Crops" && o.cropKey !== filters.crop) return false;
      if (filters.status !== "All Status") {
        const label = o.status === "in_transit" ? "In Transit" : o.status === "delivered" ? "Delivered" : o.status === "payment_completed" ? "Payment Completed" : "Cancelled";
        if (label !== filters.status) return false;
      }
      if (filters.from && o.orderIso < filters.from) return false;
      if (filters.to && o.orderIso > filters.to) return false;
      if (q && ![o.id, o.buyerName, o.crop, o.cropKey].some((f) => f.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [orders, tab, filters]);

  const selectedOrder = orders.find((o) => o.id === selectedId) ?? visibleOrders[0] ?? orders[0];

  /* -------------------------------- Actions --------------------------------- */
  const selectAndScroll = (id: string) => {
    setSelectedId(id);
    if (window.innerWidth < 1280) {
      window.setTimeout(() => panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
    }
  };

  const handleAction = (order: Order, action: OrderCardAction) => {
    if (action === "receipt") {
      const blob = new Blob([buildReceiptText(order)], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `kisansetu-receipt-${order.id}.txt`;
      anchor.click();
      URL.revokeObjectURL(url);
      setToast(`Receipt for ${order.id} downloaded.`);
      return;
    }
    selectAndScroll(order.id);
  };

  const trackById = (query: string): boolean => {
    const q = query.toLowerCase();
    const found = orders.find((o) => o.id.toLowerCase().includes(q));
    if (!found) return false;
    setTrackModal(false);
    setTab("all");
    selectAndScroll(found.id);
    setToast(`Now tracking ${found.id}.`);
    return true;
  };

  const resetAll = () => {
    setTab("all");
    setFilters(EMPTY_ORDER_FILTERS);
  };

  /* --------------------------------- Render --------------------------------- */
  return (
    <DashboardLayout>
      <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-5 sm:gap-6">
        {/* Page header */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-[24px] font-bold tracking-[-0.01em] text-[#111111] sm:text-[28px]">
              Orders &amp; Tracking
            </h1>
            <p className="mt-1 text-[13.5px] text-[#666666]">
              View all your confirmed orders, track delivery status, and manage transactions.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setTrackModal(true)}
            className="inline-flex h-[46px] items-center gap-2 rounded-xl bg-[#2E7D32] px-5 text-[14px] font-semibold text-white shadow-[0_12px_24px_-10px_rgba(46,125,50,0.55)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#256628]"
          >
            <Search className="h-[17px] w-[17px]" strokeWidth={2.4} />
            Track by Order ID
          </button>
        </div>

        {/* Tabs */}
        <div className="no-scrollbar flex items-end gap-7 overflow-x-auto border-b border-[#E1E5E1]" role="tablist" aria-label="Order status">
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

        {/* Summary stats (computed live) */}
        <OrderStats orders={orders} />

        {/* Filters */}
        <OrderFilters values={filters} cropOptions={cropOptions} onChange={(patch) => setFilters((f) => ({ ...f, ...patch }))} />

        {/* List + details */}
        <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_400px]">
          <div className="flex min-w-0 flex-col gap-4">
            {visibleOrders.length === 0 ? (
              <div className="flex flex-col items-center gap-3 rounded-2xl border border-[#E1E5E1] bg-white px-6 py-14 text-center">
                <span className="grid h-14 w-14 place-items-center rounded-full bg-[#EAF6EA] text-[#2E7D32]">
                  <PackageOpen className="h-6 w-6" strokeWidth={1.9} />
                </span>
                <p className="text-[14px] font-semibold text-[#111111]">No orders match your filters</p>
                <p className="max-w-xs text-[12.5px] text-[#666666]">Try a different tab, crop, status, date range or search text.</p>
                <button
                  type="button"
                  onClick={resetAll}
                  className="mt-1 inline-flex h-10 items-center rounded-xl bg-[#2E7D32] px-5 text-[12.5px] font-semibold text-white transition-colors hover:bg-[#256628]"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              visibleOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  selected={selectedOrder?.id === order.id}
                  onAction={(action) => handleAction(order, action)}
                />
              ))
            )}
          </div>

          <div ref={panelRef} className="scroll-mt-[100px]">
            {selectedOrder && <OrderDetailsPanel order={selectedOrder} />}
          </div>
        </div>
      </div>

      {trackModal && <TrackByIdModal onClose={() => setTrackModal(false)} onFound={trackById} />}

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
