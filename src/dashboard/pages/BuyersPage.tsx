import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoaderCircle, PackageOpen, Users } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import BuyerDetailsModal from "../components/buyers/BuyerDetailsModal";
import BuyersBottomCards from "../components/buyers/BuyersBottomCards";
import BuyerStats from "../components/buyers/BuyerStats";
import BuyersTable from "../components/buyers/BuyersTable";
import type { BuyerRowAction } from "../components/buyers/BuyersTable";
import BuyersToolbar from "../components/buyers/BuyersToolbar";
import type { BuyerFilterValues, BuyerTabKey } from "../components/buyers/BuyersToolbar";
import { EMPTY_BUYER_FILTERS } from "../components/buyers/BuyersToolbar";
import { INITIAL_BUYERS, offerInRange } from "../data/interestedBuyers";
import type { InterestedBuyer } from "../data/interestedBuyers";
import type { BuyerBadgeStatus } from "../data/interestedBuyers";
import { cn } from "../../utils/cn";

type LoadState = "loading" | "ready" | "error";

const STATUS_TO_BADGE: Record<string, BuyerBadgeStatus> = {
  New: "new",
  "Offer Received": "offer_received",
  Negotiation: "negotiation",
  Interested: "interested",
  Saved: "saved",
};

export default function BuyersPage() {
  const navigate = useNavigate();
  const [buyers, setBuyers] = useState<InterestedBuyer[]>(INITIAL_BUYERS);
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [tab, setTab] = useState<BuyerTabKey>("all");
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<BuyerFilterValues>(EMPTY_BUYER_FILTERS);
  const [viewing, setViewing] = useState<InterestedBuyer | null>(null);
  const [toast, setToast] = useState("");

  /* Simulated mount load (demo data is local; keeps loading/empty patterns real) */
  useEffect(() => {
    const t = window.setTimeout(() => setLoadState("ready"), 550);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(t);
  }, [toast]);

  /* ------------------------------ Derived lists ------------------------------ */
  const counts = useMemo<Record<BuyerTabKey, number>>(
    () => ({
      all: buyers.length,
      offers: buyers.filter((b) => b.hasOffer).length,
      negotiation: buyers.filter((b) => b.negotiating).length,
      converted: buyers.filter((b) => b.converted).length,
      saved: buyers.filter((b) => b.saved).length,
    }),
    [buyers]
  );

  const visibleBuyers = useMemo(() => {
    const q = search.trim().toLowerCase();
    const badge = STATUS_TO_BADGE[filters.status];
    return buyers.filter((b) => {
      if (tab === "offers" && !b.hasOffer) return false;
      if (tab === "negotiation" && !b.negotiating) return false;
      if (tab === "converted" && !b.converted) return false;
      if (tab === "saved" && !b.saved) return false;
      if (filters.crop !== "All Crops" && b.crop !== filters.crop) return false;
      if (filters.location !== "All Locations" && b.location !== filters.location) return false;
      if (badge && b.status !== badge) return false;
      if (!offerInRange(b.offeredPrice, filters.range)) return false;
      if (q && ![b.name, b.company, b.location, b.crop].some((f) => f.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [buyers, tab, search, filters]);

  /* -------------------------------- Actions --------------------------------- */
  const toggleSave = (buyer: InterestedBuyer) => {
    setBuyers((prev) => prev.map((b) => (b.id === buyer.id ? { ...b, saved: !b.saved } : b)));
    if (viewing?.id === buyer.id) setViewing((v) => v && { ...v, saved: !v.saved });
    setToast(buyer.saved ? `${buyer.name} removed from saved buyers.` : `${buyer.name} saved for quick access.`);
  };

  const handleAction = (buyer: InterestedBuyer, action: BuyerRowAction) => {
    if (action === "view") setViewing(buyer);
    else if (action === "chat") setToast(`Chat with ${buyer.name} — messaging coming soon.`);
    else if (action === "save") toggleSave(buyer);
    else if (action === "offers") navigate("/dashboard/offers");
    else if (action === "remove") {
      setBuyers((prev) => prev.filter((b) => b.id !== buyer.id));
      setToast(`${buyer.name} removed from your buyer list.`);
    }
  };

  const resetAll = () => {
    setTab("all");
    setSearch("");
    setFilters(EMPTY_BUYER_FILTERS);
  };

  /* --------------------------------- Render --------------------------------- */
  return (
    <DashboardLayout>
      <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-5 sm:gap-6">
        {/* Page header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-[24px] font-bold tracking-[-0.01em] text-[#111111] sm:text-[28px]">
              Interested Buyers
            </h1>
            <p className="mt-1 max-w-xl text-[13.5px] text-[#666666]">
              Buyers who have shown interest in your crop lots. Compare offers, chat and close deals
              easily.
            </p>
          </div>
          <div className="flex items-center gap-3.5 rounded-2xl border border-[#BFE3C5] bg-[#F0FAF1] px-5 py-3.5">
            <span className="grid h-[42px] w-[42px] shrink-0 place-items-center rounded-2xl bg-[#2E7D32] text-white">
              <Users className="h-[21px] w-[21px]" strokeWidth={2} />
            </span>
            <div className="font-display text-[14px] leading-snug font-bold text-[#155B32]">
              More Buyers
              <br />
              Better Prices
              <br />
              Bigger Opportunities
            </div>
          </div>
        </div>

        <BuyerStats />

        {loadState === "loading" && (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-[#E1E5E1] bg-white px-6 py-20 text-center">
            <LoaderCircle className="h-8 w-8 animate-spin text-[#2E7D32]" strokeWidth={2.4} />
            <p className="text-[13.5px] font-medium text-[#666666]">Loading interested buyers...</p>
          </div>
        )}

        {loadState === "error" && (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-[#E1E5E1] bg-white px-6 py-16 text-center">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-red-50 text-red-500">
              <Users className="h-6 w-6" strokeWidth={1.9} />
            </span>
            <p className="text-[14px] font-semibold text-[#111111]">Unable to load buyers. Please try again.</p>
            <button
              type="button"
              onClick={() => {
                setLoadState("loading");
                window.setTimeout(() => setLoadState("ready"), 500);
              }}
              className="mt-1 inline-flex h-10 items-center rounded-xl bg-[#2E7D32] px-6 text-[12.5px] font-semibold text-white transition-colors hover:bg-[#256628]"
            >
              Retry
            </button>
          </div>
        )}

        {loadState === "ready" && (
          <>
            {/* Tabs + search + filter */}
            <BuyersToolbar
              counts={counts}
              activeTab={tab}
              onTabChange={setTab}
              search={search}
              onSearch={setSearch}
              filters={filters}
              onFilters={setFilters}
            />

            {/* Table / states */}
            {buyers.length === 0 ? (
              <div className="flex flex-col items-center gap-3 rounded-2xl border border-[#E1E5E1] bg-white px-6 py-14 text-center">
                <span className="grid h-14 w-14 place-items-center rounded-full bg-[#EAF6EA] text-[#2E7D32]">
                  <PackageOpen className="h-6 w-6" strokeWidth={1.9} />
                </span>
                <p className="text-[14px] font-semibold text-[#111111]">No interested buyers found.</p>
                <p className="max-w-xs text-[12.5px] text-[#666666]">
                  Buyers will appear here when they show interest in your crop lots.
                </p>
              </div>
            ) : visibleBuyers.length === 0 ? (
              <div className="flex flex-col items-center gap-3 rounded-2xl border border-[#E1E5E1] bg-white px-6 py-14 text-center">
                <span className="grid h-14 w-14 place-items-center rounded-full bg-[#EAF6EA] text-[#2E7D32]">
                  <PackageOpen className="h-6 w-6" strokeWidth={1.9} />
                </span>
                <p className="text-[14px] font-semibold text-[#111111]">No buyers match your search.</p>
                <p className="max-w-xs text-[12.5px] text-[#666666]">
                  Try a different tab, search term or filter combination.
                </p>
                <button
                  type="button"
                  onClick={resetAll}
                  className="mt-1 inline-flex h-10 items-center rounded-xl bg-[#2E7D32] px-5 text-[12.5px] font-semibold text-white transition-colors hover:bg-[#256628]"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <BuyersTable buyers={visibleBuyers} onView={setViewing} onAction={handleAction} />
            )}

            <BuyersBottomCards />
          </>
        )}
      </div>

      {/* Buyer details modal */}
      {viewing && (
        <BuyerDetailsModal
          buyer={viewing}
          onClose={() => setViewing(null)}
          onChat={(b) => setToast(`Chat with ${b.name} — messaging coming soon.`)}
          onToggleSave={toggleSave}
        />
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
    </DashboardLayout>
  );
}
