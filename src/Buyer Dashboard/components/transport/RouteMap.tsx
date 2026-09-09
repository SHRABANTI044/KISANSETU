import { MapPin, Navigation, Truck, X } from "lucide-react";

const ROUTE = ["Burdwan", "Bardhaman", "Hooghly", "Kolkata"];

/**
 * Frontend map-style visual (no API key required). Renders a stylised route
 * Burdwan → Bardhaman → Hooghly → Kolkata with pickup/destination markers,
 * truck marker on route and an "In Transit" popup. Replace the inner visual
 * with Leaflet/Mapbox later — props/modal API stays the same.
 */
export default function RouteMap({ large = false, onClose }: { large?: boolean; onClose?: () => void }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl border border-[#E4EDE4] bg-[#EEF5EC] ${large ? "h-[420px]" : "h-[240px]"}`}>
      {/* Faux terrain blocks */}
      <div className="absolute inset-0">
        <div className="absolute left-[-40px] top-[-30px] h-[130px] w-[220px] rotate-6 rounded-[40px] bg-[#E2EEE0]" />
        <div className="absolute bottom-[-50px] right-[-30px] h-[160px] w-[260px] -rotate-6 rounded-[40px] bg-[#E6F0E2]" />
        <div className="absolute left-[30%] top-[55%] h-[70px] w-[140px] rotate-3 rounded-[30px] bg-[#E2EEE0]" />
        {/* River */}
        <div className="absolute right-[12%] top-[18%] h-[140%] w-[26px] rotate-[24deg] rounded-full bg-[#CFE3F5]" />
      </div>

      {/* Route polyline */}
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 240" preserveAspectRatio="none">
        <polyline
          points="40,190 130,150 220,120 330,60"
          fill="none"
          stroke="#2E7D32"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="1 8"
        />
      </svg>

      {/* Truck along route */}
      <div className="absolute left-[46%] top-[47%] grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#2E7D32] text-white shadow-lg">
        <Truck className="h-4.5 w-4.5" strokeWidth={2.2} />
      </div>
      {/* In Transit popup */}
      <div className="absolute left-[46%] top-[30%] -translate-x-1/2 rounded-lg bg-white px-2.5 py-1.5 text-[11px] font-bold text-[#2E7D32] shadow-md">
        In Transit
        <span className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-white" />
      </div>

      {/* Pickup marker */}
      <div className="absolute bottom-[16%] left-[8%] flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-[#2E7D32] text-white shadow-md ring-4 ring-white">
          <Navigation className="h-4 w-4" strokeWidth={2.2} />
        </span>
        <div className="rounded-lg bg-white px-2.5 py-1 text-[11px] font-bold text-[#111111] shadow-md">
          Burdwan <span className="font-medium text-[#666666]">(Pickup)</span>
        </div>
      </div>

      {/* Destination marker */}
      <div className="absolute right-[6%] top-[12%] flex flex-col items-center">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-[#D93025] text-white shadow-md ring-4 ring-white">
          <MapPin className="h-4 w-4" strokeWidth={2.2} />
        </span>
        <div className="mt-1 rounded-lg bg-white px-2.5 py-1 text-[11px] font-bold text-[#111111] shadow-md">
          Kolkata <span className="font-medium text-[#666666]">(Delivery)</span>
        </div>
      </div>

      {/* Waypoint chips */}
      <div className="absolute inset-x-0 bottom-2 flex flex-wrap justify-center gap-1.5 px-3">
        {ROUTE.map((r, i) => (
          <span key={r} className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-[10.5px] font-semibold text-[#3E5B47] shadow-sm">
            <span className={`h-1.5 w-1.5 rounded-full ${i === 0 ? "bg-[#2E7D32]" : i === ROUTE.length - 1 ? "bg-[#D93025]" : "bg-[#9AA79A]"}`} />
            {r}
          </span>
        ))}
      </div>

      {large && onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close map"
          className="absolute right-3 top-3 z-10 grid h-8 w-8 place-items-center rounded-full bg-white text-[#111111] shadow-md hover:bg-[#F3FAF3]"
        >
          <X className="h-4 w-4" strokeWidth={2.4} />
        </button>
      )}
    </div>
  );
}
