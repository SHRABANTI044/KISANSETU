import { ChevronDown, Search } from "lucide-react";
import type { OfferStatus } from "../../data/offers";
import { cn } from "../../../utils/cn";

export type OfferTabKey = "all" | OfferStatus;

const TABS: { key: OfferTabKey; label: string }[] = [
  { key: "all", label: "All Offers" },
  { key: "pending", label: "Pending" },
  { key: "accepted", label: "Accepted" },
  { key: "rejected", label: "Rejected" },
  { key: "countered", label: "Countered" },
];

const selectCls =
  "h-[44px] w-full appearance-none rounded-xl border border-[#E1E5E1] bg-white pr-9 pl-3.5 text-[13px] font-medium text-[#111111] transition-colors outline-none focus:border-[#2E7D32]";

function Dropdown({
  label,
  value,
  options,
  onChange,
  ariaLabel,
}: {
  label?: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  ariaLabel: string;
}) {
  return (
    <div className="relative">
      {label && <span className="mb-1 block text-[10.5px] font-bold tracking-[0.08em] text-[#8A938A] uppercase">{label}</span>}
      <select aria-label={ariaLabel} value={value} onChange={(e) => onChange(e.target.value)} className={selectCls}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 bottom-[13px] h-4 w-4 text-[#8A938A]" />
    </div>
  );
}

export interface OfferFilterValues {
  lot: string;
  crop: string;
  status: string;
  sort: string;
  search: string;
}

export default function OffersToolbar({
  counts,
  activeTab,
  onTabChange,
  filters,
  lotOptions,
  cropOptions,
  onFilterChange,
}: {
  counts: Record<OfferTabKey, number>;
  activeTab: OfferTabKey;
  onTabChange: (key: OfferTabKey) => void;
  filters: OfferFilterValues;
  lotOptions: string[];
  cropOptions: string[];
  onFilterChange: (patch: Partial<OfferFilterValues>) => void;
}) {
  return (
    <div className="rounded-2xl border border-[#E1E5E1] bg-white">
      {/* Tabs */}
      <div className="no-scrollbar flex items-end gap-7 overflow-x-auto border-b border-[#E1E5E1] px-5 pt-3 sm:px-6" role="tablist" aria-label="Offer status">
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

      {/* Filters + search */}
      <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1fr_1.5fr] sm:px-5">
        <Dropdown label="Select Lot" ariaLabel="Filter by lot" value={filters.lot} options={lotOptions} onChange={(lot) => onFilterChange({ lot })} />
        <Dropdown label="Select Crop" ariaLabel="Filter by crop" value={filters.crop} options={cropOptions} onChange={(crop) => onFilterChange({ crop })} />
        <Dropdown
          label="Select Status"
          ariaLabel="Filter by status"
          value={filters.status}
          options={["All Status", "Pending", "Accepted", "Rejected", "Countered"]}
          onChange={(status) => onFilterChange({ status })}
        />
        <Dropdown
          label="Sort by"
          ariaLabel="Sort offers"
          value={filters.sort}
          options={["Latest First", "Oldest First", "Price: High to Low", "Price: Low to High", "Amount: High to Low"]}
          onChange={(sort) => onFilterChange({ sort })}
        />
        <div>
          <span className="mb-1 block text-[10.5px] font-bold tracking-[0.08em] text-[#8A938A] uppercase">Search</span>
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#8A938A]" />
            <input
              type="search"
              aria-label="Search offers"
              value={filters.search}
              onChange={(e) => onFilterChange({ search: e.target.value })}
              placeholder="Search by buyer name, location, or crop..."
              className="h-[44px] w-full rounded-xl border border-[#E1E5E1] bg-white pr-3.5 pl-10 text-[13px] text-[#111111] transition-colors outline-none placeholder:text-[#999999] focus:border-[#2E7D32]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
