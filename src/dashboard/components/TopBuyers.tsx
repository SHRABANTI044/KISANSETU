import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Star } from "lucide-react";
import { TOP_BUYERS } from "../data/farmerDashboardData";

export default function TopBuyers() {
  return (
    <section className="rounded-2xl border border-[#E1E5E1] bg-white p-5 shadow-[0_10px_30px_-18px_rgba(17,17,17,0.12)] sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-[16.5px] font-semibold text-[#111111]">
          Top Buyers for Your Lots
        </h2>
        <Link
          to="/dashboard/offers"
          className="group inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-[#2E7D32] transition-colors hover:text-[#155B32]"
        >
          View All Buyers
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={2.5} />
        </Link>
      </div>

      <div className="mt-5 flex flex-col gap-3.5">
        {TOP_BUYERS.map((buyer) => (
          <article
            key={buyer.id}
            className="flex flex-col rounded-2xl border border-[#E1E5E1] bg-[#F7FAF7] p-4 transition-all duration-200 hover:border-[#2E7D32]/35 hover:bg-[#EAF6EA]/40"
          >
            <div className="flex items-start gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#EAF6EA] font-display text-[12.5px] font-bold text-[#2E7D32] ring-1 ring-[#2E7D32]/15">
                {buyer.initials}
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-[13.5px] font-semibold text-[#111111]">{buyer.name}</h3>
                <p className="mt-0.5 flex items-center gap-1 text-[11.5px] text-[#777777]">
                  <MapPin className="h-3 w-3 text-[#2E7D32]" />
                  {buyer.location}
                </p>
              </div>
              <span className="flex shrink-0 items-center gap-1 rounded-full bg-white px-2 py-1 text-[11.5px] font-bold text-[#111111] ring-1 ring-[#E1E5E1]">
                <Star className="h-3 w-3 text-amber-400" fill="currentColor" />
                {buyer.rating.toFixed(1)}
              </span>
            </div>
            <Link
              to={`/deals-offers?buyer=${buyer.id}`}
              className="mt-4 inline-flex h-9 w-full items-center justify-center rounded-lg border-[1.5px] border-[#2E7D32] text-[12px] font-semibold text-[#2E7D32] transition-colors duration-200 hover:bg-[#2E7D32] hover:text-white"
            >
              View Profile
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
