import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Star } from "lucide-react";
import { TOP_SUPPLIERS } from "../data/buyerDashboardData";
import { cn } from "../../utils/cn";

export default function TopSuppliers({ onViewProfile }: { onViewProfile?: (name: string) => void }) {
  return (
    <section className="flex flex-col rounded-2xl border border-[#E1E5E1] bg-white p-5 shadow-[0_10px_30px_-18px_rgba(17,17,17,0.12)] sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-[16.5px] font-semibold text-[#111111]">Top Suppliers</h2>
        <Link
          to="/buyer/farmers"
          className="group inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-[#2E7D32] transition-colors hover:text-[#155B32]"
        >
          View All Suppliers
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={2.5} />
        </Link>
      </div>

      <ul className="mt-5 flex flex-col gap-4">
        {TOP_SUPPLIERS.map((supplier) => (
          <li key={supplier.id} className="flex flex-col gap-3 border-b border-[#F0F3F0] pb-4 last:border-0 last:pb-0">
            <div className="flex items-start gap-3">
              <span className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-full font-display text-[12.5px] font-bold", supplier.tone)}>
                {supplier.initials}
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-[13.5px] font-semibold text-[#111111]">{supplier.name}</h3>
                <p className="mt-0.5 flex items-center gap-1 text-[11.5px] text-[#777777]">
                  <MapPin className="h-3 w-3 text-[#2E7D32]" />
                  {supplier.location}
                </p>
                <p className="mt-0.5 flex items-center gap-2 text-[11px] text-[#777777]">
                  <span className="flex items-center gap-1 font-semibold text-[#111111]">
                    <Star className="h-3 w-3 text-amber-400" fill="currentColor" />
                    {supplier.rating.toFixed(1)}
                  </span>
                  · {supplier.deals} deals
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onViewProfile?.(supplier.name)}
              className="inline-flex h-9 w-full items-center justify-center rounded-lg border-[1.5px] border-[#2E7D32] text-[12px] font-semibold text-[#2E7D32] transition-colors duration-200 hover:bg-[#2E7D32] hover:text-white"
            >
              View Profile
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
