import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Sparkles, Star } from "lucide-react";
import { RECOMMENDED_LOTS } from "../data/buyerDashboardData";

/** Recommended farmer lots — table fed by the shared recommendation dataset. */
export default function RecommendedLots({
  query = "",
  onViewLot,
}: {
  query?: string;
  onViewLot?: (crop: string) => void;
}) {
  const q = query.trim().toLowerCase();
  const lots = q
    ? RECOMMENDED_LOTS.filter((l) =>
        [l.crop, l.variety, l.farmer, l.location].some((f) => f.toLowerCase().includes(q))
      )
    : RECOMMENDED_LOTS;

  return (
    <section className="overflow-hidden rounded-2xl border border-[#E1E5E1] bg-white shadow-[0_10px_30px_-18px_rgba(17,17,17,0.12)]">
      <div className="flex items-center justify-between gap-3 p-5 sm:p-6 sm:pb-0">
        <h2 className="flex items-center gap-2.5 font-display text-[16.5px] font-semibold text-[#111111]">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#EAF6EA] text-[#2E7D32]">
            <Sparkles className="h-[18px] w-[18px]" strokeWidth={2} />
          </span>
          Recommended Lots for You
        </h2>
        <Link
          to="/buyer/requirements"
          className="group inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-[#2E7D32] transition-colors hover:text-[#155B32]"
        >
          View All Lots
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={2.5} />
        </Link>
      </div>

      <div className="mt-4 overflow-x-auto px-5 pb-5 sm:px-6 sm:pb-6">
        {lots.length === 0 ? (
          <p className="rounded-xl border border-dashed border-[#D8DED8] bg-[#FAFBFA] px-4 py-8 text-center text-[12.5px] text-[#777777]">
            No lots match &ldquo;{query}&rdquo;.
          </p>
        ) : (
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[#F0F3F0]">
                {["Crop", "Variety", "Quantity", "Price (/quintal)", "Farmer", "Location", "Rating", "Action"].map((head) => (
                  <th key={head} className="pb-2.5 pr-3 text-[10.5px] font-bold tracking-[0.08em] whitespace-nowrap text-[#999999] uppercase">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {lots.map((lot) => (
                <tr key={lot.id} className="border-b border-[#F0F3F0] last:border-0">
                  <td className="py-3.5 pr-3 text-[13px] font-semibold whitespace-nowrap text-[#111111]">{lot.crop}</td>
                  <td className="py-3.5 pr-3 text-[12.5px] text-[#666666]">{lot.variety}</td>
                  <td className="py-3.5 pr-3 text-[12.5px] whitespace-nowrap text-[#444444]">{lot.quantity}</td>
                  <td className="py-3.5 pr-3 font-display text-[13.5px] font-bold whitespace-nowrap text-[#2E7D32]">
                    ₹{lot.pricePerQuintal.toLocaleString("en-IN")}
                  </td>
                  <td className="py-3.5 pr-3 text-[12.5px] whitespace-nowrap text-[#111111]">{lot.farmer}</td>
                  <td className="py-3.5 pr-3">
                    <span className="flex items-center gap-1 text-[12px] whitespace-nowrap text-[#666666]">
                      <MapPin className="h-3 w-3 shrink-0 text-[#2E7D32]" />
                      {lot.location}
                    </span>
                  </td>
                  <td className="py-3.5 pr-3">
                    <span className="flex items-center gap-1 text-[12px] font-semibold text-[#111111]">
                      <Star className="h-3 w-3 text-amber-400" fill="currentColor" />
                      {lot.rating.toFixed(1)}
                    </span>
                  </td>
                  <td className="py-3.5">
                    <button
                      type="button"
                      onClick={() => onViewLot?.(lot.crop)}
                      className="inline-flex h-8 items-center rounded-lg bg-[#2E7D32] px-3.5 text-[11.5px] font-semibold whitespace-nowrap text-white transition-colors hover:bg-[#256628]"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
