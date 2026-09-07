import { ChevronDown, Search } from "lucide-react";

const controlBase =
  "h-[46px] w-full rounded-xl border border-[#E1E5E1] bg-white text-[13.5px] text-[#111111] transition-colors outline-none focus:border-[#2E7D32]";
const labelBase = "mb-1.5 block text-[11px] font-bold tracking-[0.08em] text-[#8A938A] uppercase";

function FieldLabel({ children }: { children: string }) {
  return <span className={labelBase}>{children}</span>;
}

export interface LotFilterValues {
  crop: string;
  search: string;
}

export const EMPTY_FILTERS: LotFilterValues = { crop: "All Crops", search: "" };

export default function LotFilters({
  values,
  cropOptions,
  onChange,
}: {
  values: LotFilterValues;
  cropOptions: string[];
  onChange: (patch: Partial<LotFilterValues>) => void;
}) {
  return (
    <div className="rounded-2xl border border-[#E1E5E1] bg-white p-3.5 sm:p-4">
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-[240px_1fr]">
        {/* Crop */}
        <div>
          <FieldLabel>Crop</FieldLabel>
          <div className="relative">
            <select
              aria-label="Filter by crop"
              value={values.crop}
              onChange={(e) => onChange({ crop: e.target.value })}
              className={`${controlBase} appearance-none pr-9 pl-3.5 font-medium`}
            >
              {cropOptions.map((crop) => (
                <option key={crop} value={crop}>
                  {crop}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-[#8A938A]" />
          </div>
        </div>

        {/* Search */}
        <div>
          <FieldLabel>Search</FieldLabel>
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#8A938A]" />
            <input
              type="search"
              aria-label="Search your lots"
              value={values.search}
              onChange={(e) => onChange({ search: e.target.value })}
              placeholder="Crop, variety or Lot ID..."
              className={`${controlBase} pr-3.5 pl-10 placeholder:text-[#999999]`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
