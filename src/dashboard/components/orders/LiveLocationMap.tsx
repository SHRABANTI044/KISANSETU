import { useState } from "react";
import { MapPin, Truck } from "lucide-react";
import type { OrderLiveLocation } from "../../data/orders";

/**
 * Stylised live-location preview — a clean map-style UI that can later be
 * swapped for a real map/tracking API without changing its API surface.
 */
export default function LiveLocationMap({ location, statusLabel }: { location: OrderLiveLocation; statusLabel: string }) {
  const [minimised, setMinimised] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-display text-[15px] font-semibold text-[#111111]">Live Location</h3>
        <button
          type="button"
          onClick={() => setMinimised((v) => !v)}
          className="text-[11.5px] font-semibold text-[#2E7D32] transition-colors hover:text-[#155B32]"
        >
          View on Map
        </button>
      </div>

      {!minimised && (
        <div className="relative mt-3 h-[176px] overflow-hidden rounded-2xl border border-[#E1E5E1] bg-[#F0FAF1]">
          {/* dotted terrain */}
          <div
            className="absolute inset-0 opacity-60"
            aria-hidden="true"
            style={{ backgroundImage: "radial-gradient(rgba(46,125,50,0.16) 1.2px, transparent 1.7px)", backgroundSize: "16px 16px" }}
          />
          {/* route */}
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 176" fill="none" aria-hidden="true">
            <path
              d="M56 130 C 120 40, 240 150, 344 62"
              stroke="#2E7D32"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="2 8"
            />
          </svg>

          {/* start pin */}
          <span className="absolute flex flex-col items-center" style={{ left: "10%", top: "66%" }}>
            <span className="grid h-7 w-7 place-items-center rounded-full bg-[#155B32] text-white shadow ring-4 ring-white/70">
              <MapPin className="h-3.5 w-3.5" />
            </span>
            <span className="mt-1 rounded-full bg-white px-2 py-0.5 text-[9.5px] font-bold text-[#155B32] shadow-sm ring-1 ring-[#E1E5E1]">
              {location.from}
            </span>
          </span>

          {/* truck */}
          <span className="absolute" style={{ left: "46%", top: "42%" }}>
            <span className="grid h-9 w-9 place-items-center rounded-full bg-white text-[#2E7D32] shadow-[0_10px_22px_-8px_rgba(46,125,50,0.5)] ring-2 ring-[#2E7D32]">
              <Truck className="h-[18px] w-[18px]" strokeWidth={2} />
            </span>
          </span>

          {/* destination pin */}
          <span className="absolute flex flex-col items-center" style={{ left: "82%", top: "26%" }}>
            <span className="grid h-7 w-7 place-items-center rounded-full bg-[#E8862D] text-white shadow ring-4 ring-white/70">
              <MapPin className="h-3.5 w-3.5" />
            </span>
            <span className="mt-1 rounded-full bg-white px-2 py-0.5 text-[9.5px] font-bold text-[#155B32] shadow-sm ring-1 ring-[#E1E5E1]">
              {location.to}
            </span>
          </span>

          {/* info card */}
          <div className="absolute bottom-3 left-3 rounded-xl border border-[#E1E5E1] bg-white/95 px-3.5 py-2.5 shadow-[0_10px_26px_-12px_rgba(17,17,17,0.3)] backdrop-blur-sm">
            <p className="text-[10px] font-bold tracking-wide text-sky-700 uppercase">{statusLabel}</p>
            <p className="mt-0.5 text-[11.5px] font-bold text-[#111111]">{location.near}</p>
            <p className="text-[10.5px] font-medium text-[#777777]">ETA: {location.eta}</p>
          </div>
        </div>
      )}
    </div>
  );
}
