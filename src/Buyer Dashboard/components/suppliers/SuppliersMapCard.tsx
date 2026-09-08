import { useState } from "react";
import { ArrowRight, MapPin, Star } from "lucide-react";
import type { BuyerSupplier } from "../../data/buyerSuppliers";
import { TYPE_META } from "../../data/buyerSuppliers";
import { cn } from "../../../utils/cn";

/** Stylised West-Bengal-ish supplier map — UI demo, API-ready surface. */
export function SuppliersMapCard({ suppliers }: { suppliers: BuyerSupplier[] }) {
  const [expanded, setExpanded] = useState(false);
  const displaySuppliers = suppliers.length > 0 ? suppliers : [];

  return (
    <section className="rounded-2xl border border-[#E1E5E1] bg-white p-5 shadow-[0_10px_30px_-18px_rgba(17,17,17,0.12)]">
      <div className="flex items-center justify-between gap-3">
        <h3 className="flex items-center gap-2.5 font-display text-[16px] font-semibold text-[#111111]">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#EAF6EA] text-[#2E7D32]">
            <MapPin className="h-[18px] w-[18px]" strokeWidth={2} />
          </span>
          Suppliers Near You
        </h3>
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#2E7D32] transition-colors hover:text-[#155B32]"
        >
          View on Map
          <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.4} />
        </button>
      </div>

      <div
        className={cn(
          "relative mt-4 overflow-hidden rounded-2xl border border-[#E1E5E1] bg-[#F0FAF1] transition-all duration-300",
          expanded ? "h-[300px]" : "h-[190px]"
        )}
      >
        {/* Dotted terrain */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-60"
          style={{ backgroundImage: "radial-gradient(rgba(46,125,50,0.15) 1.2px, transparent 1.6px)", backgroundSize: "16px 16px" }}
        />
        {/* Puget "rivers" */}
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 360 300" fill="none" aria-hidden="true" preserveAspectRatio="none">
          <path d="M-10 60 C 80 90, 150 30, 220 70 S 340 60, 380 100" stroke="#BBD9E6" strokeWidth="16" strokeLinecap="round" opacity="0.7" />
          <path d="M-10 220 C 70 200, 180 260, 270 230 S 340 250, 380 240" stroke="#BBD9E6" strokeWidth="22" strokeLinecap="round" opacity="0.6" />
        </svg>

        {/* Markers */}
        {displaySuppliers.map((supplier, i) => {
          const isFpo = supplier.type === "fpo";
          const left = [14, 42, 30, 58, 24, 70, 46][i % 7];
          const top = [26, 40, 58, 30, 50, 62, 44][i % 7];
          return (
            <span
              key={supplier.id}
              className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
              style={{ left: `${left}%`, top: `${top}%` }}
              title={`${supplier.name} — ${supplier.location}`}
            >
              <span
                className={cn(
                  "grid h-6 w-6 place-items-center rounded-full text-white ring-2 ring-white/80 shadow-[0_6px_14px_-4px_rgba(0,0,0,0.35)]",
                  isFpo ? "bg-violet-600" : "bg-[#2E7D32]"
                )}
              >
                <MapPin className="h-3 w-3" />
              </span>
              {expanded && (
                <span className="mt-1 max-w-[88px] truncate rounded-full bg-white px-2 py-0.5 text-[9px] font-bold text-[#111111] shadow-sm ring-1 ring-[#E1E5E1]">
                  {supplier.location.split(",")[0]}
                </span>
              )}
            </span>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-3 flex items-center gap-4">
        <span className="flex items-center gap-1.5 text-[11px] font-medium text-[#666666]">
          <span className="h-2.5 w-2.5 rounded-full bg-[#2E7D32]" aria-hidden="true" />
          Farmer
        </span>
        <span className="flex items-center gap-1.5 text-[11px] font-medium text-[#666666]">
          <span className="h-2.5 w-2.5 rounded-full bg-violet-600" aria-hidden="true" />
          FPO
        </span>
      </div>
    </section>
  );
}

export function FeaturedFPOCard({
  supplier,
  onViewProfile,
}: {
  supplier: BuyerSupplier;
  onViewProfile: (supplier: BuyerSupplier) => void;
}) {
  return (
    <section className="rounded-2xl border border-[#E1E5E1] bg-white p-5 shadow-[0_10px_30px_-18px_rgba(17,17,17,0.12)]">
      <div className="flex items-center justify-between gap-3">
        <h3 className="flex items-center gap-2.5 font-display text-[16px] font-semibold text-[#111111]">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-amber-100 text-amber-700">
            <Star className="h-[18px] w-[18px]" strokeWidth={2} />
          </span>
          Featured FPO
        </h3>
        <span className="text-[12px] font-semibold text-[#2E7D32]">Featured</span>
      </div>

      {/* Banner */}
      <div className="relative mt-4 h-[130px] overflow-hidden rounded-2xl bg-gradient-to-br from-[#2E7D32] to-[#455F28]">
        <div aria-hidden="true" className="absolute inset-0 opacity-25" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.35) 1.2px, transparent 1.6px)", backgroundSize: "18px 18px" }} />
        <span className="absolute top-3 right-3 rounded-full bg-white/95 px-3 py-1 text-[10.5px] font-bold text-violet-700 shadow">
          {TYPE_META.fpo.label}
        </span>
        <div className="absolute bottom-3 left-4 text-white">
          <p className="font-display text-[16px] font-bold">{supplier.name}</p>
          <p className="mt-0.5 text-[11.5px] text-white/85">{supplier.location}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-4 grid grid-cols-2 gap-y-3">
        <div>
          <p className="flex items-center gap-1 text-[11px] font-semibold text-[#111111]">
            <Star className="h-3.5 w-3.5 text-amber-400" fill="currentColor" />
            {supplier.rating.toFixed(1)}
          </p>
          <p className="mt-0.5 text-[10.5px] text-[#777777]">({supplier.deals} deals)</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold text-[#111111]">{supplier.members ?? "Member FPO"}</p>
          <p className="mt-0.5 text-[10.5px] text-[#777777]">farmers</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold text-[#111111]">{supplier.annualProduction}</p>
          <p className="mt-0.5 text-[10.5px] text-[#777777]">Annual Production</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold text-[#111111]">{supplier.mainCrops.join(", ")}</p>
          <p className="mt-0.5 text-[10.5px] text-[#777777]">Main Products</p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onViewProfile(supplier)}
        className="mt-4 inline-flex h-[42px] w-full items-center justify-center rounded-xl bg-[#2E7D32] text-[13px] font-semibold text-white transition-all duration-200 hover:bg-[#256628]"
      >
        View Profile
      </button>
    </section>
  );
}
