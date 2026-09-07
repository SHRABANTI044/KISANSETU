import { ChevronDown, LoaderCircle, Wheat } from "lucide-react";
import type { CropKey } from "../../data/marketPrices";
import { CROP_OPTIONS, DISTRICT_OPTIONS, STATE_OPTIONS } from "../../data/marketPrices";
import { cn } from "../../../utils/cn";

const selectCls =
  "h-[48px] w-full appearance-none rounded-xl border border-[#E1E5E1] bg-white pr-9 pl-3.5 text-[13.5px] font-medium text-[#111111] transition-colors outline-none focus:border-[#2E7D32]";
const labelCls = "mb-1.5 block text-[11px] font-bold tracking-[0.08em] text-[#8A938A] uppercase";

function Chevron() {
  return <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-[#8A938A]" />;
}

export interface PriceFilterValues {
  crop: CropKey;
  variety: string;
  state: string;
  district: string;
}

export default function MarketPriceFilters({
  values,
  varieties,
  updating,
  onChange,
  onApply,
}: {
  values: PriceFilterValues;
  varieties: string[];
  updating: boolean;
  onChange: (patch: Partial<PriceFilterValues>) => void;
  onApply: () => void;
}) {
  const crop = CROP_OPTIONS.find((c) => c.key === values.crop);

  return (
    <div className="rounded-2xl border border-[#E1E5E1] bg-white p-4 sm:p-5">
      <div className="grid items-end gap-4 sm:grid-cols-2 xl:grid-cols-[1.25fr_1.15fr_1fr_1fr_auto]">
        {/* Crop */}
        <div>
          <span className={labelCls}>Select Crop</span>
          <div className="relative">
            <span className="pointer-events-none absolute top-1/2 left-3 grid h-6 w-6 -translate-y-1/2 place-items-center overflow-hidden rounded-md">
              {crop?.image ? (
                <img src={crop.image} alt="" className="h-6 w-6 rounded-md object-cover" />
              ) : (
                <Wheat className="h-[18px] w-[18px] text-[#2E7D32]" />
              )}
            </span>
            <select
              aria-label="Select crop"
              value={values.crop}
              onChange={(e) => onChange({ crop: e.target.value as CropKey })
              }
              className={cn(selectCls, "pl-11")}
            >
              {CROP_OPTIONS.map((option) => (
                <option key={option.key} value={option.key}>
                  {option.label}
                </option>
              ))}
            </select>
            <Chevron />
          </div>
        </div>

        {/* Variety */}
        <div>
          <span className={labelCls}>Select Variety (Optional)</span>
          <div className="relative">
            <select
              aria-label="Select variety"
              value={values.variety}
              onChange={(e) => onChange({ variety: e.target.value })}
              className={selectCls}
            >
              {varieties.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
            <Chevron />
          </div>
        </div>

        {/* State */}
        <div>
          <span className={labelCls}>Select State</span>
          <div className="relative">
            <select
              aria-label="Select state"
              value={values.state}
              onChange={(e) => onChange({ state: e.target.value })}
              className={selectCls}
            >
              {STATE_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <Chevron />
          </div>
        </div>

        {/* District */}
        <div>
          <span className={labelCls}>Select District</span>
          <div className="relative">
            <select
              aria-label="Select district"
              value={values.district}
              onChange={(e) => onChange({ district: e.target.value })}
              className={selectCls}
            >
              {DISTRICT_OPTIONS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <Chevron />
          </div>
        </div>

        {/* Apply */}
        <button
          type="button"
          onClick={onApply}
          disabled={updating}
          aria-busy={updating}
          className="inline-flex h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-[#2E7D32] px-8 text-[14px] font-semibold whitespace-nowrap text-white shadow-[0_12px_24px_-10px_rgba(46,125,50,0.55)] transition-all duration-200 hover:bg-[#256628] disabled:cursor-wait disabled:opacity-85 xl:w-auto"
        >
          {updating ? (
            <>
              <LoaderCircle className="h-4 w-4 animate-spin" strokeWidth={2.4} />
              Updating...
            </>
          ) : (
            "Get Prices"
          )}
        </button>
      </div>
    </div>
  );
}
