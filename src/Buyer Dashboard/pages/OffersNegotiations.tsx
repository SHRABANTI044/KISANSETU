import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeftRight,
  BarChart3,
  Bell,
  Check,
  ChevronDown,
  CircleCheckBig,
  EllipsisVertical,
  Eye,
  FileText,
  Handshake,
  Headset,
  MapPin,
  MessageCircle,
  Package,
  PackageOpen,
  RotateCcw,
  Scale,
  Search,
  Send,
  ShieldCheck,
  Star,
  Sprout,
  Users,
  X,
} from "lucide-react";
import BuyerDashboardLayout from "../layouts/BuyerDashboardLayout";
import type { BuyerOffer, BuyerOfferStatus, ChatMsg } from "../data/buyerOfferPageData";
import {
  chatSeedFor,
  INITIAL_OFFERS_PAGE,
  nowTimeLabel,
  OFFER_STATS,
  OFFER_STATUS_META,
} from "../data/buyerOfferPageData";
import { cn } from "../../utils/cn";
import { useBuyerToast } from "../hooks/useBuyerToast";

type OfferTabKey = "all" | BuyerOfferStatus;

const TABS: { key: OfferTabKey; label: string; count: number }[] = [
  { key: "all", label: "All Offers", count: OFFER_STATS.total },
  { key: "negotiating", label: "In Negotiation", count: OFFER_STATS.negotiating },
  { key: "accepted", label: "Accepted", count: OFFER_STATS.accepted },
  { key: "declined", label: "Declined", count: OFFER_STATS.declined },
  { key: "expired", label: "Expired", count: OFFER_STATS.expired },
];

const SORT_OPTIONS = [
  "Latest First",
  "Oldest First",
  "Price: High to Low",
  "Price: Low to High",
  "Quantity: High to Low",
  "Quantity: Low to High",
];

/* ------------------------------ Crop thumb -------------------------------- */

function CropThumb({ offer, size = 48 }: { offer: BuyerOffer; size?: number }) {
  const style = { height: size, width: size };
  if (offer.image) {
    return <img src={offer.image} alt={offer.crop} className="h-12 w-12 shrink-0 rounded-xl object-cover" style={size === 48 ? undefined : style} />;
  }
  const tileClass: Record<BuyerOffer["cropKey"], string> = {
    paddy: "bg-amber-100 text-amber-700",
    wheat: "bg-[#F0E2B8] text-[#C08A18]",
    maize: "bg-[#DCEAF7] text-[#1D6FB8]",
    moong: "bg-emerald-100 text-emerald-700",
    potato: "bg-orange-100 text-orange-600",
    onion: "bg-violet-100 text-violet-700",
  };
  return (
    <span className={cn("grid shrink-0 place-items-center rounded-xl", tileClass[offer.cropKey])} style={style}>
      <Sprout className="h-[22px] w-[22px]" strokeWidth={1.9} />
    </span>
  );
}

function SupplierBadge({ type }: { type: BuyerOffer["supplierType"] }) {
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

function OfferRowMenu({
  offer,
  onAction,
}: {
  offer: BuyerOffer;
  onAction: (action: "details" | "supplier" | "negotiate" | "accept" | "decline") => void;
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

  const actionable = offer.status === "new" || offer.status === "negotiating";
  const items: { action: Parameters<typeof onAction>[0]; label: string; icon: typeof Eye; tone?: string }[] = [
    { action: "details", label: "View Details", icon: Eye },
    { action: "supplier", label: "View Supplier", icon: Users },
    { action: "negotiate", label: offer.status === "negotiating" ? "Continue Negotiation" : "Start Negotiation", icon: ArrowLeftRight },
  ];
  if (actionable) {
    items.push({ action: "accept", label: "Accept Offer", icon: Check });
    items.push({ action: "decline", label: "Decline Offer", icon: X, tone: "text-red-500" });
  }

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
              className={cn(
                "flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-[12.5px] font-medium transition-colors",
                item.tone ?? "text-[#444444] hover:bg-[#F0FAF1] hover:text-[#2E7D32]",
                item.tone && "hover:bg-red-50"
              )}
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

/* ------------------------------- Page ------------------------------------- */

export default function OffersNegotiations() {
  const [offers, setOffers] = useState<BuyerOffer[]>(INITIAL_OFFERS_PAGE);
  const [tab, setTab] = useState<OfferTabKey>("all");
  const [sortKey, setSortKey] = useState(SORT_OPTIONS[0]!);
  const [search, setSearch] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [supplierTypeFilter, setSupplierTypeFilter] = useState("All Suppliers");
  const [cropFilter, setCropFilter] = useState("All Crops");
  const [selectedId, setSelectedId] = useState(INITIAL_OFFERS_PAGE[0]!.id);
  const [counterPrice, setCounterPrice] = useState("2050");
  const [counterSaved, setCounterSaved] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>(() => chatSeedFor(INITIAL_OFFERS_PAGE[0]!));
  const [messageInput, setMessageInput] = useState("");
  const [detailsOpen, setDetailsOpen] = useState(false);
  const { toast, showToast } = useBuyerToast();

  const listRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (list) list.scrollTo({ top: list.scrollHeight, behavior: "smooth" });
  }, [messages]);

  /* ---------------------------- Derived data ------------------------------ */
  const visibleOffers = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = offers;
    if (tab !== "all") list = list.filter((o) => o.status === tab);
    if (supplierTypeFilter === "Farmers") list = list.filter((o) => o.supplierType === "Farmer");
    else if (supplierTypeFilter === "FPOs") list = list.filter((o) => o.supplierType === "FPO");
    if (cropFilter !== "All Crops") list = list.filter((o) => o.crop === cropFilter);
    if (q) list = list.filter((o) => [o.crop, o.variety, o.supplierName, o.location, o.id].some((f) => f.toLowerCase().includes(q)));
    const sorted = [...list];
    switch (sortKey) {
      case "Oldest First":
        sorted.sort((a, b) => a.offerIso.localeCompare(b.offerIso));
        break;
      case "Price: High to Low":
        sorted.sort((a, b) => b.offeredPrice - a.offeredPrice);
        break;
      case "Price: Low to High":
        sorted.sort((a, b) => a.offeredPrice - b.offeredPrice);
        break;
      case "Quantity: High to Low":
        sorted.sort((a, b) => b.quantity - a.quantity);
        break;
      case "Quantity: Low to High":
        sorted.sort((a, b) => a.quantity - b.quantity);
        break;
      default:
        sorted.sort((a, b) => b.offerIso.localeCompare(a.offerIso));
    }
    return sorted;
  }, [offers, tab, search, sortKey, supplierTypeFilter, cropFilter]);

  const cropOptions = useMemo(() => ["All Crops", ...Array.from(new Set(offers.map((o) => o.crop)))], [offers]);
  const selectedOffer = offers.find((o) => o.id === selectedId) ?? offers[0];

  /* ------------------------------ Mutations ------------------------------- */
  const selectOffer = (offerId: string) => {
    setSelectedId(offerId);
    const offer = offers.find((o) => o.id === offerId)!;
    setCounterPrice(String(Math.max(1, offer.offeredPrice - 100)));
    setCounterSaved(false);
    setMessages(chatSeedFor(offer));
    if (window.innerWidth < 1280) {
      window.setTimeout(() => panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
    }
  };

  const updateStatus = (id: string, status: BuyerOfferStatus) =>
    setOffers((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));

  const acceptOffer = (offer: BuyerOffer) => {
    updateStatus(offer.id, "accepted");
    showToast("Offer accepted successfully.");
  };

  const declineOffer = (offer: BuyerOffer) => {
    updateStatus(offer.id, "declined");
    showToast("Offer declined.");
  };

  const sendCounter = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = Number(counterPrice);
    if (!Number.isFinite(value) || value <= 0) return;
    if (selectedOffer.status === "new") updateStatus(selectedOffer.id, "negotiating");
    setCounterSaved(true);
    showToast("Counter offer sent successfully.");
  };

  const sendMessage = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = messageInput.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { id: `m-${Date.now()}`, from: "buyer", text, time: nowTimeLabel() }]);
    setMessageInput("");
  };

  /* -------------------------------- Render -------------------------------- */
  const currentOfferActionable = selectedOffer.status === "new" || selectedOffer.status === "negotiating";

  return (
    <BuyerDashboardLayout>
      <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-5 sm:gap-6">
        {/* Page header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <span className="grid h-[52px] w-[52px] shrink-0 place-items-center rounded-2xl bg-[#EAF6EA] text-[#2E7D32]">
              <Handshake className="h-[25px] w-[25px]" strokeWidth={2} />
            </span>
            <div>
              <h1 className="font-display text-[24px] font-bold tracking-[-0.01em] text-[#111111] sm:text-[28px]">
                Offers &amp; Negotiations
              </h1>
              <p className="mt-1 max-w-xl text-[13.5px] text-[#666666]">
                Review offers from farmers and FPOs, negotiate the best price, and close the deal.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3.5 rounded-2xl border border-[#BFE3C5] bg-[#F0FAF1] px-5 py-3.5">
            <span className="grid h-[42px] w-[42px] shrink-0 place-items-center rounded-2xl bg-[#2E7D32] text-white">
              <Handshake className="h-[21px] w-[21px]" strokeWidth={2} />
            </span>
            <div className="font-display text-[14px] leading-snug font-bold text-[#155B32]">
              Fair Trade
              <br />
              Better Prices
              <br />
              Stronger Partnerships
            </div>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { key: "total", title: "Total Offers Received", value: String(OFFER_STATS.total), supporting: "↑ 50% vs last month", icon: FileText, iconClass: "bg-[#DCEAF7] text-[#1D6FB8]" },
            { key: "negotiation", title: "In Negotiation", value: String(OFFER_STATS.negotiating), supporting: "Active discussions", icon: MessageCircle, iconClass: "bg-violet-100 text-violet-700" },
            { key: "accepted", title: "Accepted Offers", value: String(OFFER_STATS.accepted), supporting: "↑ 40% vs last month", icon: CircleCheckBig, iconClass: "bg-[#EAF6EA] text-[#2E7D32]" },
            { key: "declined", title: "Declined Offers", value: String(OFFER_STATS.declined), supporting: "Not a good fit", icon: X, iconClass: "bg-red-50 text-red-600" },
          ].map((card) => (
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

        {/* Tabs + search/sort/filter */}
        <div className="flex flex-col gap-4 border-b border-[#E1E5E1] lg:flex-row lg:items-end lg:justify-between">
          <div className="no-scrollbar flex items-end gap-6 overflow-x-auto" role="tablist" aria-label="Offer status">
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
            <div className="relative min-w-0 flex-1 sm:w-[220px] sm:flex-none">
              <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#8A938A]" />
              <input
                type="search"
                aria-label="Search offers"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search offers..."
                className="h-[40px] w-full rounded-xl border border-[#E1E5E1] bg-white pr-3.5 pl-10 text-[13px] text-[#111111] transition-colors outline-none placeholder:text-[#999999] focus:border-[#2E7D32]"
              />
            </div>
            <div className="relative">
              <select
                aria-label="Sort offers"
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
                  <div className="animate-pop-in absolute top-[calc(100%+8px)] right-0 z-40 w-[270px] rounded-2xl border border-[#E1E5E1] bg-white p-4 shadow-[0_20px_50px_-18px_rgba(17,17,17,0.25)]">
                    <div className="flex items-center justify-between">
                      <p className="text-[13px] font-bold text-[#111111]">Filter Offers</p>
                      <button
                        type="button"
                        onClick={() => {
                          setSupplierTypeFilter("All Suppliers");
                          setCropFilter("All Crops");
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
                        <span className="mb-1 block text-[10.5px] font-bold tracking-[0.08em] text-[#8A938A] uppercase">Supplier Type</span>
                        <select
                          aria-label="Supplier type filter"
                          value={supplierTypeFilter}
                          onChange={(e) => setSupplierTypeFilter(e.target.value)}
                          className="h-[42px] w-full appearance-none rounded-xl border border-[#E1E5E1] bg-white px-3 text-[12.5px] font-medium text-[#111111] transition-colors outline-none focus:border-[#2E7D32]"
                        >
                          {["All Suppliers", "Farmers", "FPOs"].map((o) => (
                            <option key={o}>{o}</option>
                          ))}
                        </select>
                      </div>
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
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Offers table */}
        {visibleOffers.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-[#E1E5E1] bg-white px-6 py-14 text-center">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-[#EAF6EA] text-[#2E7D32]">
              <PackageOpen className="h-6 w-6" strokeWidth={1.9} />
            </span>
            <p className="text-[14px] font-semibold text-[#111111]">No offers match your filters</p>
            <p className="max-w-xs text-[12.5px] text-[#666666]">Try a different tab, search term or filter combination.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-[#E1E5E1] bg-white shadow-[0_10px_30px_-18px_rgba(17,17,17,0.12)]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1080px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-[#E1E5E1] bg-[#F7FAF7]">
                    {["Crop & Variety", "Supplier (Farmer/FPO)", "Offered Price (₹/Quintal)", "Quantity (Quintal)", "Location", "Offer Date", "Status", "Action", ""].map((head) => (
                      <th key={head} className="px-4 py-3.5 text-[10.5px] font-bold tracking-[0.08em] whitespace-nowrap text-[#777777] uppercase">
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visibleOffers.map((offer) => {
                    const meta = OFFER_STATUS_META[offer.status];
                    const negotiating = offer.status === "new" || offer.status === "negotiating";
                    return (
                      <tr key={offer.id} className="border-b border-[#F0F3F0] transition-colors last:border-0 hover:bg-[#FAFCFA]">
                        {/* Crop & variety */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-3">
                            <CropThumb offer={offer} />
                            <div className="min-w-0">
                              <p className="text-[13.5px] leading-tight font-bold text-[#111111]">{offer.crop}</p>
                              <p className="mt-0.5 text-[11px] text-[#999999]">Variety: {offer.variety}</p>
                            </div>
                          </div>
                        </td>

                        {/* Supplier */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <span className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-full font-display text-[11px] font-bold", offer.supplierTone)}>
                              {offer.initials}
                            </span>
                            <div>
                              <p className="flex items-center gap-1.5 text-[12.5px] font-semibold text-[#111111]">
                                {offer.supplierName}
                                <SupplierBadge type={offer.supplierType} />
                              </p>
                              <p className="mt-0.5 flex items-center gap-1 text-[10.5px] text-[#777777]">
                                <Star className="h-3 w-3 text-amber-400" fill="currentColor" />
                                <span className="font-semibold text-[#111111]">{offer.rating.toFixed(1)}</span> ({offer.rating.toFixed(1)} deals)
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Offered price */}
                        <td className="px-4 py-3.5 font-display text-[14px] font-bold whitespace-nowrap text-[#2E7D32]">
                          ₹ {offer.offeredPrice.toLocaleString("en-IN")}
                        </td>

                        {/* Quantity */}
                        <td className="px-4 py-3.5">
                          <span className="flex items-center gap-1.5 text-[12.5px] font-semibold whitespace-nowrap text-[#444444]">
                            <Package className="h-3.5 w-3.5 text-[#2E7D32]" />
                            {offer.quantity.toLocaleString("en-IN")} Quintal
                          </span>
                        </td>

                        {/* Location */}
                        <td className="px-4 py-3.5">
                          <span className="flex items-center gap-1 text-[12px] whitespace-nowrap text-[#666666]">
                            <MapPin className="h-3 w-3 shrink-0 text-[#2E7D32]" />
                            {offer.location}
                          </span>
                        </td>

                        {/* Date */}
                        <td className="px-4 py-3.5 text-[12px] whitespace-nowrap text-[#666666]">{offer.offerDate}</td>

                        {/* Status */}
                        <td className="px-4 py-3.5">
                          <span className={cn("inline-flex rounded-full px-3 py-1 text-[11px] font-bold whitespace-nowrap", meta.badgeClass)}>
                            {meta.label}
                          </span>
                        </td>

                        {/* Action */}
                        <td className="px-4 py-3.5">
                          <button
                            type="button"
                            onClick={() => selectOffer(offer.id)}
                            className={cn(
                              "inline-flex h-9 items-center rounded-lg border-[1.5px] border-[#2E7D32] px-3.5 text-[12px] font-semibold whitespace-nowrap text-[#2E7D32] transition-colors hover:bg-[#EAF6EA]",
                              selectedId === offer.id && "bg-[#EAF6EA]"
                            )}
                          >
                            {negotiating ? "View & Negotiate" : "View Details"}
                          </button>
                        </td>

                        {/* Menu */}
                        <td className="px-2 py-3.5">
                          <OfferRowMenu offer={offer} onAction={(action) => {
                            if (action === "details") setDetailsOpen(true);
                            else if (action === "supplier") {
                              selectOffer(offer.id);
                              showToast(`Opened ${offer.supplierName}'s profile context in the negotiation panel.`);
                            } else if (action === "negotiate") selectOffer(offer.id);
                            else if (action === "accept") acceptOffer(offer);
                            else if (action === "decline") declineOffer(offer);
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

        {/* Negotiation + Chat */}
        <div ref={panelRef} className="grid items-start gap-5 scroll-mt-[100px] xl:grid-cols-[minmax(0,1fr)_390px]">
          {/* Negotiation panel */}
          <section className="rounded-2xl border border-[#E1E5E1] bg-white p-5 shadow-[0_10px_30px_-18px_rgba(17,17,17,0.12)] sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-display text-[17px] font-bold text-[#111111]">
                Negotiation for {selectedOffer.crop} ({selectedOffer.variety})
              </h2>
              <span className={cn("inline-flex rounded-full px-3 py-1 text-[10.5px] font-bold", OFFER_STATUS_META[selectedOffer.status].badgeClass)}>
                {OFFER_STATUS_META[selectedOffer.status].label}
              </span>
            </div>

            {/* Supplier summary */}
            <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#E1E5E1] bg-[#F7FAF7] p-4">
              <div className="flex items-center gap-3.5">
                <CropThumb offer={selectedOffer} size={56} />
                <div>
                  <p className="text-[14px] font-bold text-[#111111]">
                    {selectedOffer.supplierName}
                    <span className="ml-1.5 font-sans text-[11px] font-medium text-[#777777]">({selectedOffer.supplierType})</span>
                  </p>
                  <div className="mt-1.5 grid gap-x-6 gap-y-1 text-[11.5px] text-[#666666] sm:grid-cols-2">
                    <p>
                      Quantity: <span className="font-semibold text-[#111111]">{selectedOffer.quantity.toLocaleString("en-IN")} Quintal</span>
                    </p>
                    <p className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-[#2E7D32]" />
                      {selectedOffer.location}
                    </p>
                    <p className="sm:col-span-2">
                      Current Offer:{" "}
                      <span className="font-display text-[14px] font-bold text-[#2E7D32]">
                        ₹ {selectedOffer.offeredPrice.toLocaleString("en-IN")}
                      </span>{" "}
                      /quintal
                    </p>
                  </div>
                </div>
              </div>
              <span className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-full font-display text-[12px] font-bold", selectedOffer.supplierTone)}>
                {selectedOffer.initials}
              </span>
            </div>

            {/* Your offer */}
            <div className="mt-5 rounded-2xl border border-[#BFE3C5] bg-[#F0FAF1] p-4 sm:p-5">
              <p className="text-[13px] font-bold text-[#155B32]">Your Offer</p>
              <form onSubmit={sendCounter} className="mt-3 flex flex-wrap items-end gap-3">
                <div className="relative flex-1 min-w-[180px]">
                  <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 font-display text-[16px] font-bold text-[#155B32]">₹</span>
                  <input
                    type="number"
                    min={1}
                    step="0.01"
                    value={counterPrice}
                    onChange={(e) => {
                      setCounterPrice(e.target.value);
                      setCounterSaved(false);
                    }}
                    aria-label="Your offered price per quintal"
                    className="h-[52px] w-full rounded-xl border border-[#D8E7D8] bg-white pr-16 pl-9 font-display text-[18px] font-bold text-[#155B32] transition-colors outline-none focus:border-[#2E7D32]"
                  />
                  <span className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-[12px] font-medium text-[#5B7A63]">/quintal</span>
                </div>
                <button
                  type="submit"
                  className="inline-flex h-[52px] items-center gap-2 rounded-xl bg-[#2E7D32] px-6 text-[14px] font-semibold text-white shadow-[0_12px_24px_-10px_rgba(46,125,50,0.55)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#256628]"
                >
                  Send Counter Offer
                </button>
              </form>
              {counterSaved && (
                <p role="status" className="animate-pop-in mt-3 flex items-center gap-2 text-[12px] font-semibold text-[#2E7D32]">
                  <Check className="h-4 w-4" strokeWidth={2.6} />
                  Counter offer sent successfully.
                </p>
              )}
            </div>

            {/* Negotiation actions */}
            {currentOfferActionable && (
              <div className="mt-4 flex flex-wrap gap-2.5">
                <button
                  type="button"
                  onClick={() => acceptOffer(selectedOffer)}
                  className="inline-flex h-[42px] items-center gap-1.5 rounded-xl bg-[#2E7D32] px-5 text-[12.5px] font-semibold text-white transition-colors hover:bg-[#256628]"
                >
                  <Check className="h-4 w-4" strokeWidth={2.6} />
                  Accept Offer
                </button>
                <button
                  type="button"
                  onClick={() => declineOffer(selectedOffer)}
                  className="inline-flex h-[42px] items-center gap-1.5 rounded-xl border-[1.5px] border-red-300 bg-white px-5 text-[12.5px] font-semibold text-red-500 transition-colors hover:bg-red-50"
                >
                  <X className="h-4 w-4" strokeWidth={2.6} />
                  Decline Offer
                </button>
              </div>
            )}
          </section>

          {/* Chat with supplier */}
          <section className="flex h-[520px] flex-col overflow-hidden rounded-2xl border border-[#E1E5E1] bg-white shadow-[0_10px_30px_-18px_rgba(17,17,17,0.12)]">
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-[#E1E5E1] px-4 py-3.5">
              <span className={cn("grid h-[42px] w-[42px] shrink-0 place-items-center rounded-full font-display text-[12px] font-bold", selectedOffer.supplierTone)}>
                {selectedOffer.initials}
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="truncate font-display text-[15px] font-semibold text-[#111111]">Chat with Supplier</h3>
                <p className="flex items-center gap-1.5 text-[11px] text-[#777777]">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#2E7D32]" aria-hidden="true" />
                  {selectedOffer.supplierName} · Online
                </p>
              </div>
              <Bell className="h-4 w-4 text-[#8A938A]" />
            </div>

            {/* Messages */}
            <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-4">
              <div className="flex flex-col gap-3.5">
                {messages.map((message) => {
                  const fromBuyer = message.from === "buyer";
                  return (
                    <div key={message.id} className={cn("flex flex-col gap-1", fromBuyer && "items-end")}>
                      <div
                        className={cn(
                          "max-w-[82%] whitespace-pre-line rounded-2xl px-3.5 py-2.5 text-[12px] leading-relaxed",
                          fromBuyer
                            ? "rounded-br-md bg-[#2E7D32] text-white"
                            : "rounded-bl-md border border-[#E7EEE7] bg-[#F4F8F4] text-[#111111]"
                        )}
                      >
                        {message.text}
                      </div>
                      <span className="px-1 text-[9.5px] font-medium text-[#999999]">{message.time}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Input */}
            <form onSubmit={sendMessage} className="flex items-center gap-2.5 border-t border-[#E1E5E1] bg-white px-3 py-3">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Type your message..."
                aria-label="Type your message"
                className="h-[44px] min-w-0 flex-1 rounded-xl border border-[#E1E5E1] bg-[#FAFBFA] px-3.5 text-[13px] text-[#111111] transition-colors outline-none placeholder:text-[#999999] focus:border-[#2E7D32] focus:bg-white"
              />
              <button
                type="submit"
                aria-label="Send message"
                className="grid h-[44px] w-[44px] shrink-0 place-items-center rounded-xl bg-[#2E7D32] text-white transition-all duration-200 hover:bg-[#256628]"
              >
                <Send className="h-[17px] w-[17px]" strokeWidth={2.2} />
              </button>
            </form>
          </section>
        </div>

        {/* Bottom information cards */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { icon: Scale, title: "Compare Offers", desc: "Evaluate multiple offers side by side.", iconClass: "bg-sky-100 text-sky-700" },
            { icon: ShieldCheck, title: "Secure Transactions", desc: "Safe and transparent payments.", iconClass: "bg-[#EAF6EA] text-[#2E7D32]" },
            { icon: Users, title: "Build Long-Term Relations", desc: "Work with trusted farmers & FPOs.", iconClass: "bg-violet-100 text-violet-700" },
          ].map((card) => (
            <article key={card.title} className="rounded-2xl border border-[#E1E5E1] bg-white p-5 shadow-[0_10px_30px_-18px_rgba(17,17,17,0.12)]">
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
            <p className="mt-1.5 flex-1 text-[12px] leading-relaxed text-[#3E5B47]">Our support team is here for you.</p>
            <Link
              to="/buyer/help-support"
              className="mt-4 inline-flex h-[40px] w-full items-center justify-center rounded-xl bg-[#2E7D32] text-[12.5px] font-semibold text-white transition-colors hover:bg-[#256628]"
            >
              Contact Support
            </Link>
          </article>
        </div>
      </div>

      {/* Details modal */}
      {detailsOpen && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/45 p-5 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
          aria-label="Offer Details"
          onClick={() => setDetailsOpen(false)}
        >
          <div
            className="animate-pop-in max-h-[92dvh] w-full max-w-[480px] overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-7"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <h2 className="font-display text-[18px] font-bold text-[#111111]">Offer Details</h2>
              <button
                type="button"
                onClick={() => setDetailsOpen(false)}
                aria-label="Close"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[#E1E5E1] text-[#666666] transition-colors hover:bg-[#EAF6EA] hover:text-[#2E7D32]"
              >
                <X className="h-[18px] w-[18px]" />
              </button>
            </div>
            <div className="mt-4 flex flex-col gap-2.5">
              {([
                ["Crop", `${selectedOffer.crop} (${selectedOffer.variety})`],
                ["Supplier", `${selectedOffer.supplierName} (${selectedOffer.supplierType})`],
                ["Quantity", `${selectedOffer.quantity.toLocaleString("en-IN")} Quintal`],
                ["Offered Price", `₹ ${selectedOffer.offeredPrice.toLocaleString("en-IN")} /quintal`],
                ["Location", selectedOffer.location],
                ["Offer Date", selectedOffer.offerDate],
                ["Status", OFFER_STATUS_META[selectedOffer.status].label],
              ] as [string, string][]).map(([label, value]) => (
                <div key={label} className="flex items-baseline justify-between gap-3 border-b border-[#F0F3F0] pb-2">
                  <dt className="text-[11.5px] font-medium text-[#888888]">{label}</dt>
                  <dd className="text-right text-[12.5px] font-semibold text-[#111111]">{value}</dd>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setDetailsOpen(false)}
              className="mt-5 inline-flex h-[46px] w-full items-center justify-center rounded-xl bg-[#2E7D32] text-[13.5px] font-semibold text-white transition-colors hover:bg-[#256628]"
            >
              Close
            </button>
          </div>
        </div>
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
