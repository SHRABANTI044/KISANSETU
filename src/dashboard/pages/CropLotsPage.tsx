import { useEffect, useMemo, useState } from "react";
import { ChevronDown, PackageOpen, Plus, Trash2 } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import CreateLotModal from "../components/lots/CreateLotModal";
import { EMPTY_LOT_FORM, lotToForm } from "../components/lots/CreateLotModal";
import type { LotFormValues } from "../components/lots/CreateLotModal";
import LotCard from "../components/lots/LotCard";
import type { LotAction } from "../components/lots/LotCard";
import LotDetailsPanel from "../components/lots/LotDetailsPanel";
import type { DetailTab } from "../components/lots/LotDetailsPanel";
import LotFilters from "../components/lots/LotFilters";
import type { LotFilterValues } from "../components/lots/LotFilters";
import LotTabs from "../components/lots/LotTabs";
import type { LotTabKey } from "../components/lots/LotTabs";
import {
  INITIAL_LOTS,
  INITIAL_OFFERS,
  LOT_VIEWERS,
  nowTimestamp,
  todayIso,
  todayLabel,
} from "../data/cropLots";
import type { CropLot, LotOffer } from "../data/cropLots";
import crateFallback from "../../assets/images/mandi-market.jpg";
import { cn } from "../../utils/cn";

type SortKey = "newest" | "oldest" | "priceDesc" | "priceAsc" | "qtyDesc" | "qtyAsc";

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "newest", label: "Newest First" },
  { key: "oldest", label: "Oldest First" },
  { key: "priceDesc", label: "Price: High to Low" },
  { key: "priceAsc", label: "Price: Low to High" },
  { key: "qtyDesc", label: "Quantity: High to Low" },
  { key: "qtyAsc", label: "Quantity: Low to High" },
];

function lotPrice(lot: CropLot): number {
  return lot.soldPrice ?? lot.expectedPrice ?? 0;
}

function isoToLabel(iso: string): string {
  if (!iso) return "";
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default function MyLotsPage() {
  /* ------------------------------- Data state ------------------------------- */
  const [lots, setLots] = useState<CropLot[]>(INITIAL_LOTS);
  const [offersByLot, setOffersByLot] = useState<Record<string, LotOffer[]>>(INITIAL_OFFERS);

  /* -------------------------------- UI state -------------------------------- */
  const [selectedId, setSelectedId] = useState<string>(INITIAL_LOTS[0]!.id);
  const [tab, setTab] = useState<LotTabKey>("all");
  const [filters, setFilters] = useState<LotFilterValues>({ crop: "All Crops", status: "All Status", date: "", search: "" });
  const [sortKey, setSortKey] = useState<SortKey>("newest");
  const [detailTab, setDetailTab] = useState<DetailTab>("details");
  const [modal, setModal] = useState<{ mode: "create" | "edit"; lot?: CropLot } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CropLot | null>(null);
  const [toast, setToast] = useState("");

  /* Toast auto-dismiss */
  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(t);
  }, [toast]);

  /* ----------------------------- Derived lists ------------------------------ */
  const cropOptions = useMemo(
    () => ["All Crops", ...Array.from(new Set(lots.map((l) => l.cropKey)))],
    [lots]
  );

  const counts = useMemo(() => {
    const c: Record<LotTabKey, number> = { all: lots.length, active: 0, sold: 0, draft: 0, expired: 0 };
    for (const lot of lots) c[lot.status] += 1;
    return c;
  }, [lots]);

  const visibleLots = useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    const statusFromDropdown = filters.status.toLowerCase();
    const result = lots.filter((lot) => {
      if (tab !== "all" && lot.status !== tab) return false;
      if (filters.crop !== "All Crops" && lot.cropKey !== filters.crop) return false;
      if (statusFromDropdown !== "all status" && lot.status !== statusFromDropdown) return false;
      if (filters.date && lot.harvestDateIso !== filters.date && lot.postedOnIso !== filters.date) return false;
      if (q && ![lot.crop, lot.cropKey, lot.id, lot.location].some((field) => field.toLowerCase().includes(q))) return false;
      return true;
    });
    const sorted = [...result];
    switch (sortKey) {
      case "newest":
        sorted.sort((a, b) => b.postedOnIso.localeCompare(a.postedOnIso));
        break;
      case "oldest":
        sorted.sort((a, b) => a.postedOnIso.localeCompare(b.postedOnIso));
        break;
      case "priceDesc":
        sorted.sort((a, b) => lotPrice(b) - lotPrice(a));
        break;
      case "priceAsc":
        sorted.sort((a, b) => lotPrice(a) - lotPrice(b));
        break;
      case "qtyDesc":
        sorted.sort((a, b) => b.quantity - a.quantity);
        break;
      case "qtyAsc":
        sorted.sort((a, b) => a.quantity - b.quantity);
        break;
    }
    return sorted;
  }, [lots, tab, filters, sortKey]);

  const selectedLot = lots.find((l) => l.id === selectedId) ?? visibleLots[0] ?? lots[0];

  /* ------------------------------- Handlers --------------------------------- */
  const patchFilters = (patch: Partial<LotFilterValues>) => setFilters((f) => ({ ...f, ...patch }));

  const resetFilters = () => {
    setTab("all");
    setFilters({ crop: "All Crops", status: "All Status", date: "", search: "" });
  };

  const selectLot = (lot: CropLot, openTab?: DetailTab) => {
    setSelectedId(lot.id);
    if (openTab) setDetailTab(openTab);
  };

  const handleAction = (lot: CropLot, action: LotAction) => {
    if (action === "delete") {
      setDeleteTarget(lot);
      return;
    }
    if (action === "edit") {
      setModal({ mode: "edit", lot });
      return;
    }
    if (action === "publish") {
      const today = todayLabel();
      setLots((prev) =>
        prev.map((l) =>
          l.id === lot.id
            ? { ...l, status: "active", postedOn: today, postedOnIso: todayIso(), lastUpdated: nowTimestamp() }
            : l
        )
      );
      selectLot(lot);
      setToast(`"${lot.crop}" is now live for buyers.`);
      return;
    }
    /* offers → select + open offers tab in the panel */
    selectLot(lot, "offers");
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setLots((prev) => prev.filter((l) => l.id !== deleteTarget.id));
    setOffersByLot((prev) => {
      const next = { ...prev };
      delete next[deleteTarget.id];
      return next;
    });
    if (selectedId === deleteTarget.id) {
      const remaining = lots.filter((l) => l.id !== deleteTarget.id);
      setSelectedId(remaining[0]?.id ?? "");
    }
    setToast(`Lot "${deleteTarget.crop}" deleted.`);
    setDeleteTarget(null);
  };

  const saveModal = (values: LotFormValues) => {
    const harvestLabel = values.harvestDateIso ? isoToLabel(values.harvestDateIso) : "";
    if (modal?.mode === "edit" && modal.lot) {
      const target = modal.lot;
      setLots((prev) =>
        prev.map((l) =>
          l.id === target.id
            ? {
                ...l,
                crop: values.crop.trim(),
                cropKey: values.crop.trim().replace(/\s*\(.*\)\s*$/, "").trim() || l.cropKey,
                quantity: Number(values.quantity) || l.quantity,
                unit: values.unit,
                grade: values.grade,
                location: values.location.trim(),
                harvestDate: harvestLabel,
                harvestDateIso: values.harvestDateIso,
                expectedPrice: values.expectedPrice ? Number(values.expectedPrice) : l.expectedPrice,
                description: values.description.trim() || l.description,
                lastUpdated: nowTimestamp(),
              }
            : l
        )
      );
      setToast(`Lot "${values.crop.trim()}" updated.`);
    } else {
      const id = `LOT${Date.now().toString().slice(-9)}`;
      const isDraft = values.status === "draft";
      const today = todayLabel();
      const newLot: CropLot = {
        id,
        crop: values.crop.trim(),
        cropKey: values.crop.trim().replace(/\s*\(.*\)\s*$/, "").trim() || values.crop.trim(),
        quantity: Number(values.quantity) || 0,
        unit: values.unit,
        grade: values.grade,
        status: values.status,
        location: values.location.trim(),
        harvestDate: harvestLabel,
        harvestDateIso: values.harvestDateIso,
        expectedPrice: values.expectedPrice ? Number(values.expectedPrice) : undefined,
        offers: 0,
        views: 0,
        postedOn: isDraft ? "" : today,
        postedOnIso: isDraft ? "" : todayIso(),
        lastSaved: isDraft ? today : undefined,
        lastUpdated: nowTimestamp(),
        description: values.description.trim() || "Freshly harvested produce, ready for buyers.",
        image: crateFallback,
        images: [crateFallback],
      };
      setLots((prev) => [newLot, ...prev]);
      setSelectedId(id);
      setDetailTab("details");
      setToast(isDraft ? `Draft "${newLot.crop}" saved.` : `Lot "${newLot.crop}" published.`);
    }
    setModal(null);
  };

  /* --------------------------------- Render --------------------------------- */
  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-[1240px]">
        {/* Page heading */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-[24px] font-bold tracking-[-0.01em] text-[#111111] sm:text-[28px]">
              My Lots
            </h1>
            <p className="mt-1 text-[13.5px] text-[#666666]">
              Manage all your produce lots. Track status, view offers, and edit or create new lots.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setModal({ mode: "create" })}
            className="inline-flex h-[46px] items-center gap-2 rounded-xl bg-[#2E7D32] px-5 text-[14px] font-semibold text-white shadow-[0_12px_24px_-10px_rgba(46,125,50,0.55)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#256628]"
          >
            <Plus className="h-[17px] w-[17px]" strokeWidth={2.5} />
            Create New Lot
          </button>
        </div>

        {/* Status tabs */}
        <div className="mt-6">
          <LotTabs counts={counts} active={tab} onChange={setTab} />
        </div>

        {/* Filters + sort */}
        <div className="mt-5 flex flex-col gap-3.5 xl:flex-row xl:items-start xl:gap-4">
          <div className="flex-1">
            <LotFilters values={filters} cropOptions={cropOptions} onChange={patchFilters} />
          </div>
          <div className="flex items-center justify-between gap-3 xl:pt-6">
            <span className="text-[12px] font-medium whitespace-nowrap text-[#777777]">Sort by</span>
            <div className="relative">
              <select
                aria-label="Sort lots"
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value as SortKey)}
                className="h-[42px] appearance-none rounded-xl border border-[#E1E5E1] bg-white pr-9 pl-3.5 text-[12.5px] font-semibold text-[#444444] transition-colors outline-none focus:border-[#2E7D32]"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.key} value={o.key}>
                    {o.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-[#8A938A]" />
            </div>
          </div>
        </div>

        {/* List + details */}
        <div className="mt-5 grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_365px]">
          <div className="flex min-w-0 flex-col gap-4">
            {visibleLots.length === 0 ? (
              <div className="flex flex-col items-center gap-3 rounded-2xl border border-[#E1E5E1] bg-white px-6 py-14 text-center">
                <span className="grid h-14 w-14 place-items-center rounded-full bg-[#EAF6EA] text-[#2E7D32]">
                  <PackageOpen className="h-6 w-6" strokeWidth={1.9} />
                </span>
                <p className="text-[14px] font-semibold text-[#111111]">No lots match your filters</p>
                <p className="max-w-xs text-[12.5px] text-[#666666]">
                  Try a different search, crop, status or date — or reset everything.
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-1 inline-flex h-10 items-center rounded-xl bg-[#2E7D32] px-5 text-[12.5px] font-semibold text-white transition-colors hover:bg-[#256628]"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              visibleLots.map((lot) => (
                <LotCard
                  key={lot.id}
                  lot={lot}
                  selected={selectedLot?.id === lot.id}
                  onSelect={() => selectLot(lot)}
                  onAction={(action) => handleAction(lot, action)}
                />
              ))
            )}
          </div>

          {/* Right details panel */}
          {selectedLot && (
            <LotDetailsPanel
              lot={selectedLot}
              tab={detailTab}
              onTabChange={setDetailTab}
              offers={offersByLot[selectedLot.id] ?? []}
              viewers={LOT_VIEWERS[selectedLot.id] ?? []}
              onOfferUpdate={(offer) =>
                setOffersByLot((prev) => ({
                  ...prev,
                  [selectedLot.id]: (prev[selectedLot.id] ?? []).map((o) => (o.id === offer.id ? offer : o)),
                }))
              }
              onAddPhoto={(dataUrl) =>
                setLots((prev) =>
                  prev.map((l) => (l.id === selectedLot.id ? { ...l, images: [...l.images, dataUrl] } : l))
                )
              }
            />
          )}
        </div>
      </div>

      {/* Create / edit modal */}
      {modal && (
        <CreateLotModal
          mode={modal.mode}
          initialValues={modal.lot ? lotToForm(modal.lot) : EMPTY_LOT_FORM}
          onClose={() => setModal(null)}
          onSave={saveModal}
        />
      )}

      {/* Delete confirmation */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/45 p-5 backdrop-blur-[2px]"
          role="alertdialog"
          aria-modal="true"
          aria-label="Delete lot"
          onClick={() => setDeleteTarget(null)}
        >
          <div
            className="animate-pop-in w-full max-w-[420px] rounded-3xl bg-white p-7 text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-red-50 text-red-500">
              <Trash2 className="h-6 w-6" strokeWidth={2} />
            </span>
            <h2 className="mt-4 font-display text-[18px] font-bold text-[#111111]">Delete this lot?</h2>
            <p className="mt-2 text-[13px] leading-relaxed text-[#666666]">
              <span className="font-semibold text-[#111111]">{deleteTarget.crop}</span> ({deleteTarget.id}) and
              its offers will be removed. This cannot be undone.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="inline-flex h-[46px] flex-1 items-center justify-center rounded-xl border-[1.5px] border-[#D8DED8] bg-white text-[13.5px] font-semibold text-[#444444] transition-colors hover:border-[#2E7D32]/50 hover:text-[#2E7D32]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="inline-flex h-[46px] flex-1 items-center justify-center rounded-xl bg-red-500 text-[13.5px] font-semibold text-white transition-colors hover:bg-red-600"
              >
                Delete Lot
              </button>
            </div>
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
    </DashboardLayout>
  );
}
