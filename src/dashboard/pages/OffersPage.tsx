import { useEffect, useMemo, useState } from "react";
import { Lightbulb, PackageOpen } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import OfferCard from "../components/offers/OfferCard";
import type { OfferAction } from "../components/offers/OfferCard";
import { DetailPlaceholder, OfferDetailPanel } from "../components/offers/OfferDetailPanel";
import {
  AcceptOfferModal,
  CounterOfferModal,
  NegotiationTipsModal,
  RejectOfferModal,
} from "../components/offers/OfferModals";
import OffersToolbar from "../components/offers/OffersToolbar";
import type { OfferFilterValues, OfferTabKey } from "../components/offers/OffersToolbar";
import { BUYERS, INITIAL_OFFERS } from "../data/offers";
import type { Offer } from "../data/offers";
import { cn } from "../../utils/cn";

type ModalState =
  | { kind: "accept"; offer: Offer }
  | { kind: "reject"; offer: Offer }
  | { kind: "counter"; offer: Offer }
  | { kind: "tips" }
  | null;

export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>(INITIAL_OFFERS);
  const [selectedId, setSelectedId] = useState<string | null>(INITIAL_OFFERS[0]!.id);
  const [tab, setTab] = useState<OfferTabKey>("all");
  const [filters, setFilters] = useState<OfferFilterValues>({
    lot: "All Lots",
    crop: "All Crops",
    status: "All Status",
    sort: "Latest First",
    search: "",
  });
  const [modal, setModal] = useState<ModalState>(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(t);
  }, [toast]);

  /* ------------------------------ Derived data ------------------------------ */
  const counts = useMemo(() => {
    const c: Record<OfferTabKey, number> = { all: offers.length, pending: 0, accepted: 0, rejected: 0, countered: 0 };
    for (const offer of offers) c[offer.status] += 1;
    return c;
  }, [offers]);

  const lotOptions = useMemo(() => ["All Lots", ...Array.from(new Set(offers.map((o) => o.lotLabel)))], [offers]);
  const cropOptions = useMemo(() => ["All Crops", ...Array.from(new Set(offers.map((o) => o.crop)))], [offers]);

  const visibleOffers = useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    const statusFilter = filters.status.toLowerCase();
    const list = offers.filter((offer) => {
      const buyer = BUYERS[offer.buyerId];
      if (tab !== "all" && offer.status !== tab) return false;
      if (filters.lot !== "All Lots" && offer.lotLabel !== filters.lot) return false;
      if (filters.crop !== "All Crops" && offer.crop !== filters.crop) return false;
      if (statusFilter !== "all status" && offer.status !== statusFilter) return false;
      if (
        q &&
        ![buyer?.name ?? "", buyer?.location ?? "", offer.crop, offer.lotLabel].some((f) => f.toLowerCase().includes(q))
      )
        return false;
      return true;
    });
    switch (filters.sort) {
      case "Oldest First":
        return [...list].sort((a, b) => a.receivedIso.localeCompare(b.receivedIso));
      case "Price: High to Low":
        return [...list].sort((a, b) => b.pricePerKg - a.pricePerKg);
      case "Price: Low to High":
        return [...list].sort((a, b) => a.pricePerKg - b.pricePerKg);
      case "Amount: High to Low":
        return [...list].sort((a, b) => b.totalAmount - a.totalAmount);
      default:
        return [...list].sort((a, b) => b.receivedIso.localeCompare(a.receivedIso));
    }
  }, [offers, tab, filters]);

  const selectedOffer = offers.find((o) => o.id === selectedId) ?? null;
  const selectedBuyer = selectedOffer ? BUYERS[selectedOffer.buyerId] : null;

  /* ------------------------------ Mutations --------------------------------- */
  const updateStatus = (id: string, status: Offer["status"], extra?: Partial<Offer>) => {
    setOffers((prev) => prev.map((o) => (o.id === id ? { ...o, ...extra, status } : o)));
  };

  const handleAction = (offer: Offer, action: OfferAction) => {
    if (action === "accept") setModal({ kind: "accept", offer });
    else if (action === "reject") setModal({ kind: "reject", offer });
    else setModal({ kind: "counter", offer });
  };

  const confirmAccept = (offer: Offer) => {
    updateStatus(offer.id, "accepted");
    setModal(null);
    setToast(`Offer from ${BUYERS[offer.buyerId]!.name} accepted. Coordinate pickup next.`);
  };

  const confirmReject = (offer: Offer) => {
    updateStatus(offer.id, "rejected");
    setModal(null);
    setToast(`Offer from ${BUYERS[offer.buyerId]!.name} rejected.`);
  };

  const sendCounter = (price: number, note: string) => {
    if (modal?.kind !== "counter") return;
    updateStatus(modal.offer.id, "countered", {
      counterPrice: price,
      counterNote: note || undefined,
    });
    setModal(null);
    setToast(`Counter offer of ₹ ${price.toFixed(2)}/kg sent to ${BUYERS[modal.offer.buyerId]!.name}.`);
  };

  /* --------------------------------- Render --------------------------------- */
  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-[1240px]">
        {/* Page header */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-[24px] font-bold tracking-[-0.01em] text-[#111111] sm:text-[28px]">
              Offers
            </h1>
            <p className="mt-1 text-[13.5px] text-[#666666]">
              View and manage offers from verified buyers for your produce lots.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setModal({ kind: "tips" })}
            className="inline-flex h-[42px] items-center gap-2 rounded-xl border-[1.5px] border-[#CBDCF2] bg-white px-4 text-[13px] font-semibold text-[#1D6FB8] transition-all duration-200 hover:bg-[#F3F8FD]"
          >
            <Lightbulb className="h-4 w-4 text-[#E8862D]" strokeWidth={2.2} />
            Negotiation Tips
          </button>
        </div>

        {/* Tabs + filters */}
        <div className="mt-6">
          <OffersToolbar
            counts={counts}
            activeTab={tab}
            onTabChange={setTab}
            filters={filters}
            lotOptions={lotOptions}
            cropOptions={cropOptions}
            onFilterChange={(patch) => setFilters((f) => ({ ...f, ...patch }))}
          />
        </div>

        {/* List + detail panel */}
        <div className="mt-5 grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
          <div className="flex min-w-0 flex-col gap-4">
            {visibleOffers.length === 0 ? (
              <div className="flex flex-col items-center gap-3 rounded-2xl border border-[#E1E5E1] bg-white px-6 py-14 text-center">
                <span className="grid h-14 w-14 place-items-center rounded-full bg-[#EAF6EA] text-[#2E7D32]">
                  <PackageOpen className="h-6 w-6" strokeWidth={1.9} />
                </span>
                <p className="text-[14px] font-semibold text-[#111111]">No offers match your filters</p>
                <p className="max-w-xs text-[12.5px] text-[#666666]">
                  Try a different tab, search text or filter combination.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setTab("all");
                    setFilters({ lot: "All Lots", crop: "All Crops", status: "All Status", sort: "Latest First", search: "" });
                  }}
                  className="mt-1 inline-flex h-10 items-center rounded-xl bg-[#2E7D32] px-5 text-[12.5px] font-semibold text-white transition-colors hover:bg-[#256628]"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              visibleOffers.map((offer) => (
                <OfferCard
                  key={offer.id}
                  offer={offer}
                  buyer={BUYERS[offer.buyerId]!}
                  selected={selectedId === offer.id}
                  onSelect={() => setSelectedId(offer.id)}
                  onAction={(action) => {
                    setSelectedId(offer.id);
                    handleAction(offer, action);
                  }}
                />
              ))
            )}
          </div>

          {selectedOffer && selectedBuyer ? (
            <OfferDetailPanel
              offer={selectedOffer}
              buyer={selectedBuyer}
              onClose={() => setSelectedId(null)}
              onAction={(action) => handleAction(selectedOffer, action)}
            />
          ) : (
            <DetailPlaceholder />
          )}
        </div>
      </div>

      {/* Modals */}
      {modal?.kind === "accept" && (
        <AcceptOfferModal offer={modal.offer} buyer={BUYERS[modal.offer.buyerId]!} onCancel={() => setModal(null)} onConfirm={() => confirmAccept(modal.offer)} />
      )}
      {modal?.kind === "reject" && (
        <RejectOfferModal offer={modal.offer} buyer={BUYERS[modal.offer.buyerId]!} onCancel={() => setModal(null)} onConfirm={() => confirmReject(modal.offer)} />
      )}
      {modal?.kind === "counter" && (
        <CounterOfferModal offer={modal.offer} onCancel={() => setModal(null)} onSend={sendCounter} />
      )}
      {modal?.kind === "tips" && <NegotiationTipsModal onClose={() => setModal(null)} />}

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
