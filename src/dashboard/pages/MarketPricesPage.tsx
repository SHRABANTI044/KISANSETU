import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import AIPredictionCard from "../components/market/AIPredictionCard";
import CompareMarkets from "../components/market/CompareMarkets";
import HistoricalTable from "../components/market/HistoricalTable";
import MarketInsights from "../components/market/MarketInsights";
import MarketPriceFilters from "../components/market/MarketPriceFilters";
import type { PriceFilterValues } from "../components/market/MarketPriceFilters";
import MarketPriceHeader from "../components/market/MarketPriceHeader";
import NearbyMandis from "../components/market/NearbyMandis";
import PriceOverviewCard from "../components/market/PriceOverviewCard";
import SetPriceAlert from "../components/market/SetPriceAlert";
import type { CropKey, MandiRow, TimeRange } from "../data/marketPrices";
import { CROPS, DISTRICT_OPTIONS, getMarketView, getSeries } from "../data/marketPrices";
import { cn } from "../../utils/cn";

function nowStamp(): string {
  const d = new Date();
  return `${d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}, ${d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}`;
}

/** Matches landing-page search params (?crop=onion&location=nashik) to filter presets. */
function cropParamToKey(value: string | null): CropKey | null {
  if (!value) return null;
  const normalized = value.trim().toLowerCase().replace(/\s+/g, "-");
  return normalized in CROPS ? (normalized as CropKey) : null;
}

function districtFromParam(value: string | null): string {
  if (!value) return "Ahmednagar";
  const found = DISTRICT_OPTIONS.find((d) => d.toLowerCase() === value.trim().toLowerCase());
  return found ?? "Ahmednagar";
}

export default function MarketPricesPage() {
  const [params] = useSearchParams();
  const initialCrop = cropParamToKey(params.get("crop")) ?? "tomato";
  const initialDistrict = districtFromParam(params.get("location"));

  /* Draft filter selections (applied on "Get Prices") */
  const [draft, setDraft] = useState<PriceFilterValues>({
    crop: initialCrop,
    variety: CROPS[initialCrop]!.varieties[0]!,
    state: "Maharashtra",
    district: initialDistrict,
  });
  /* Applied filters drive all data */
  const [applied, setApplied] = useState<PriceFilterValues>(draft);

  const [range, setRange] = useState<TimeRange>("7d");
  const [historyRange, setHistoryRange] = useState("Last 30 Days");
  const [updating, setUpdating] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("25 May 2025, 04:30 PM");
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(t);
  }, [toast]);

  const crop = CROPS[applied.crop]!;
  const view = useMemo(
    () => getMarketView(applied.crop, applied.state, applied.district),
    [applied]
  );
  const series = useMemo(
    () => getSeries(applied.crop, range, 1),
    [applied.crop, range]
  );

  const patchDraft = (patch: Partial<PriceFilterValues>) => {
    setDraft((d) => {
      const next = { ...d, ...patch };
      if (patch.crop && patch.crop !== d.crop) {
        next.variety = CROPS[patch.crop]!.varieties[0]!;
      }
      return next;
    });
  };

  const applyFilters = () => {
    if (updating) return;
    setUpdating(true);
    window.setTimeout(() => {
      setUpdating(false);
      setApplied(draft);
      setLastUpdated(nowStamp());
      setToast(`Prices updated for ${CROPS[draft.crop]!.label} — ${draft.district}, ${draft.state}.`);
    }, 750);
  };

  const refresh = () => {
    if (refreshing) return;
    setRefreshing(true);
    window.setTimeout(() => {
      setRefreshing(false);
      setLastUpdated(nowStamp());
      setToast("Market prices refreshed.");
    }, 950);
  };

  const viewDetails = (row: MandiRow) =>
    setToast(`${row.market} mandi — detailed breakdown coming soon.`);

  return (
    <DashboardLayout>
      <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-5 sm:gap-6">
        <MarketPriceHeader lastUpdated={lastUpdated} refreshing={refreshing} onRefresh={refresh} />

        <MarketPriceFilters
          values={draft}
          varieties={CROPS[draft.crop]!.varieties}
          updating={updating}
          onChange={patchDraft}
          onApply={applyFilters}
        />

        {/* Main content + right rail */}
        <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_370px]">
          {/* Left column */}
          <div className="flex min-w-0 flex-col gap-5">
            <PriceOverviewCard
              crop={crop}
              variety={applied.variety}
              stats={view.stats}
              series={series}
              range={range}
              onRangeChange={setRange}
            />
            <NearbyMandis mandis={view.mandis} onViewDetails={viewDetails} />
            <HistoricalTable
              rows={view.history}
              range={historyRange}
              onRangeChange={setHistoryRange}
              onViewFullChart={() => setToast("Full historical chart — coming soon.")}
            />
          </div>

          {/* Right column */}
          <div className="flex min-w-0 flex-col gap-5">
            <AIPredictionCard cropLabel={crop.label} prediction={view.prediction} />
            <SetPriceAlert onAlert={(t) => setToast(`Alert armed at ₹${Number(t).toFixed(2)}/kg (demo).`)} />
            <CompareMarkets rows={view.compare} />
            <MarketInsights cropLabel={crop.label} weeklyChange={view.stats.weeklyChange} />
          </div>
        </div>
      </div>

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
