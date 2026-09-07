import { Calendar, ChevronDown, Search } from "lucide-react";

export interface OrderFilterValues {
  crop: string;
  status: string;
  from: string;
  to: string;
  search: string;
}

export const EMPTY_ORDER_FILTERS: OrderFilterValues = {
  crop: "All Crops",
  status: "All Status",
  from: "",
  to: "",
  search: "",
};

const selectCls =
  "h-[44px] w-full appearance-none rounded-xl border border-[#E1E5E1] bg-white pr-8 pl-3 text-[12.5px] font-medium text-[#111111] transition-colors outline-none focus:border-[#2E7D32]";
const labelCls = "mb-1 block text-[10.5px] font-bold tracking-[0.08em] text-[#8A938A] uppercase";

export default function OrderFilters({
  values,
  cropOptions,
  onChange,
}: {
  values: OrderFilterValues;
  cropOptions: string[];
  onChange: (patch: Partial<OrderFilterValues>) => void;
}) {
  return (
    <div className="rounded-2xl border border-[#E1E5E1] bg-white p-4 sm:p-5">
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-[1.1fr_1.1fr_1.6fr_1.5fr]">
        {/* Crop */}
        <div>
          <span className={labelCls}>Select Crop</span>
          <div className="relative">
            <select aria-label="Filter by crop" value={values.crop} onChange={(e) => onChange({ crop: e.target.value })} className={selectCls}>
              {cropOptions.map((crop) => (
                <option key={crop}>{crop}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 h-3.5 w-3.5 -translate-y-1/2 text-[#8A938A]" />
          </div>
        </div>

        {/* Status */}
        <div>
          <span className={labelCls}>Select Status</span>
          <div className="relative">
            <select aria-label="Filter by status" value={values.status} onChange={(e) => onChange({ status: e.target.value })} className={selectCls}>
              {["All Status", "In Transit", "Delivered", "Payment Completed", "Cancelled"].map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 h-3.5 w-3.5 -translate-y-1/2 text-[#8A938A]" />
          </div>
        </div>

        {/* Date range */}
        <div>
          <span className={labelCls}>Select Date Range</span>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Calendar className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-[#8A938A]" />
              <input
                type="date"
                aria-label="From date"
                value={values.from}
                onChange={(e) => onChange({ from: e.target.value })}
                className="h-[44px] w-full rounded-xl border border-[#E1E5E1] bg-white pr-2 pl-9 text-[12px] font-medium text-[#666666] transition-colors outline-none focus:border-[#2E7D32]"
              />
            </div>
            <span className="text-[12px] font-medium text-[#999999]">–</span>
            <div className="relative flex-1">
              <Calendar className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-[#8A938A]" />
              <input
                type="date"
                aria-label="To date"
                value={values.to}
                onChange={(e) => onChange({ to: e.target.value })}
                className="h-[44px] w-full rounded-xl border border-[#E1E5E1] bg-white pr-2 pl-9 text-[12px] font-medium text-[#666666] transition-colors outline-none focus:border-[#2E7D32]"
              />
            </div>
          </div>
        </div>

        {/* Search */}
        <div>
          <span className={labelCls}>Search</span>
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#8A938A]" />
            <input
              type="search"
              aria-label="Search orders"
              value={values.search}
              onChange={(e) => onChange({ search: e.target.value })}
              placeholder="Search by order ID, buyer name, or crop..."
              className="h-[44px] w-full rounded-xl border border-[#E1E5E1] bg-white pr-3 pl-9 text-[12.5px] text-[#111111] transition-colors outline-none placeholder:text-[#999999] focus:border-[#2E7D32]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
