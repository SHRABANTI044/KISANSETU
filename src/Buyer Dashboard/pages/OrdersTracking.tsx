import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  BarChart3,
  Check,
  ChevronDown,
  ChevronRight,
  CircleAlert,
  ClipboardList,
  EllipsisVertical,
  Eye,
  Headset,
  Leaf,
  MapPin,
  MessageCircle,
  Package,
  PackageCheck,
  PackageOpen,
  Phone,
  RotateCcw,
  Scale,
  Search,
  ShieldCheck,
  Star,
  Sprout,
  TrendingUp,
  Truck,
  TruckIcon,
  User,
  Users,
  X,
} from "lucide-react";
import BuyerDashboardLayout from "../layouts/BuyerDashboardLayout";
import type {
  BuyerOrder,
  BuyerOrderStatus,
  OrderTracking,
  TrackingStage,
} from "../data/buyerOrdersData";
import {
  INITIAL_BUYER_ORDERS,
  ORDER_STATS,
  ORDER_STATUS_META,
  ORDER_TRACKING,
} from "../data/buyerOrdersData";
import { cn } from "../../utils/cn";
import { useBuyerToast } from "../hooks/useBuyerToast";

type OrderTabKey = "all" | BuyerOrderStatus;

const TABS: { key: OrderTabKey; label: string; count: number }[] = [
  { key: "all", label: "All Orders", count: ORDER_STATS.total },
  { key: "pending", label: "Pending", count: ORDER_STATS.pending },
  { key: "in_transit", label: "In Transit", count: ORDER_STATS.inTransit },
  { key: "delivered", label: "Delivered", count: ORDER_STATS.delivered },
  { key: "cancelled", label: "Cancelled", count: ORDER_STATS.cancelled },
];

const DATE_RANGES = ["Last 7 Days", "Last 30 Days", "Last 3 Months", "All Time"];
const DEMO_TODAY = new Date("2026-05-27T00:00:00");

function cutoffIso(days: number): string {
  const d = new Date(DEMO_TODAY.getTime() - days * 86_400_000);
  return d.toISOString().slice(0, 10);
}

function cropTileClass(key: BuyerOrder["cropKey"]): string {
  const map: Record<BuyerOrder["cropKey"], string> = {
    paddy: "bg-amber-100 text-amber-700",
    wheat: "bg-[#F0E2B8] text-[#C08A18]",
    maize: "bg-[#DCEAF7] text-[#1D6FB8]",
    moong: "bg-emerald-100 text-emerald-700",
    potato: "bg-orange-100 text-orange-600",
    onion: "bg-violet-100 text-violet-700",
  };
  return map[key];
}

function CropThumb({ order, size = 48 }: { order: BuyerOrder; size?: number }) {
  const style = { height: size, width: size };
  if (order.image) {
    return <img src={order.image} alt={order.crop} className="shrink-0 rounded-xl object-cover" style={style} />;
  }
  return (
    <span className={cn("grid shrink-0 place-items-center rounded-xl", cropTileClass(order.cropKey))} style={style}>
      <Sprout className="h-[22px] w-[22px]" strokeWidth={1.9} />
    </span>
  );
}

function SupplierBadge({ type }: { type: BuyerOrder["supplierType"] }) {
  return (
    <span className={cn(
      "rounded-full px-2 py-0.5 text-[9.5px] font-bold",
      type === "Farmer" ? "bg-[#EAF6EA] text-[#2E7D32]" : "bg-violet-100 text-violet-700"
    )}>
      {type}
    </span>
  );
}

/* ------------------------------ Row menu ---------------------------------- */

function OrderRowMenu({
  onAction,
}: {
  onAction: (action: "details" | "track" | "supplier" | "contact") => void;
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

  const items = [
    { action: "details" as const, label: "View Details", icon: Eye },
    { action: "track" as const, label: "Track Order", icon: Truck },
    { action: "supplier" as const, label: "View Supplier", icon: Users },
    { action: "contact" as const, label: "Contact Supplier", icon: MessageCircle },
  ];

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
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-[12.5px] font-medium text-[#444444] transition-colors hover:bg-[#F0FAF1] hover:text-[#2E7D32]"
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

/* --------------------------- Order details modal -------------------------- */

function ModalShell({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
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
        className="animate-pop-in max-h-[92dvh] w-full max-w-[480px] overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-7"
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
            <X className="h-[18px] w-[18px]" />
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}

function OrderDetailsModal({
  order,
  tracking,
  onClose,
}: {
  order: BuyerOrder;
  tracking: OrderTracking;
  onClose: () => void;
}) {
  const meta = ORDER_STATUS_META[order.status];
  const rows: [string, string][] = [
    ["Order ID", order.id],
    ["Crop", `${order.crop} (${order.variety})`],
    ["Supplier", `${order.supplierName} (${order.supplierType})`],
    ["Quantity", `${order.quantityQuintal.toLocaleString("en-IN")} Quintal`],
    ["Order Value", `₹ ${order.orderValue.toLocaleString("en-IN")}`],
    ["Order Date", order.orderDate],
    ["Expected Delivery", order.expectedDelivery],
  ];

  return (
    <ModalShell title="Order Details" onClose={onClose}>
      <span className={cn("inline-flex rounded-full px-3 py-1 text-[10.5px] font-bold", meta.badgeClass)}>
        {meta.label}
      </span>

      <dl className="mt-4 flex flex-col gap-2.5">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-baseline justify-between gap-3 border-b border-[#F0F3F0] pb-2">
            <dt className="text-[12px] font-medium text-[#777777]">{label}</dt>
            <dd className="text-right text-[12.5px] font-semibold text-[#111111]">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-4 flex items-center gap-3 rounded-2xl border border-[#BFE3C5]/70 bg-[#F0FAF1] px-4 py-3">
        <Truck className="h-5 w-5 shrink-0 text-[#2E7D32]" strokeWidth={2} />
        <div>
          <p className="text-[12px] font-bold text-[#155B32]">{tracking.messageTitle}</p>
          <p className="mt-0.5 text-[11px] leading-relaxed text-[#4A6B52]">{tracking.shipment.partner} · ETA: {tracking.etaLabel}</p>
        </div>
      </div>
    </ModalShell>
  );
}

/* ------------------------------ Tracking ---------------------------------- */

function TrackingTimeline({ stages }: { stages: TrackingStage[] }) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
      {stages.map((stage, i) => (
        <div key={stage.label} className="flex items-center gap-3.5 lg:flex-1 lg:flex-col lg:gap-2">
          <span
            className={cn(
              "relative z-10 grid h-[30px] w-[30px] shrink-0 place-items-center rounded-full text-[11px] font-bold ring-4",
              stage.state === "done" && "bg-[#2E7D32] text-white ring-[#EAF6EA]",
              stage.state === "current" && "bg-sky-500 text-white ring-sky-100",
              stage.state === "future" && "border-2 border-[#D8DED8] bg-white text-[#B0B6B0] ring-transparent"
            )}
          >
            {stage.state === "done" ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : stage.state === "current" ? <Truck className="h-3.5 w-3.5" strokeWidth={2.2} aria-label="Current stage" /> : <span className="h-1.5 w-1.5 rounded-full bg-[#C9CEC9]" aria-hidden="true" />}
          </span>
          <div className="text-left lg:text-center">
            <p
              className={cn(
                "text-[13px] leading-tight font-semibold",
                stage.state === "future" ? "text-[#999999]" : "text-[#111111]"
              )}
            >
              {stage.label}
            </p>
            <p className={cn("mt-0.5 text-[10.5px]", stage.state === "future" ? "text-[#B0B6B0]" : "text-[#888888]")}>
              {stage.date}{stage.time !== "—" ? ` · ${stage.time}` : ""}
            </p>
            {stage.state === "current" && (
              <span className="mt-1 inline-flex rounded-full bg-sky-100 px-2 py-0.5 text-[9px] font-bold tracking-wide text-sky-700 uppercase">
                Current
              </span>
            )}
          </div>
          {i < stages.length - 1 && (
            <span
              aria-hidden="true"
              className={cn(
                "ml-[13px] h-6 w-[2px] rounded-full lg:ml-0 lg:h-[2px] lg:flex-1",
                stage.state === "done" ? "bg-[#2E7D32]/60" : "bg-[#E1E5E1]"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function ShipmentDetailsCard({ tracking }: { tracking: OrderTracking }) {
  const shipment = tracking.shipment;
  const rows: [string, string, React.ReactNode][] = [
    ["Transport Partner", shipment.partner, <Truck key="t" className="h-4 w-4 text-[#2E7D32]" strokeWidth={2} aria-hidden="true" />],
    ["Vehicle No.", shipment.vehicleNo, <Package key="v" className="h-4 w-4 text-[#2E7D32]" strokeWidth={2} aria-hidden="true" />],
    ["Driver", shipment.driver, <User key="d" className="h-4 w-4 text-[#2E7D32]" strokeWidth={2} aria-hidden="true" />],
    ["Driver Phone", shipment.phone, <Phone key="p" className="h-4 w-4 text-[#2E7D32]" strokeWidth={2} aria-hidden="true" />],
    ["Current Location", shipment.currentLocation, <MapPin key="l" className="h-4 w-4 text-[#2E7D32]" strokeWidth={2} aria-hidden="true" />],
  ];

  return (
    <section className="rounded-2xl border border-[#E1E5E1] bg-white p-5 sm:p-6 shadow-[0_10px_30px_-18px_rgba(17,17,17,0.12)]">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-display text-[16px] font-semibold text-[#111111]">Shipment Details</h3>
        <span className="rounded-full bg-[#EAF6EA] px-2.5 py-1 text-[10px] font-bold text-[#2E7D32]">Updated: {tracking.shipment.updatedAt}</span>
      </div>

      <dl className="mt-5 flex flex-col gap-4">
        {rows.map(([label, value, icon], i) => (
          <div key={`${label}-${i}`} className="flex items-center gap-3 border-b border-[#F0F3F0] pb-3 last:border-0">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#EAF6EA]">{icon}</span>
            <div className="min-w-0 flex-1">
              <p className="text-[10.5px] font-medium text-[#888888]">{label}</p>
              <p className="mt-0.5 truncate text-[13px] font-semibold text-[#111111]">{value}</p>
            </div>
          </div>
        ))}
      </dl>
    </section>
  );
}

function LiveLocationPanel({ tracking, onViewDetails }: { tracking: OrderTracking; onViewDetails: () => void }) {
  const route = tracking.route;
  const hasRoute = route.destination !== "—";

  return (
    <section className="flex h-full flex-col overflow-hidden rounded-2xl border border-[#E1E5E1] bg-white shadow-[0_10px_30px_-18px_rgba(17,17,17,0.12)]">
      <div className="flex items-center justify-between gap-3 px-4 py-3.5">
        <h3 className="font-display text-[15px] font-semibold text-[#111111]">Live Location</h3>
        <span className="flex items-center gap-1.5 rounded-full bg-[#EAF6EA] px-2.5 py-1 text-[10px] font-bold text-[#2E7D32]">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#2E7D32]" aria-hidden="true" />
          Live
        </span>
      </div>

      <div className="relative flex-1 bg-[#F0FAF1]">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-60"
          style={{ backgroundImage: "radial-gradient(rgba(46,125,50,0.15) 1.2px, transparent 1.6px)", backgroundSize: "16px 16px" }}
        />
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 220" fill="none" aria-hidden="true" preserveAspectRatio="none">
          {hasRoute ? (
            <path
              d="M48 160 C 110 70, 250 150, 352 78"
              stroke="#2E7D32"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="2 8"
            />
          ) : (
            <path
              d="M60 150 C 130 90, 240 110, 340 90"
              stroke="#B9BFB9"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="2 8"
            />
          )}
        </svg>

        {/* Origin */}
        <span className="absolute flex flex-col items-center" style={{ left: "8%", top: "60%" }}>
          <span className="grid h-7 w-7 place-items-center rounded-full bg-[#155B32] text-white shadow ring-4 ring-white/70">
            <MapPin className="h-3.5 w-3.5" />
          </span>
          <span className="mt-1 max-w-[88px] truncate rounded-full bg-white px-2 py-0.5 text-[9px] font-bold text-[#155B32] shadow-sm ring-1 ring-[#E1E5E1]">
            {route.origin}
          </span>
        </span>

        {/* Truck / current */}
        <span className="absolute" style={{ left: "46%", top: "34%" }}>
          <span className={cn(
            "grid h-10 w-10 place-items-center rounded-full ring-4",
            tracking.stages.some((s) => s.state === "current") ? "bg-white text-[#2E7D32] ring-[#2E7D32]/25 shadow-[0_8px_18px_-6px_rgba(46,125,50,0.5)]" : "bg-white text-[#8A938A] ring-[#E1E5E1] shadow"
          )}>
            <Truck className="h-[18px] w-[18px]" strokeWidth={2} />
          </span>
        </span>

        {/* Destination */}
        <span className="absolute flex flex-col items-center" style={{ left: "84%", top: "22%" }}>
          <span className={cn(
            "grid h-7 w-7 place-items-center rounded-full ring-4 ring-white/70 shadow",
            hasRoute ? "bg-[#E8862D] text-white" : "bg-[#B9BFB9] text-white"
          )}>
            <MapPin className="h-3.5 w-3.5" />
          </span>
          <span className="mt-1 max-w-[88px] truncate rounded-full bg-white px-2 py-0.5 text-[9px] font-bold text-[#155B32] shadow-sm ring-1 ring-[#E1E5E1]">
            {route.destination}
          </span>
        </span>

        {/* Info card */}
        <div className="absolute bottom-3 left-3 rounded-xl border border-[#E1E5E1] bg-white/95 px-3.5 py-2.5 shadow-[0_10px_26px_-12px_rgba(17,17,17,0.3)] backdrop-blur-sm">
          <p className="text-[10px] font-bold tracking-wide text-sky-700 uppercase">
            {tracking.stages.some((s) => s.state === "current") ? "In Transit" : tracking.stages.every((s) => s.state === "done") ? "Delivered" : "Preparing"}
          </p>
          <p className="mt-0.5 text-[11.5px] font-bold text-[#111111]">{tracking.shipment.currentLocation}</p>
          <p className="text-[10.5px] font-medium text-[#777777]">ETA: {tracking.etaLabel}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onViewDetails}
        className="inline-flex h-[46px] items-center justify-center gap-1.5 border-t border-[#E1E5E1] bg-white text-[12.5px] font-semibold text-[#2E7D32] transition-colors hover:bg-[#EAF6EA]"
      >
        View Full Tracking Details
        <ChevronRight className="h-4 w-4" strokeWidth={2.4} />
      </button>
    </section>
  );
}

/* -------------------------------- Page ------------------------------------- */

export default function OrdersTracking() {
  const [orders] = useState<BuyerOrder[]>(INITIAL_BUYER_ORDERS);
  const [tab, setTab] = useState<OrderTabKey>("all");
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState(DATE_RANGES[1]!);
  const [selectedId, setSelectedId] = useState<string>(INITIAL_BUYER_ORDERS[0]!.id);
  const [filterOpen, setFilterOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [sortSelect, setSortSelect] = useState("Latest First");
  const { toast, showToast } = useBuyerToast();
  const panelRef = useRef<HTMLDivElement>(null);

  /* ----------------------------- Derived lists ------------------------------ */
  const visibleOrders = useMemo(() => {
    const q = search.trim().toLowerCase();
    const days = dateRange === "Last 7 Days" ? 7 : dateRange === "Last 30 Days" ? 30 : dateRange === "Last 3 Months" ? 92 : 3650;
    const cutoff = cutoffIso(days);

    const filtered = orders.filter((o) => {
      if (tab !== "all" && o.status !== tab) return false;
      if (o.orderDateIso < cutoff) return false;
      if (q && ![o.id, o.crop, o.variety, o.supplierName].some((f) => f.toLowerCase().includes(q))) return false;
      return true;
    });

    const sorted = [...filtered];
    switch (sortSelect) {
      case "Oldest First":
        sorted.sort((a, b) => a.orderDateIso.localeCompare(b.orderDateIso));
        break;
      case "Value: High to Low":
        sorted.sort((a, b) => b.orderValue - a.orderValue);
        break;
      case "Value: Low to High":
        sorted.sort((a, b) => a.orderValue - b.orderValue);
        break;
      default:
        sorted.sort((a, b) => b.orderDateIso.localeCompare(a.orderDateIso));
    }
    return sorted;
  }, [orders, tab, search, dateRange, sortSelect]);

  const selectedOrder = orders.find((o) => o.id === selectedId) ?? orders[0]!;
  const tracking = ORDER_TRACKING[selectedOrder.id] ?? ORDER_TRACKING[INITIAL_BUYER_ORDERS[0]!.id]!;

  /* ------------------------------ Mutations --------------------------------- */
  const selectOrder = (id: string) => {
    setSelectedId(id);
    if (window.innerWidth < 1280) {
      window.setTimeout(() => panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
    }
  };

  const viewDetails = () => setDetailsOpen(true);

  const contactSupplier = (name: string) =>
    showToast(`Contact initiated with ${name} — they typically respond within a few hours.`);

  /* --------------------------------- Render --------------------------------- */
  const summaryCards = [
    { key: "total", title: "Total Orders", value: String(ORDER_STATS.total), supporting: "↑ 3 this month", icon: ClipboardList, iconClass: "bg-[#EAF6EA] text-[#2E7D32]" },
    { key: "transit", title: "In Transit", value: String(ORDER_STATS.inTransit), supporting: "On the way", icon: Truck, iconClass: "bg-sky-100 text-sky-700" },
    { key: "delivered", title: "Delivered", value: String(ORDER_STATS.delivered), supporting: "↑ 2 this month", icon: PackageCheck, iconClass: "bg-amber-100 text-amber-700" },
    { key: "pending", title: "Pending", value: String(ORDER_STATS.pending), supporting: "Awaiting dispatch", icon: CircleAlert, iconClass: "bg-red-50 text-red-600" },
  ];

  return (
    <BuyerDashboardLayout>
      <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-5 sm:gap-6">
        {/* Page header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <span className="grid h-[52px] w-[52px] shrink-0 place-items-center rounded-2xl bg-[#EAF6EA] text-[#2E7D32]">
              <TruckIcon className="h-[25px] w-[25px]" strokeWidth={2} />
            </span>
            <div>
              <h1 className="font-display text-[24px] font-bold tracking-[-0.01em] text-[#111111] sm:text-[28px]">
                Orders &amp; Tracking
              </h1>
              <p className="mt-1 max-w-xl text-[13.5px] text-[#666666]">
                Track your orders in real-time from farm to your doorstep. Ensure transparent and
                hassle-free delivery.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3.5 rounded-2xl border border-[#BFE3C5] bg-[#F0FAF1] px-5 py-3.5">
            <span className="grid h-[42px] w-[42px] shrink-0 place-items-center rounded-2xl bg-[#2E7D32] text-white">
              <Leaf className="h-[21px] w-[21px]" strokeWidth={2} />
            </span>
            <div className="font-display text-[14px] leading-snug font-bold text-[#155B32]">
              Farm to Business
              <br />
              Fresh Produce
              <br />
              Reliable Supply Chain
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
              <p className={cn("mt-2 text-[11.5px] font-semibold", card.supporting.startsWith("↑") ? "text-[#2E7D32]" : "text-[#8A938A]")}>{card.supporting}</p>
            </article>
          ))}
        </div>

        {/* Tabs + search/filter */}
        <div className="flex flex-col gap-4 border-b border-[#E1E5E1] lg:flex-row lg:items-end lg:justify-between">
          <div className="no-scrollbar flex items-end gap-6 overflow-x-auto" role="tablist" aria-label="Order status">
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
                  {t.label} ({t.count})
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

          <div className="relative flex flex-wrap items-center gap-2.5 pb-3">
            <div className="relative">
              <select
                aria-label="Select date range"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="h-[40px] appearance-none rounded-xl border border-[#E1E5E1] bg-white pr-9 pl-3.5 text-[12.5px] font-semibold text-[#444444] transition-colors outline-none focus:border-[#2E7D32]"
              >
                {DATE_RANGES.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-[#8A938A]" />
            </div>
            <div className="relative min-w-0 flex-1 sm:w-[220px] sm:flex-none">
              <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#8A938A]" />
              <input
                type="search"
                aria-label="Search orders"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search orders (ID, crop, supplier...)"
                className="h-[40px] w-full rounded-xl border border-[#E1E5E1] bg-white pr-3.5 pl-10 text-[13px] text-[#111111] transition-colors outline-none placeholder:text-[#999999] focus:border-[#2E7D32]"
              />
            </div>
            <div className="relative">
              <button
                type="button"
                onClick={() => setFilterOpen((v) => !v)}
                aria-expanded={filterOpen}
                className="inline-flex h-[40px] items-center gap-2 rounded-xl border-[1.5px] border-[#E1E5E1] bg-white px-4 text-[12.5px] font-semibold text-[#555555] transition-colors hover:text-[#2E7D32]"
              >
                <BarChart3 className="h-4 w-4" strokeWidth={2.2} />
                Filter
              </button>
              {filterOpen && (
                <>
                  <span className="fixed inset-0 z-30 cursor-default" onClick={() => setFilterOpen(false)} aria-hidden="true" />
                  <div className="animate-pop-in absolute top-[calc(100%+8px)] right-0 z-40 w-[260px] rounded-2xl border border-[#E1E5E1] bg-white p-4 shadow-[0_20px_50px_-18px_rgba(17,17,17,0.25)]">
                    <div className="flex items-center justify-between">
                      <p className="text-[13px] font-bold text-[#111111]">Filter Orders</p>
                      <button
                        type="button"
                        onClick={() => {
                          setTab("all");
                          setSearch("");
                          setDateRange(DATE_RANGES[1]!);
                        }}
                        className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-[#666666] transition-colors hover:text-[#2E7D32]"
                      >
                        <RotateCcw className="h-3 w-3" />
                        Reset
                      </button>
                    </div>
                    <div className="mt-3.5 flex flex-col gap-3">
                      <div>
                        <span className="mb-1 block text-[10.5px] font-bold tracking-[0.08em] text-[#8A938A] uppercase">Status</span>
                        <select
                          aria-label="Status filter"
                          value={tab}
                          onChange={(e) => setTab(e.target.value as OrderTabKey)}
                          className="h-[42px] w-full appearance-none rounded-xl border border-[#E1E5E1] bg-white px-3 text-[12.5px] font-medium text-[#111111] transition-colors outline-none focus:border-[#2E7D32]"
                        >
                          {["all", "pending", "in_transit", "delivered", "cancelled"].map((o) => (
                            <option key={o} value={o}>{o.replace("_", " ").toUpperCase()}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <span className="mb-1 block text-[10.5px] font-bold tracking-[0.08em] text-[#8A938A] uppercase">Sort by</span>
                        <select
                          aria-label="Sort orders"
                          value={sortSelect}
                          onChange={(e) => setSortSelect(e.target.value)}
                          className="h-[42px] w-full appearance-none rounded-xl border border-[#E1E5E1] bg-white px-3 text-[12.5px] font-medium text-[#111111] transition-colors outline-none focus:border-[#2E7D32]"
                        >
                          {["Latest First", "Oldest First", "Value: High to Low", "Value: Low to High"].map((o) => (
                            <option key={o}>{o}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Orders table */}
        {visibleOrders.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-[#E1E5E1] bg-white px-6 py-14 text-center">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-[#EAF6EA] text-[#2E7D32]">
              <PackageOpen className="h-6 w-6" strokeWidth={1.9} />
            </span>
            <p className="text-[14px] font-semibold text-[#111111]">No orders match your filters</p>
            <p className="max-w-xs text-[12.5px] text-[#666666]">Try a different tab, date range or search term.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-[#E1E5E1] bg-white shadow-[0_10px_30px_-18px_rgba(17,17,17,0.12)]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1080px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-[#E1E5E1] bg-[#F7FAF7]">
                    {["Order ID", "Crop & Variety", "Supplier (Farmer/FPO)", "Quantity", "Order Value", "Order Date", "Expected Delivery", "Status", "Action", ""].map((head) => (
                      <th key={head} className="px-4 py-3.5 text-[10.5px] font-bold tracking-[0.08em] whitespace-nowrap text-[#777777] uppercase">
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visibleOrders.map((order) => {
                    const meta = ORDER_STATUS_META[order.status];
                    return (
                      <tr key={order.id} className="border-b border-[#F0F3F0] transition-colors last:border-0 hover:bg-[#FAFCFA]">
                        {/* Order ID */}
                        <td className="px-4 py-3.5">
                          <p className="text-[13px] font-bold whitespace-nowrap text-[#2E7D32]">{order.id}</p>
                        </td>

                        {/* Crop */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-3">
                            <CropThumb order={order} />
                            <div className="min-w-0">
                              <p className="text-[13px] leading-tight font-bold text-[#111111]">{order.crop}</p>
                              <p className="mt-0.5 text-[11px] text-[#999999]">Variety: {order.variety}</p>
                            </div>
                          </div>
                        </td>

                        {/* Supplier */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <span className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-full font-display text-[11px] font-bold", order.supplierTone)}>
                              {order.initials}
                            </span>
                            <div className="min-w-0">
                              <p className="flex items-center gap-1.5 text-[12.5px] font-semibold text-[#111111]">
                                {order.supplierName}
                                <SupplierBadge type={order.supplierType} />
                              </p>
                              <p className="mt-0.5 flex items-center gap-1 text-[10.5px] text-[#777777]">
                                <Star className="h-3 w-3 text-amber-400" fill="currentColor" />
                                <span className="font-semibold text-[#111111]">{order.rating.toFixed(1)}</span> ({order.deals} deals)
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Quantity */}
                        <td className="px-4 py-3.5 text-[12.5px] font-semibold whitespace-nowrap text-[#444444]">
                          {order.quantityQuintal.toLocaleString("en-IN")} Quintal
                        </td>

                        {/* Order value */}
                        <td className="px-4 py-3.5 font-display text-[13.5px] font-bold whitespace-nowrap text-[#2E7D32]">
                          ₹{order.orderValue.toLocaleString("en-IN")}
                        </td>

                        {/* Order date */}
                        <td className="px-4 py-3.5 text-[12px] whitespace-nowrap text-[#666666]">{order.orderDate}</td>

                        {/* Expected delivery */}
                        <td className="px-4 py-3.5 text-[12px] whitespace-nowrap text-[#666666]">
                          {order.expectedDelivery}
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3.5">
                          <span className={cn("inline-flex rounded-full px-3 py-1 text-[10.5px] font-bold whitespace-nowrap", meta.badgeClass)}>
                            {meta.label}
                          </span>
                        </td>

                        {/* Action */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1.5">
                            {order.status === "in_transit" ? (
                              <button
                                type="button"
                                onClick={() => selectOrder(order.id)}
                                className={cn(
                                  "inline-flex h-9 items-center rounded-lg border-[1.5px] border-[#2E7D32] px-3.5 text-[12px] font-semibold whitespace-nowrap text-[#2E7D32] transition-colors hover:bg-[#EAF6EA]",
                                  selectedId === order.id && "bg-[#EAF6EA]"
                                )}
                              >
                                Track
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={viewDetails}
                                className="inline-flex h-9 items-center rounded-lg border-[1.5px] border-[#2E7D32] px-3.5 text-[12px] font-semibold whitespace-nowrap text-[#2E7D32] transition-colors hover:bg-[#EAF6EA]"
                              >
                                View Details
                              </button>
                            )}
                          </div>
                        </td>

                        {/* Menu */}
                        <td className="px-2 py-3.5">
                          <OrderRowMenu onAction={(action) => {
                            if (action === "details") viewDetails();
                            else if (action === "track") selectOrder(order.id);
                            else if (action === "supplier") showToast(`Opened ${order.supplierName}'s profile context (demo).`);
                            else contactSupplier(order.supplierName);
                          }} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tracking section */}
        <div ref={panelRef} className="scroll-mt-[100px]">
          <section className="rounded-2xl border border-[#E1E5E1] bg-white p-5 shadow-[0_10px_30px_-18px_rgba(17,17,17,0.12)] sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-[17px] font-bold text-[#111111]">Order Tracking</h2>
                <p className="mt-0.5 text-[12.5px] text-[#666666]">
                  Order ID: <span className="font-semibold text-[#111111]">{selectedOrder.id}</span>
                </p>
              </div>
              <span className={cn("inline-flex rounded-full px-3 py-1 text-[10.5px] font-bold", ORDER_STATUS_META[selectedOrder.status].badgeClass)}>
                {ORDER_STATUS_META[selectedOrder.status].label}
              </span>
            </div>

            {/* Timeline */}
            <div className="mt-6">
              <TrackingTimeline stages={tracking.stages} />
            </div>

            {/* Message card */}
            <div className={cn(
              "mt-6 flex items-start gap-3 rounded-2xl px-4 py-3.5",
              selectedOrder.status === "delivered"
                ? "border border-[#BFE3C5] bg-[#F0FAF1]"
                : selectedOrder.status === "in_transit"
                  ? "border border-[#BFE3C5] bg-[#F0FAF1]"
                  : "border border-[#F0E2B8] bg-[#FDF8E9]"
            )}>
              <Truck className="mt-0.5 h-5 w-5 shrink-0 text-[#2E7D32]" strokeWidth={2} aria-hidden="true" />
              <div>
                <p className="text-[13px] font-bold text-[#155B32]">{tracking.messageTitle}</p>
                <p className="mt-0.5 text-[12px] leading-relaxed text-[#4A6B52]">{tracking.messageText}</p>
              </div>
            </div>

            {/* Shipment + Map grid */}
            <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_400px]">
              <ShipmentDetailsCard tracking={tracking} />
              <LiveLocationPanel tracking={tracking} onViewDetails={viewDetails} />
            </div>
          </section>
        </div>

        {/* Bottom information cards */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { key: "compare", icon: Scale, title: "Compare Offers", desc: "Evaluate multiple offers side by side.", iconClass: "bg-sky-100 text-sky-700" },
            { key: "secure", icon: ShieldCheck, title: "Secure Transactions", desc: "Your orders are safe with our verified supply chain.", iconClass: "bg-[#EAF6EA] text-[#2E7D32]" },
            { key: "track", icon: TrendingUp, title: "Track & Plan", desc: "Get timely updates and plan your procurement better.", iconClass: "bg-[#DCEAF7] text-[#1D6FB8]" },
          ].map((card) => (
            <article key={card.key} className="rounded-2xl border border-[#E1E5E1] bg-white p-5 shadow-[0_10px_30px_-18px_rgba(17,17,17,0.12)]">
              <span className={cn("grid h-[42px] w-[42px] place-items-center rounded-2xl", card.iconClass)}>
                <card.icon className="h-[21px] w-[21px]" strokeWidth={2} />
              </span>
              <h3 className="mt-4 font-display text-[15px] font-semibold text-[#111111]">{card.title}</h3>
              <p className="mt-1.5 text-[12px] leading-relaxed text-[#666666]">{card.desc}</p>
            </article>
          ))}
          <article className="rounded-2xl border border-[#BFE3C5] bg-[#F0FAF1] p-5">
            <span className="grid h-[42px] w-[42px] place-items-center rounded-2xl bg-[#2E7D32] text-white">
              <Headset className="h-[21px] w-[21px]" strokeWidth={2} />
            </span>
            <h3 className="mt-4 font-display text-[15px] font-semibold text-[#155B32]">Need Help?</h3>
            <p className="mt-1.5 flex-1 text-[12px] leading-relaxed text-[#3E5B47]">
              Contact our support team for any order related queries.
            </p>
            <Link
              to="/buyer/help-support"
              className="mt-4 inline-flex h-[40px] w-full items-center justify-center rounded-xl bg-[#2E7D32] text-[12.5px] font-semibold text-white transition-colors hover:bg-[#256628]"
            >
              Contact Support
            </Link>
          </article>
        </div>
      </div>

      {/* Modal */}
      {detailsOpen && (
        <OrderDetailsModal order={selectedOrder} tracking={tracking} onClose={() => setDetailsOpen(false)} />
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
