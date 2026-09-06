import { useEffect, useRef, useState } from "react";
import { ChevronDown, RotateCcw, Search, SlidersHorizontal } from "lucide-react";
import { BUYER_CROPS, BUYER_LOCATIONS, BUYER_OFFER_RANGES } from "../../data/interestedBuyers";
import { cn } from "../../../utils/cn";

export type BuyerTabKey = "all" | "offers" | "negotiation" | "converted" | "saved";

const TABS: { key: BuyerTabKey; label: string }[] = [
  { key: "all", label: "All Buyers" },
  { key: "offers", label: "Offers Received" },
  { key: "negotiation", label: "Negotiation" },
  { key: "converted", label: "Converted" },
  { key: "saved", label: "Saved Buyers" },
];

export interface BuyerFilterValues {
  crop: string;
  location: string;
  status: string;
  range: string;
}

export const EMPTY_BUYER_FILTERS: BuyerFilterValues = {
  crop: "All Crops",
  location: "All Locations",
  status: "All Status",
  range: "Any Offer",
};

const selectCls =
  "h-[42px] w-full appearance-none rounded-xl border border-[#E1E5E1] bg-white pr-8 pl-3 text-[12.5px] font-medium text-[#111111] transition-colors outline-none focus:border-[#2E7D32]";

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <span className="mb-1 block text-[10.5px] font-bold tracking-[0.08em] text-[#8A938A] uppercase">{label}</span>
      <div className="relative">
        <select value={value} onChange={(e) => onChange(e.target.value)} className={selectCls} aria-label={label}>
          {options.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 h-3.5 w-3.5 -translate-y-1/2 text-[#8A938A]" />
      </div>
    </div>
  );
}

export default function BuyersToolbar({
  counts,
  activeTab,
  onTabChange,
  search,
  onSearch,
  filters,
  onFilters,
}: {
  counts: Record<BuyerTabKey, number>;
  activeTab: BuyerTabKey;
  onTabChange: (key: BuyerTabKey) => void;
  search: string;
  onSearch: (value: string) => void;
  filters: BuyerFilterValues;
  onFilters: (values: BuyerFilterValues) => void;
}) {
  const [filterOpen, setFilterOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  /* Close the filter panel on outside click / Escape */
  useEffect(() => {
    if (!filterOpen) return;
    const onPointer = (e: PointerEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setFilterOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setFilterOpen(false);
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [filterOpen]);

  const hasActiveFilters = JSON.stringify(filters) !== JSON.stringify(EMPTY_BUYER_FILTERS);

  return (
    <div className="flex flex-col gap-4 border-b border-[#E1E5E1] lg:flex-row lg:items-end lg:justify-between">
      {/* Tabs */}
      <div className="no-scrollbar flex items-end gap-6 overflow-x-auto" role="tablist" aria-label="Buyer categories">
        {TABS.map((tab) => {
          const selected = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              role="tab"
              aria-selected={selected}
              onClick={() => onTabChange(tab.key)}
              className={cn(
                "relative shrink-0 pb-3 text-[13.5px] whitespace-nowrap transition-colors duration-200",
                selected ? "font-semibold text-[#2E7D32]" : "font-medium text-[#666666] hover:text-[#111111]"
              )}
            >
              {tab.label} ({counts[tab.key]})
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

      {/* Search + filter */}
      <div ref={panelRef} className="relative flex items-center gap-2.5 pb-0 lg:pb-3">
        <div className="relative min-w-0 flex-1 lg:w-[300px] lg:flex-none">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#8A938A]" />
          <input
            type="search"
            aria-label="Search buyers"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search buyers (name, location, crop)"
            className="h-[42px] w-full rounded-xl border border-[#E1E5E1] bg-white pr-3.5 pl-10 text-[13px] text-[#111111] transition-colors outline-none placeholder:text-[#999999] focus:border-[#2E7D32]"
          />
        </div>
        <button
          type="button"
          onClick={() => setFilterOpen((v) => !v)}
          aria-expanded={filterOpen}
          aria-label="Open filters"
          className={cn(
            "relative inline-flex h-[42px] shrink-0 items-center gap-2 rounded-xl border-[1.5px] bg-white px-4 text-[12.5px] font-semibold transition-colors",
            filterOpen || hasActiveFilters
              ? "border-[#2E7D32] text-[#2E7D32]"
              : "border-[#E1E5E1] text-[#555555] hover:text-[#2E7D32]"
          )}
        >
          <SlidersHorizontal className="h-4 w-4" strokeWidth={2.2} />
          Filter
          {hasActiveFilters && <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-[#2E7D32]" aria-hidden="true" />}
        </button>

        {/* Filter panel */}
        {filterOpen && (
          <div className="animate-pop-in absolute top-[calc(100%+8px)] right-0 z-40 w-[290px] rounded-2xl border border-[#E1E5E1] bg-white p-4 shadow-[0_20px_50px_-18px_rgba(17,17,17,0.25)]">
            <div className="flex items-center justify-between">
              <p className="text-[13px] font-bold text-[#111111]">Filter Buyers</p>
              <button
                type="button"
                onClick={() => onFilters(EMPTY_BUYER_FILTERS)}
                className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-[#666666] transition-colors hover:text-[#2E7D32]"
              >
                <RotateCcw className="h-3 w-3" />
                Reset
              </button>
            </div>
            <div className="mt-3.5 flex flex-col gap-3">
              <FilterSelect label="Crop" value={filters.crop} options={BUYER_CROPS} onChange={(crop) => onFilters({ ...filters, crop })} />
              <FilterSelect label="Location" value={filters.location} options={BUYER_LOCATIONS} onChange={(location) => onFilters({ ...filters, location })} />
              <FilterSelect
                label="Status"
                value={filters.status}
                options={["All Status", "New", "Offer Received", "Negotiation", "Interested", "Saved"]}
                onChange={(status) => onFilters({ ...filters, status })}
              />
              <FilterSelect label="Offer Range (₹/quintal)" value={filters.range} options={BUYER_OFFER_RANGES} onChange={(range) => onFilters({ ...filters, range })} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
