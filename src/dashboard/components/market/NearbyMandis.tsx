import { useEffect, useState } from "react";
import { ChevronRight, Map, MapPin, TrendingUp, X } from "lucide-react";
import type { MandiRow } from "../../data/marketPrices";

function MapPreviewModal({ mandis, onClose }: { mandis: MandiRow[]; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/45 p-5 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-label="Nearby mandis map preview"
      onClick={onClose}
    >
      <div
        className="animate-pop-in w-full max-w-[520px] rounded-3xl bg-white p-6 shadow-2xl sm:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-[18px] font-bold text-[#111111]">Nearby Mandis</h2>
            <p className="mt-1 text-[12.5px] text-[#666666]">
              Map preview placeholder — live map integration comes with the backend.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close map preview"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[#E1E5E1] text-[#666666] transition-colors hover:bg-[#EAF6EA] hover:text-[#2E7D32]"
          >
            <X className="h-[18px] w-[18px]" />
          </button>
        </div>

        {/* Stylised mini map */}
        <div className="relative mt-5 h-[190px] overflow-hidden rounded-2xl border border-[#E1E5E1] bg-[#F0FAF1]">
          <div className="absolute inset-0 opacity-60" style={{ backgroundImage: "radial-gradient(rgba(46,125,50,0.18) 1.2px, transparent 1.6px)", backgroundSize: "18px 18px" }} aria-hidden="true" />
          {mandis.map((m, i) => (
            <span
              key={m.market}
              className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
              style={{ left: `${16 + ((i * 23) % 68)}%`, top: `${22 + ((i * 31) % 56)}%` }}
            >
              <span className="grid h-8 w-8 place-items-center rounded-full bg-[#2E7D32] text-white shadow-[0_8px_18px_-6px_rgba(46,125,50,0.6)] ring-4 ring-white/70">
                <MapPin className="h-4 w-4" />
              </span>
              <span className="mt-1 rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-[#155B32] shadow-sm ring-1 ring-[#E1E5E1]">
                {m.market}
              </span>
            </span>
          ))}
        </div>

        <ul className="mt-4 flex flex-col gap-2">
          {mandis.map((m) => (
            <li key={m.market} className="flex items-center justify-between gap-3 rounded-xl border border-[#E1E5E1] px-3.5 py-2.5 text-[12.5px]">
              <span className="flex items-center gap-2 font-semibold text-[#111111]">
                <MapPin className="h-3.5 w-3.5 text-[#2E7D32]" />
                {m.market}
              </span>
              <span className="font-semibold text-[#2E7D32]">₹{m.avg.toFixed(2)}/kg</span>
              <span className="text-[#888888]">{m.distance}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function NearbyMandis({
  mandis,
  onViewDetails,
}: {
  mandis: MandiRow[];
  onViewDetails: (row: MandiRow) => void;
}) {
  const [mapOpen, setMapOpen] = useState(false);

  return (
    <section className="rounded-2xl border border-[#E1E5E1] bg-white p-5 shadow-[0_10px_30px_-18px_rgba(17,17,17,0.12)] sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2.5 font-display text-[16.5px] font-semibold text-[#111111]">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#EAF6EA] text-[#2E7D32]">
            <MapPin className="h-[18px] w-[18px]" strokeWidth={2} />
          </span>
          Prices in Nearby Mandis
        </h2>
        <button
          type="button"
          onClick={() => setMapOpen(true)}
          className="inline-flex h-[38px] items-center gap-2 rounded-xl border-[1.5px] border-[#2E7D32] bg-white px-4 text-[12.5px] font-semibold text-[#2E7D32] transition-colors hover:bg-[#EAF6EA]"
        >
          <Map className="h-4 w-4" strokeWidth={2} />
          View on Map
        </button>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-left">
          <thead>
            <tr className="border-b border-[#E1E5E1]">
              {["Market / Mandi", "Location", "Min Price (₹/kg)", "Max Price (₹/kg)", "Avg Price (₹/kg)", "Change (vs last week)", "Distance", ""].map((head) => (
                <th key={head} className="pb-2.5 pr-3 text-[10.5px] font-bold tracking-[0.08em] whitespace-nowrap text-[#999999] uppercase">
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mandis.map((row) => (
              <tr key={row.market} className="border-b border-[#F0F3F0] last:border-0">
                <td className="py-3.5 pr-3 text-[13px] font-semibold whitespace-nowrap text-[#111111]">{row.market}</td>
                <td className="py-3.5 pr-3 text-[12.5px] text-[#666666]">{row.location}</td>
                <td className="py-3.5 pr-3 text-[12.5px] font-medium text-[#444444]">{row.min.toFixed(2)}</td>
                <td className="py-3.5 pr-3 text-[12.5px] font-medium text-[#444444]">{row.max.toFixed(2)}</td>
                <td className="py-3.5 pr-3 text-[13px] font-bold whitespace-nowrap text-[#2E7D32]">{row.avg.toFixed(2)}</td>
                <td className="py-3.5 pr-3">
                  <span className="inline-flex items-center gap-1 text-[12px] font-bold text-[#2E7D32]">
                    <TrendingUp className="h-3.5 w-3.5" strokeWidth={2.4} />
                    +{row.change}%
                  </span>
                </td>
                <td className="py-3.5 pr-3 text-[12.5px] whitespace-nowrap text-[#666666]">{row.distance}</td>
                <td className="py-3.5">
                  <button
                    type="button"
                    onClick={() => onViewDetails(row)}
                    className="inline-flex items-center gap-0.5 text-[12px] font-semibold whitespace-nowrap text-[#2E7D32] transition-colors hover:text-[#155B32]"
                  >
                    View Details
                    <ChevronRight className="h-3.5 w-3.5" strokeWidth={2.4} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {mapOpen && <MapPreviewModal mandis={mandis} onClose={() => setMapOpen(false)} />}
    </section>
  );
}
