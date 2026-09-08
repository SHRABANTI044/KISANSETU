import { useEffect, useMemo, useState } from "react";
import { Loader2, PackageOpen, Plus, Trash2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";
import DashboardLayout from "../components/DashboardLayout";
import CreateLotModal from "../components/lots/CreateLotModal";
import { EMPTY_LOT_FORM, lotToForm } from "../components/lots/CreateLotModal";
import type { LotFormValues, LotSaveIntent } from "../components/lots/CreateLotModal";
import LotCard from "../components/lots/LotCard";
import type { LotAction } from "../components/lots/LotCard";
import LotDetailsPanel from "../components/lots/LotDetailsPanel";
import type { DetailTab } from "../components/lots/LotDetailsPanel";
import LotFilters from "../components/lots/LotFilters";
import { EMPTY_FILTERS } from "../components/lots/LotFilters";
import type { LotFilterValues } from "../components/lots/LotFilters";
import LotTabs from "../components/lots/LotTabs";
import type { LotTabKey } from "../components/lots/LotTabs";
import type { CropLot, LotOffer } from "../data/cropLots";
import tomatoImg from "../../assets/images/lots/tomato.jpg";
import onionImg from "../../assets/images/lots/onion.jpg";
import potatoImg from "../../assets/images/lots/potato.jpg";
import crateFallback from "../../assets/images/mandi-market.jpg";
import { cn } from "../../utils/cn";

function getCropImage(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("tomato")) return tomatoImg;
  if (n.includes("onion")) return onionImg;
  if (n.includes("potato")) return potatoImg;
  return crateFallback;
}

export default function MyLotsPage() {
  const { user, profile } = useAuth();

  /* ------------------------------- Data state ------------------------------- */
  const [lots, setLots] = useState<CropLot[]>([]);
  const [offersByLot, setOffersByLot] = useState<Record<string, LotOffer[]>>({});
  const [loading, setLoading] = useState(true);

  /* -------------------------------- UI state -------------------------------- */
  const [selectedId, setSelectedId] = useState<string>("");
  const [tab, setTab] = useState<LotTabKey>("all");
  const [filters, setFilters] = useState<LotFilterValues>(EMPTY_FILTERS);
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

  /* ----------------------- Fetch from Supabase Backend ----------------------- */
    /* ----------------------- Fetch from Supabase Backend ----------------------- */
  useEffect(() => {
    async function loadLots() {
      if (!user) return;
      setLoading(true);
      try {
        // 1. Fetch crops cultivated by this farmer
        const { data: cropsData, error: cropsError } = await supabase
          .from("farmer_crops")
          .select("*")
          .eq("farmer_id", user.id);

        if (cropsError) {
          console.error("farmer_crops error:", cropsError);
          throw cropsError;
        }

        // 2. Fetch produce listings
        const { data: listingsData } = await supabase
          .from("produce_listings")
          .select("*")
          .eq("farmer_id", user.id);

        // 3. Fetch real farmer location from farmer_profiles
        const { data: farmerData } = await supabase
          .from("farmer_profiles")
          .select("district, state")
          .eq("id", user.id)
          .maybeSingle();

        const defaultLoc = farmerData?.district
          ? `${farmerData.district}, ${farmerData.state || ""}`
          : "Farm Location";

        if (cropsData) {
          const mapped: CropLot[] = cropsData.map((c: any) => {
            // Match the listing for this crop
            const listing = (listingsData || []).find(
              (l: any) =>
                l.farmer_crop_id === c.id ||
                l.crop_name?.toLowerCase() === c.crop_name?.toLowerCase()
            );

            const listingStatus = listing?.status?.toLowerCase();
            const isSold =
              c.status?.toLowerCase() === "sold" ||
              listingStatus === "sold";

            // Only mark active if produce_listings has status 'active' or 'live'
            const isActive =
              !isSold &&
              (listingStatus === "active" ||
                listingStatus === "live" ||
                c.status?.toLowerCase() === "live");

            const statusVal: "active" | "sold" = isSold
              ? "sold"
              : isActive
              ? "active"
              : ("inactive" as any);

            const lotImg = getCropImage(c.crop_name || "");

            return {
              id: String(c.id),
              crop: c.crop_name || "Unnamed Crop",
              cropKey: c.crop_name || "Crop",
              variety: c.variety || "",
              quantity: Number(listing?.quantity ?? c.quantity ?? 0),
              unit: (listing?.unit || c.unit || "kg") as CropLot["unit"],
              grade: listing?.grade || c.grade || "Grade A",
              organic: Boolean(c.is_organic),
              status: statusVal,
              location: listing?.location || defaultLoc,
              harvestDate: c.available_date || "",
              harvestDateIso: c.available_date || "",
              availableUntil: "",
              availableUntilIso: "",
              expectedPrice: listing?.expected_price ? Number(listing.expected_price) : undefined,
              priceUnit: (listing?.unit || c.unit || "kg") as CropLot["unit"],
              soldPrice: isSold ? Number(listing?.expected_price ?? 0) : undefined,
              buyer: isSold ? "Verified Buyer" : undefined,
              offers: 0,
              views: 0,
              postedOn: c.created_at
                ? new Date(c.created_at).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "Recently",
              postedOnIso: c.created_at ? String(c.created_at).slice(0, 10) : "",
              lastUpdated: "Recently",
              description: `Quality ${c.crop_name}${
                c.variety ? ` (${c.variety})` : ""
              }, grade ${c.grade || "A"}. Ready for purchase.`,
              image: lotImg,
              images: [lotImg],
            };
          });

          setLots(mapped);
          if (mapped.length > 0) {
            setSelectedId(mapped[0]!.id);
          }
        }
      } catch (err) {
        console.error("Error loading farmer lots:", err);
      } finally {
        setLoading(false);
      }
    }

    loadLots();
  }, [user]);

  /* ----------------------------- Derived lists ------------------------------ */
  const cropOptions = [
    "All Crops",
    "Tomato",
    "Onion",
    "Potato",
    "Cabbage",
    "Pumpkin",
  ];

  const counts = useMemo(() => {
    const c: Record<LotTabKey, number> = { all: lots.length, active: 0, sold: 0 };
    for (const lot of lots) {
      if (lot.status === "active") c.active += 1;
      if (lot.status === "sold") c.sold += 1;
    }
    return c;
  }, [lots]);

  const visibleLots = useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    return lots.filter((lot) => {
      if (tab !== "all" && lot.status !== tab) return false;
      if (
        filters.crop !== "All Crops" &&
        lot.crop.toLowerCase() !== filters.crop.toLowerCase() &&
        lot.cropKey?.toLowerCase() !== filters.crop.toLowerCase()
      ) {
        return false;
      }
      if (
        q &&
        ![lot.crop, lot.variety ?? "", lot.cropKey, lot.id, lot.location].some((field) =>
          field.toLowerCase().includes(q)
        )
      ) {
        return false;
      }
      return true;
    });
  }, [lots, tab, filters]);

  const selectedLot = visibleLots.find((l) => l.id === selectedId) ?? visibleLots[0] ?? lots[0];

  /* ------------------------------- Handlers --------------------------------- */
  const patchFilters = (patch: Partial<LotFilterValues>) => setFilters((f) => ({ ...f, ...patch }));

  const resetFilters = () => {
    setTab("all");
    setFilters(EMPTY_FILTERS);
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
    if (action === "details") {
      selectLot(lot, "details");
      return;
    }
  };

  /* ----------------------- Delete from Backend ----------------------- */
  const confirmDelete = async () => {
    if (!deleteTarget || !user) return;
    try {
      // 1. Delete associated produce_listings
      await supabase
        .from("produce_listings")
        .delete()
        .eq("farmer_id", user.id)
        .eq("farmer_crop_id", deleteTarget.id);

      // 2. Delete from farmer_crops
      const { error } = await supabase
        .from("farmer_crops")
        .delete()
        .eq("farmer_id", user.id)
        .eq("id", deleteTarget.id);

      if (error) throw error;

      setLots((prev) => prev.filter((l) => l.id !== deleteTarget.id));
      setToast(`Lot "${deleteTarget.crop}" deleted.`);
    } catch (err) {
      console.error("Error deleting crop lot:", err);
      setToast("Failed to delete lot. Please try again.");
    } finally {
      setDeleteTarget(null);
    }
  };

  /* ----------------------- Save / Edit to Backend ----------------------- */
  const saveModal = async (values: LotFormValues, _intent: LotSaveIntent) => {
    if (!user) return;

    if (modal?.mode === "edit" && modal.lot) {
      const target = modal.lot;
      try {
        // 1. Update farmer_crops
        await supabase
          .from("farmer_crops")
          .update({
            crop_name: values.crop.trim(),
            variety: values.variety.trim() || null,
            quantity: Number(values.quantity) || 0,
            unit: values.unit,
            grade: values.grade,
            is_organic: values.organic === "yes",
          })
          .eq("id", target.id)
          .eq("farmer_id", user.id);

        // 2. Update produce_listings
        await supabase
          .from("produce_listings")
          .update({
            crop_name: values.crop.trim(),
            quantity: Number(values.quantity) || 0,
            unit: values.unit,
            grade: values.grade,
            expected_price: values.expectedPrice ? Number(values.expectedPrice) : 0,
            location: values.location.trim(),
          })
          .eq("farmer_crop_id", target.id)
          .eq("farmer_id", user.id);

        setLots((prev) =>
          prev.map((l) =>
            l.id === target.id
              ? {
                  ...l,
                  crop: values.crop.trim(),
                  cropKey: values.crop.trim(),
                  variety: values.variety.trim(),
                  quantity: Number(values.quantity) || l.quantity,
                  unit: values.unit,
                  grade: values.grade,
                  organic: values.organic === "yes",
                  location: values.location.trim(),
                  expectedPrice: values.expectedPrice ? Number(values.expectedPrice) : l.expectedPrice,
                  priceUnit: values.priceUnit,
                  description: values.description.trim() || l.description,
                }
              : l
          )
        );
        setToast(`Lot "${values.crop.trim()}" updated successfully.`);
      } catch (err) {
        console.error("Error updating lot:", err);
        setToast("Failed to update lot.");
      }
    } else {
      /* Create new lot in backend */
      try {
        // 1. Insert into farmer_crops
        const { data: insertedCrop, error: cropErr } = await supabase
          .from("farmer_crops")
          .insert({
            farmer_id: user.id,
            crop_name: values.crop.trim(),
            variety: values.variety.trim() || null,
            quantity: Number(values.quantity) || 0,
            unit: values.unit,
            grade: values.grade,
            is_organic: values.organic === "yes",
            list_for_sale: true,
            status: "Live",
          })
          .select()
          .single();

        if (cropErr) throw cropErr;

        // 2. Insert into produce_listings
        if (insertedCrop) {
          await supabase.from("produce_listings").insert({
            farmer_id: user.id,
            farmer_crop_id: insertedCrop.id,
            crop_name: values.crop.trim(),
            quantity: Number(values.quantity) || 0,
            unit: values.unit,
            grade: values.grade,
            expected_price: values.expectedPrice ? Number(values.expectedPrice) : 0,
            location: values.location.trim(),
            status: "active",
          });

          const lotImg = getCropImage(values.crop.trim());
          const newLot: CropLot = {
            id: String(insertedCrop.id),
            crop: values.crop.trim(),
            cropKey: values.crop.trim(),
            variety: values.variety.trim(),
            quantity: Number(values.quantity) || 0,
            unit: values.unit,
            grade: values.grade,
            organic: values.organic === "yes",
            status: "active",
            location: values.location.trim(),
            harvestDate: "",
            harvestDateIso: "",
            availableUntil: "",
            availableUntilIso: "",
            expectedPrice: values.expectedPrice ? Number(values.expectedPrice) : undefined,
            priceUnit: values.priceUnit,
            offers: 0,
            views: 0,
            postedOn: "Today",
            postedOnIso: new Date().toISOString().slice(0, 10),
            lastUpdated: "Just now",
            description: values.description.trim() || `Fresh ${values.crop.trim()} produce.`,
            image: lotImg,
            images: [lotImg],
          };

          setLots((prev) => [newLot, ...prev]);
          setSelectedId(newLot.id);
          setDetailTab("details");
          setToast(`Lot "${newLot.crop}" published to marketplace!`);
        }
      } catch (err) {
        console.error("Error creating lot:", err);
        setToast("Failed to create lot.");
      }
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

        {/* Filters bar */}
        <div className="mt-5">
          <LotFilters values={filters} cropOptions={cropOptions} onChange={patchFilters} />
        </div>

        {/* List + details */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-[#2E7D32]" />
            <span className="ml-2.5 text-[13.5px] font-medium text-[#666666]">Loading your lots...</span>
          </div>
        ) : (
          <div className="mt-5 grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_365px]">
            <div className="flex min-w-0 flex-col gap-4">
              {visibleLots.length === 0 ? (
                <div className="flex flex-col items-center gap-3 rounded-2xl border border-[#E1E5E1] bg-white px-6 py-14 text-center">
                  <span className="grid h-14 w-14 place-items-center rounded-full bg-[#EAF6EA] text-[#2E7D32]">
                    <PackageOpen className="h-6 w-6" strokeWidth={1.9} />
                  </span>
                  <p className="text-[14px] font-semibold text-[#111111]">
                    {tab === "sold" ? "No sold lots yet" : "No crop lots found"}
                  </p>
                  <p className="max-w-xs text-[12.5px] text-[#666666]">
                    {tab === "sold"
                      ? "When buyers complete purchase deals with you, they will appear here."
                      : "Add your produce or adjust your search filter to see results."}
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
                    offersCount={(offersByLot[lot.id] ?? []).length}
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
                viewers={[]}
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
        )}
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
              <span className="font-semibold text-[#111111]">{deleteTarget.crop}</span> and its produce listing will be deleted from your database. This cannot be undone.
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

      {/* Toast feedback */}
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