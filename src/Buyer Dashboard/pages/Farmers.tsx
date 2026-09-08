import { useEffect, useMemo, useRef, useState } from "react";
import {
  LoaderCircle,
  Users,
} from "lucide-react";
import BuyerDashboardLayout from "../layouts/BuyerDashboardLayout";
import { FeaturedFPOCard, SuppliersMapCard } from "../components/suppliers/SuppliersMapCard";
import { InquiryModal, SupplierProfileModal } from "../components/suppliers/SupplierModals";
import type { BuyerSupplier, SupplierType } from "../data/buyerSuppliers";
import {
  CROP_OPTIONS,
  INITIAL_SUPPLIERS,
  MIN_PRODUCTION_OPTIONS,
  MIN_RATING_OPTIONS,
  productionThreshold,
  ratingThreshold,
  SORT_OPTIONS,
  STATE_OPTIONS,
  TYPE_OPTIONS,
  TYPE_META,
} from "../data/buyerSuppliers";
import { cn } from "../../utils/cn";
import { useBuyerToast } from "../hooks/useBuyerToast";
import { Link } from "react-router-dom";
import {
  ChevronDown,
  EllipsisVertical,
  Eye,
  Handshake,
  Leaf,
  MapPin,
  RotateCcw,
  Search,
  Send,
  SlidersHorizontal,
  Star,
  User,
} from "lucide-react";

type TypeTabKey = "all" | SupplierType;

const TYPE_TABS: { key: TypeTabKey; label: string; count: string }[] = [
  { key: "all", label: "All", count: "(1,570)" },
  { key: "farmer", label: "Farmers", count: "(1,250)" },
  { key: "fpo", label: "FPOs", count: "(320)" },
];

interface SupplierFilters {
  type: string;
  state: string;
  crop: string;
  minRating: string;
  minProduction: string;
}

const EMPTY_SUPPLIER_FILTERS: SupplierFilters = {
  type: "All Types",
  state: "All States",
  crop: "All Crops",
  minRating: "Any Rating",
  minProduction: "Any Volume",
};

/* --------------------------- Supplier row menu ----------------------------- */

function SupplierRowMenu({
  onAction,
}: {
  onAction: (action: "view" | "inquire" | "save") => void;
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
    { action: "view" as const, label: "View Profile", icon: Eye },
    { action: "inquire" as const, label: "Send Inquiry", icon: Send },
    { action: "save" as const, label: "Save Supplier", icon: Users },
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
        className="grid h-9 w-9 place-items-center rounded-lg text-[#999999] transition-colors hover:bg-[#EAF6EA] hover:text-[#2E7D32]"
      >
        <EllipsisVertical className="h-[18px] w-[18px]" strokeWidth={2} />
      </button>
      {open && (
        <div className="animate-pop-in absolute top-[calc(100%+6px)] right-0 z-30 w-[180px] rounded-xl border border-[#E1E5E1] bg-white p-1.5 shadow-[0_18px_44px_-16px_rgba(17,17,17,0.25)]">
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

/* --------------------------------- Page ----------------------------------- */

export default function Farmers() {
  const [suppliers, setSuppliers] = useState<BuyerSupplier[]>(INITIAL_SUPPLIERS);
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<SupplierFilters>(EMPTY_SUPPLIER_FILTERS);
  const [moreFiltersOpen, setMoreFiltersOpen] = useState(false);
  const [tab, setTab] = useState<TypeTabKey>("all");
  const [sortKey, setSortKey] = useState(SORT_OPTIONS[0]!);
  const [modal, setModal] = useState<
    | { kind: "profile"; supplier: BuyerSupplier }
    | { kind: "inquiry"; supplier: BuyerSupplier }
    | null
  >(null);
  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">("loading");
  const { toast, showToast } = useBuyerToast();

  useEffect(() => {
    const t = window.setTimeout(() => setLoadState("ready"), 400);
    return () => window.clearTimeout(t);
  }, []);

  /* ----------------------------- Derived lists ------------------------------ */
  const summaryCards = [
    { key: "farmers", title: "Verified Farmers", value: "1,250+", supporting: "↑ 12% this month", icon: User, iconClass: "bg-[#EAF6EA] text-[#2E7D32]" },
    { key: "fpos", title: "Verified FPOs", value: "320+", supporting: "↑ 18% this month", icon: Users, iconClass: "bg-violet-100 text-violet-700" },
    { key: "crops", title: "Total Crop Varieties", value: "150+", supporting: "Across India", icon: Leaf, iconClass: "bg-[#EAF6EA] text-[#2E7D32]" },
    { key: "direct", title: "Direct Sourcing", value: "Better Prices", supporting: "No middlemen", icon: Handshake, iconClass: "bg-[#F0E2B8] text-[#C08A18]" },
  ];

  const visibleSuppliers = useMemo(() => {
    const q = query.trim().toLowerCase();
    const ratingMin = ratingThreshold(filters.minRating);
    const productionMin = productionThreshold(filters.minProduction);

    const filtered = suppliers.filter((s) => {
      if (tab !== "all" && s.type !== tab) return false;
      if (filters.type !== "All Types") {
        const want: SupplierType | null = filters.type === "Farmers" ? "farmer" : filters.type === "FPOs" ? "fpo" : null;
        if (want && s.type !== want) return false;
      }
      if (filters.state !== "All States" && s.state !== filters.state) return false;
      if (filters.crop !== "All Crops" && !s.mainCrops.some((c) => c.toLowerCase() === filters.crop.toLowerCase() || c.toLowerCase().includes(filters.crop.toLowerCase()))) return false;
      if (s.rating < ratingMin) return false;
      if (s.productionMin < productionMin) return false;
      if (q && ![s.name, s.location, s.state, ...s.mainCrops].some((f) => f.toLowerCase().includes(q))) return false;
      return true;
    });

    const sorted = [...filtered];
    switch (sortKey) {
      case "Rating: High to Low":
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case "Rating: Low to High":
        sorted.sort((a, b) => a.rating - b.rating);
        break;
      case "Most Deals":
        sorted.sort((a, b) => b.deals - a.deals);
        break;
      case "Nearest First":
        sorted.sort((a, b) => {
          const aw = a.state === "West Bengal" ? 0 : 1;
          const bw = b.state === "West Bengal" ? 0 : 1;
          return aw - bw || a.name.localeCompare(b.name);
        });
        break;
      case "Annual Production: High to Low":
        sorted.sort((a, b) => b.productionMin - a.productionMin);
        break;
      default:
        break;
    }
    return sorted;
  }, [suppliers, query, filters, tab, sortKey]);

  const resetAll = () => {
    setQuery("");
    setFilters(EMPTY_SUPPLIER_FILTERS);
    setTab("all");
    setMoreFiltersOpen(false);
  };

  /* ------------------------------ Actions ----------------------------------- */
  const handleSupplierAction = (supplier: BuyerSupplier, action: "view" | "inquire" | "save") => {
    if (action === "view") setModal({ kind: "profile", supplier });
    else if (action === "inquire") setModal({ kind: "inquiry", supplier });
    else {
      setSuppliers((prev) => prev.map((s) => (s.id === supplier.id ? { ...s, saved: !s.saved } : s)));
      showToast(supplier.saved ? `${supplier.name} removed from saved suppliers.` : `${supplier.name} saved for quick access.`);
    }
  };

  const handleInquirySent = (name: string) => {
    setModal(null);
    showToast(`Inquiry sent to ${name} — you'll be notified when they respond.`);
  };

  /* --------------------------------- Render --------------------------------- */
  const featuredFpo = suppliers.find((s) => s.id === "s2")!;
  const mapSuppliers = visibleSuppliers.length > 0 ? visibleSuppliers : suppliers;

  return (
    <BuyerDashboardLayout searchValue={query} onSearch={setQuery}>
      <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-5 sm:gap-6">
        {/* Page header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-[24px] font-bold tracking-[-0.01em] text-[#111111] sm:text-[28px]">
              Farmers and FPOs
            </h1>
            <p className="mt-1 max-w-xl text-[13.5px] text-[#666666]">
              Discover and connect with verified farmers and Farmer Producer Organizations (FPOs) to
              source quality produce directly.
            </p>
          </div>
          <Link
            to="/buyer/requirements"
            className="inline-flex h-[46px] items-center gap-2 rounded-xl bg-[#2E7D32] px-5 text-[14px] font-semibold text-white shadow-[0_12px_24px_-10px_rgba(46,125,50,0.55)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#256628]"
          >
            <Users className="h-[17px] w-[17px]" strokeWidth={2.2} />
            Request from Multiple Suppliers
          </Link>
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
              <p className="mt-3 font-display text-[24px] leading-none font-bold text-[#111111]">
                {card.value}
              </p>
              <p className={cn("mt-2 text-[11.5px] font-semibold", card.supporting.startsWith("↑") ? "text-[#2E7D32]" : "text-[#8A938A]")}>
                {card.supporting}
              </p>
            </article>
          ))}
        </div>

        {/* Search + filter bar */}
        <div className="rounded-2xl border border-[#E1E5E1] bg-white p-3.5 sm:p-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-[2fr_1fr_1fr_1fr_auto_auto]">
            {/* Search */}
            <div className="relative md:col-span-2 xl:col-span-1">
              <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#8A938A]" />
              <input
                type="search"
                aria-label="Search farmers and FPOs"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by farmer/FPO name, crop, location..."
                className="h-[44px] w-full rounded-xl border border-[#E1E5E1] bg-white pr-3.5 pl-10 text-[13px] text-[#111111] transition-colors outline-none placeholder:text-[#999999] focus:border-[#2E7D32]"
              />
            </div>

            {/* Type dropdown */}
            <div className="relative">
              <select
                aria-label="Filter by supplier type"
                value={filters.type}
                onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))}
                className="h-[44px] w-full appearance-none rounded-xl border border-[#E1E5E1] bg-white pr-9 pl-3.5 text-[13px] font-medium text-[#111111] transition-colors outline-none focus:border-[#2E7D32]"
              >
                {TYPE_OPTIONS.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-[#8A938A]" />
            </div>

            {/* State dropdown */}
            <div className="relative">
              <select
                aria-label="Filter by state"
                value={filters.state}
                onChange={(e) => setFilters((f) => ({ ...f, state: e.target.value }))}
                className="h-[44px] w-full appearance-none rounded-xl border border-[#E1E5E1] bg-white pr-9 pl-3.5 text-[13px] font-medium text-[#111111] transition-colors outline-none focus:border-[#2E7D32]"
              >
                {STATE_OPTIONS.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-[#8A938A]" />
            </div>

            {/* Crop dropdown */}
            <div className="relative">
              <select
                aria-label="Filter by crop"
                value={filters.crop}
                onChange={(e) => setFilters((f) => ({ ...f, crop: e.target.value }))}
                className="h-[44px] w-full appearance-none rounded-xl border border-[#E1E5E1] bg-white pr-9 pl-3.5 text-[13px] font-medium text-[#111111] transition-colors outline-none focus:border-[#2E7D32]"
              >
                {CROP_OPTIONS.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-[#8A938A]" />
            </div>

            {/* More filters */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setMoreFiltersOpen((v) => !v)}
                aria-expanded={moreFiltersOpen}
                className={cn(
                  "inline-flex h-[44px] w-full items-center justify-center gap-2 rounded-xl border-[1.5px] bg-white px-4 text-[12.5px] font-semibold transition-colors xl:w-auto",
                  moreFiltersOpen || filters.minRating !== "Any Rating" || filters.minProduction !== "Any Volume"
                    ? "border-[#2E7D32] text-[#2E7D32]"
                    : "border-[#E1E5E1] text-[#555555] hover:text-[#2E7D32]"
                )}
              >
                <SlidersHorizontal className="h-4 w-4" strokeWidth={2.2} />
                More Filters
              </button>
              {moreFiltersOpen && (
                <>
                  <span className="fixed inset-0 z-30 cursor-default" onClick={() => setMoreFiltersOpen(false)} aria-hidden="true" />
                  <div className="animate-pop-in absolute top-[calc(100%+8px)] right-0 z-40 w-[280px] rounded-2xl border border-[#E1E5E1] bg-white p-4 shadow-[0_20px_50px_-18px_rgba(17,17,17,0.25)]">
                    <div className="flex items-center justify-between">
                      <p className="text-[13px] font-bold text-[#111111]">More Filters</p>
                      <button
                        type="button"
                        onClick={() => setFilters((f) => ({ ...f, minRating: "Any Rating", minProduction: "Any Volume" }))}
                        className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-[#666666] transition-colors hover:text-[#2E7D32]"
                      >
                        <RotateCcw className="h-3 w-3" />
                        Reset
                      </button>
                    </div>
                    <div className="mt-3.5 flex flex-col gap-3">
                      <div>
                        <span className="mb-1 block text-[10.5px] font-bold tracking-[0.08em] text-[#8A938A] uppercase">
                          Rating
                        </span>
                        <select
                          aria-label="Minimum rating"
                          value={filters.minRating}
                          onChange={(e) => setFilters((f) => ({ ...f, minRating: e.target.value }))}
                          className="h-[42px] w-full appearance-none rounded-xl border border-[#E1E5E1] bg-white px-3 text-[12.5px] font-medium text-[#111111] transition-colors outline-none focus:border-[#2E7D32]"
                        >
                          {MIN_RATING_OPTIONS.map((o) => (
                            <option key={o}>{o}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <span className="mb-1 block text-[10.5px] font-bold tracking-[0.08em] text-[#8A938A] uppercase">
                          Minimum Production
                        </span>
                        <select
                          aria-label="Minimum production"
                          value={filters.minProduction}
                          onChange={(e) => setFilters((f) => ({ ...f, minProduction: e.target.value }))}
                          className="h-[42px] w-full appearance-none rounded-xl border border-[#E1E5E1] bg-white px-3 text-[12.5px] font-medium text-[#111111] transition-colors outline-none focus:border-[#2E7D32]"
                        >
                          {MIN_PRODUCTION_OPTIONS.map((o) => (
                            <option key={o}>{o}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Search button */}
            <button
              type="button"
              onClick={() => showToast(`Showing ${visibleSuppliers.length} matching supplier${visibleSuppliers.length === 1 ? "" : "s"}.`)}
              className="inline-flex h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-[#2E7D32] px-7 text-[13.5px] font-semibold text-white transition-all duration-200 hover:bg-[#256628] xl:w-auto"
            >
              Search
            </button>
          </div>
        </div>

        {/* Tabs + sort */}
        <div className="flex flex-col gap-4 border-b border-[#E1E5E1] lg:flex-row lg:items-end lg:justify-between">
          <div className="no-scrollbar flex items-end gap-6 overflow-x-auto" role="tablist" aria-label="Supplier types">
            {TYPE_TABS.map((t) => {
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
                  {t.label} <span className="text-[#999999]">{t.count}</span>
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

          <div className="flex items-center justify-between gap-2.5 pb-3">
            <span className="text-[12px] font-medium whitespace-nowrap text-[#777777]">Sort by</span>
            <div className="relative">
              <select
                aria-label="Sort suppliers"
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value)}
                className="h-[40px] appearance-none rounded-xl border border-[#E1E5E1] bg-white pr-9 pl-3.5 text-[12.5px] font-semibold text-[#444444] transition-colors outline-none focus:border-[#2E7D32]"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-[#8A938A]" />
            </div>
          </div>
        </div>

        {/* Main content: list + right rail */}
        <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_370px]">
          {/* Supplier list */}
          <div className="flex min-w-0 flex-col gap-4">
            {loadState === "loading" ? (
              <div className="flex flex-col items-center gap-3 rounded-2xl border border-[#E1E5E1] bg-white px-6 py-16 text-center">
                <LoaderCircle className="h-8 w-8 animate-spin text-[#2E7D32]" strokeWidth={2.4} />
                <p className="text-[13.5px] font-medium text-[#666666]">Loading suppliers...</p>
              </div>
            ) : loadState === "error" ? (
              <div className="flex flex-col items-center gap-3 rounded-2xl border border-[#E1E5E1] bg-white px-6 py-16 text-center">
                <span className="grid h-14 w-14 place-items-center rounded-full bg-red-50 text-red-500">
                  <Users className="h-6 w-6" strokeWidth={1.9} />
                </span>
                <p className="text-[14px] font-semibold text-[#111111]">Unable to load suppliers. Please try again.</p>
                <button
                  type="button"
                  onClick={() => setLoadState("ready")}
                  className="mt-1 inline-flex h-10 items-center rounded-xl bg-[#2E7D32] px-6 text-[12.5px] font-semibold text-white transition-colors hover:bg-[#256628]"
                >
                  Retry
                </button>
              </div>
            ) : visibleSuppliers.length === 0 ? (
              <div className="flex flex-col items-center gap-3 rounded-2xl border border-[#E1E5E1] bg-white px-6 py-14 text-center">
                <span className="grid h-14 w-14 place-items-center rounded-full bg-[#EAF6EA] text-[#2E7D32]">
                  <Users className="h-6 w-6" strokeWidth={1.9} />
                </span>
                <p className="text-[14px] font-semibold text-[#111111]">No farmers or FPOs found.</p>
                <p className="max-w-xs text-[12.5px] text-[#666666]">Try changing your search or filters.</p>
                <button
                  type="button"
                  onClick={resetAll}
                  className="mt-1 inline-flex h-10 items-center rounded-xl bg-[#2E7D32] px-5 text-[12.5px] font-semibold text-white transition-colors hover:bg-[#256628]"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              visibleSuppliers.map((supplier) => {
                const meta = TYPE_META[supplier.type];
                return (
                  <article
                    key={supplier.id}
                    className="group flex flex-col gap-4 rounded-2xl border border-[#E1E5E1] bg-white p-4 shadow-[0_10px_30px_-18px_rgba(17,17,17,0.12)] transition-shadow duration-300 hover:border-[#2E7D32]/35 hover:shadow-[0_16px_40px_-18px_rgba(17,17,17,0.18)] sm:p-[18px] lg:flex-row lg:items-start"
                  >
                    {/* Avatar + identity */}
                    <div className="flex min-w-0 flex-1 items-start gap-3.5">
                      <span className={cn("grid h-[54px] w-[54px] shrink-0 place-items-center rounded-2xl font-display text-[16px] font-bold", supplier.tone)}>
                        {supplier.initials}
                      </span>
                      <div className="min-w-0">
                        <p className="flex flex-wrap items-center gap-2 text-[15px] leading-tight font-bold text-[#111111]">
                          {supplier.name}
                          <span className={cn("rounded-full px-2.5 py-0.5 text-[10px] font-bold", meta.badgeClass)}>
                            {meta.label}
                          </span>
                        </p>
                        <p className="mt-1 flex items-center gap-1 text-[11.5px] text-[#777777]">
                          <MapPin className="h-3 w-3 shrink-0 text-[#2E7D32]" />
                          {supplier.location}
                        </p>
                        <p className="mt-0.5 flex items-center gap-1 text-[11.5px] text-[#777777]">
                          <Star className="h-3 w-3 text-amber-400" fill="currentColor" />
                          <span className="font-semibold text-[#111111]">{supplier.rating.toFixed(1)}</span> (
                          {supplier.deals} deals)
                        </p>
                        {/* Crops */}
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {supplier.mainCrops.map((crop) => (
                            <span key={crop} className="rounded-full bg-[#EEF3EE] px-2.5 py-0.5 text-[10.5px] font-semibold text-[#3E5B47]">
                              {crop}
                            </span>
                          ))}
                        </div>
                        <p className="mt-2 text-[11px] text-[#999999]">
                          Annual Production: <span className="font-semibold text-[#555555]">{supplier.annualProduction}</span>
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex shrink-0 flex-row flex-wrap items-center gap-2 lg:w-[150px] lg:flex-col lg:items-stretch">
                      <div className="flex flex-1 flex-col gap-2 lg:flex-none">
                        <button
                          type="button"
                          onClick={() => handleSupplierAction(supplier, "view")}
                          className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg border-[1.5px] border-[#2E7D32] bg-white px-3.5 text-[12px] font-semibold whitespace-nowrap text-[#2E7D32] transition-colors hover:bg-[#EAF6EA] lg:w-full"
                        >
                          <Eye className="h-3.5 w-3.5" strokeWidth={2.2} />
                          View Profile
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSupplierAction(supplier, "inquire")}
                          className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg border-[1.5px] border-[#2E7D32] bg-white px-3.5 text-[12px] font-semibold whitespace-nowrap text-[#2E7D32] transition-colors hover:bg-[#EAF6EA] lg:w-full"
                        >
                          <Send className="h-3.5 w-3.5" strokeWidth={2.2} />
                          Send Inquiry
                        </button>
                      </div>
                      <SupplierRowMenu
                        onAction={(action) => handleSupplierAction(supplier, action)}
                      />
                    </div>
                  </article>
                );
              })
            )}
          </div>

          {/* Right rail */}
          <div className="flex min-w-0 flex-col gap-5">
            <SuppliersMapCard suppliers={mapSuppliers} />
            <FeaturedFPOCard supplier={featuredFpo} onViewProfile={(s) => setModal({ kind: "profile", supplier: s })} />
          </div>
        </div>
      </div>

      {/* Modals */}
      {modal?.kind === "profile" && (
        <SupplierProfileModal
          supplier={modal.supplier}
          onClose={() => setModal(null)}
          onInquire={() => setModal({ kind: "inquiry", supplier: modal.supplier })}
        />
      )}
      {modal?.kind === "inquiry" && (
        <InquiryModal supplier={modal.supplier} onClose={() => setModal(null)} onSent={handleInquirySent} />
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
