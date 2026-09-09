import { Link } from "react-router-dom";
import { ArrowRight, Leaf, ShieldCheck, Star, Truck } from "lucide-react";
import { LOGISTICS_PARTNERS, PARTNER_TONE, PARTNER_TONE_DEFAULT } from "../../data/transportLogisticsData";
import type { TransportPartner } from "../../data/transportLogisticsData";

/** Right-side "Our Logistics Partners" card with View Profile buttons. */
export default function LogisticsPartners({ onViewProfile }: { onViewProfile: (p: TransportPartner) => void }) {
  return (
    <div className="rounded-2xl border border-[#E4EDE4] bg-white p-5 shadow-[0_10px_24px_-16px_rgba(17,17,17,0.18)]">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-[15px] font-bold text-[#111111]">Our Logistics Partners</h3>
        <button
          type="button"
          onClick={() => onViewProfile(LOGISTICS_PARTNERS[0])}
          className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#2E7D32] hover:underline"
        >
          View All <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.4} />
        </button>
      </div>

      <div className="mt-4 space-y-3">
        {LOGISTICS_PARTNERS.map((p) => {
          const tone = PARTNER_TONE[p.name] ?? PARTNER_TONE_DEFAULT;
          return (
            <div key={p.name} className="rounded-xl border border-[#E4EDE4] bg-[#FBFDFB] p-3.5">
              <div className="flex items-start gap-3">
                <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${tone.cls}`}>
                  {p.name === "EcoFreight" ? <Leaf className="h-5 w-5" strokeWidth={2} /> : <Truck className="h-5 w-5" strokeWidth={2} />}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-[13.5px] font-bold text-[#111111]">{p.name}</p>
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#EAF6EA] px-2 py-0.5 text-[11px] font-semibold text-[#2E7D32]">
                      <Star className="h-3 w-3 fill-[#2E7D32]" strokeWidth={0} /> {p.rating}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[11.5px] text-[#666666]">({p.trips} trips)</p>
                  <p className="mt-1.5 text-[11.5px] leading-relaxed text-[#3E5B47]">{p.details}</p>
                  <div className="mt-2.5 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onViewProfile(p)}
                      className="inline-flex h-[32px] items-center rounded-lg border-[1.5px] border-[#2E7D32] px-3 text-[11.5px] font-semibold text-[#2E7D32] transition-colors hover:bg-[#2E7D32] hover:text-white"
                    >
                      View Profile
                    </button>
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#2E7D32]">
                      <ShieldCheck className="h-3.5 w-3.5" strokeWidth={2.2} /> Verified
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Link
        to="/buyer/help-support"
        className="mt-4 block text-center text-[12px] font-semibold text-[#2E7D32] hover:underline"
      >
        Need a custom logistics solution? Contact us →
      </Link>
    </div>
  );
}
