import { useEffect, useRef, useState } from "react";
import { Plus, Star, Truck, X } from "lucide-react";
import BuyerDashboardLayout from "../layouts/BuyerDashboardLayout";
import ShipmentSummaryCards from "../components/transport/ShipmentSummaryCards";
import ShipmentTable from "../components/transport/ShipmentTable";
import BookingTransport from "../components/transport/BookingTransport";
import LogisticsPartners from "../components/transport/LogisticsPartners";
import LiveTracking from "../components/transport/LiveTracking";
import RouteMap from "../components/transport/RouteMap";
import TransportInfoCards from "../components/transport/TransportInfoCards";
import { TRACKED_SHIPMENT } from "../data/transportLogisticsData";
import type { Shipment, TransportPartner } from "../data/transportLogisticsData";

/**
 * /buyer/transport-logistics — Buyer Transport & Logistics.
 * Book transport, browse partners and track shipments (frontend mock data).
 */
export default function TransportLogistics() {
  const [activeTab, setActiveTab] = useState("all");
  const [tracked, setTracked] = useState(TRACKED_SHIPMENT);
  const [details, setDetails] = useState<Shipment | null>(null);
  const [partner, setPartner] = useState<TransportPartner | null>(null);
  const [mapOpen, setMapOpen] = useState(false);
  const trackingRef = useRef<HTMLDivElement>(null);
  const bookingRef = useRef<HTMLDivElement>(null);

  const track = (s: Shipment) => {
    setTracked(s);
    requestAnimationFrame(() => trackingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  const scrollToBooking = () =>
    requestAnimationFrame(() => bookingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDetails(null);
        setPartner(null);
        setMapOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <BuyerDashboardLayout>
      <div className="mx-auto w-full max-w-[1240px]">
        {/* Page header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#EAF6EA] text-[#2E7D32]">
              <Truck className="h-6 w-6" strokeWidth={2} />
            </span>
            <div>
              <h1 className="font-display text-[24px] font-bold tracking-[-0.01em] text-[#111111] sm:text-[28px]">Transport & Logistics</h1>
              <p className="mt-1 max-w-xl text-[13.5px] leading-relaxed text-[#666666]">
                Book, manage, and track transportation for your orders. Get reliable and cost-effective logistics support from verified
                partners.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={scrollToBooking}
            className="inline-flex h-[46px] items-center gap-2 rounded-xl bg-[#2E7D32] px-5 text-[14px] font-semibold text-white shadow-[0_12px_24px_-10px_rgba(46,125,50,0.55)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#256628]"
          >
            <Plus className="h-4 w-4" strokeWidth={2.6} />
            Book Transport
          </button>
        </div>

        {/* Summary cards */}
        <div className="mt-6">
          <ShipmentSummaryCards />
        </div>

        {/* Main two-column area */}
        <div className="mt-6 grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="min-w-0 space-y-6">
            <ShipmentTable activeTab={activeTab} onTabChange={setActiveTab} onTrack={track} onView={setDetails} />

            <div ref={trackingRef} className="scroll-mt-24">
              <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
                <LiveTracking shipment={tracked} />
                <div className="rounded-2xl border border-[#E4EDE4] bg-white p-5 shadow-[0_10px_24px_-16px_rgba(17,17,17,0.18)]">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-[15px] font-bold text-[#111111]">Route Map</h3>
                    <button
                      type="button"
                      onClick={() => setMapOpen(true)}
                      className="text-[12px] font-semibold text-[#2E7D32] hover:underline"
                    >
                      View Full Map →
                    </button>
                  </div>
                  <div className="mt-3">
                    <RouteMap />
                  </div>
                  <p className="mt-3 text-[11.5px] text-[#666666]">
                    Route: {tracked.from.split(",")[0]} → Bardhaman → Hooghly → {tracked.to.split(",")[0]}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div ref={bookingRef} className="space-y-6 scroll-mt-24">
            <BookingTransport />
            <LogisticsPartners onViewProfile={setPartner} />
          </div>
        </div>

        <div className="mt-6">
          <TransportInfoCards />
        </div>
      </div>
      {/* Shipment details modal */}
      {details && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px]" onClick={() => setDetails(null)} aria-hidden="true" />
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E4EDE4] px-5 py-4">
              <h3 className="font-display text-[16px] font-bold text-[#111111]">Shipment Details</h3>
              <button type="button" onClick={() => setDetails(null)} aria-label="Close" className="grid h-8 w-8 place-items-center rounded-lg hover:bg-[#F3FAF3]">
                <X className="h-4 w-4" strokeWidth={2.4} />
              </button>
            </div>
            <dl className="divide-y divide-[#EFF4EF] px-5 py-2 text-[13px]">
              {[
                ["Shipment ID", details.id],
                ["Order ID", details.orderId],
                ["Crop & Quantity", `${details.crop} — ${details.quantity}`],
                ["Route", `${details.from} → ${details.to}`],
                ["Transport Partner", details.partner],
                ["Status", details.status],
                ["Expected Delivery", details.expectedDelivery],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between gap-4 py-2.5">
                  <dt className="text-[#666666]">{k}</dt>
                  <dd className="text-right font-semibold text-[#111111]">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="flex gap-3 px-5 pb-5 pt-1">
              <button
                type="button"
                onClick={() => {
                  track(details);
                  setDetails(null);
                }}
                className="inline-flex h-[42px] flex-1 items-center justify-center rounded-xl bg-[#2E7D32] text-[13px] font-semibold text-white hover:bg-[#256628]"
              >
                Track Shipment
              </button>
              <button
                type="button"
                onClick={() => setDetails(null)}
                className="inline-flex h-[42px] flex-1 items-center justify-center rounded-xl border-[1.5px] border-[#E4EDE4] text-[13px] font-semibold text-[#3E5B47] hover:border-[#2E7D32]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Partner profile modal */}
      {partner && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px]" onClick={() => setPartner(null)} aria-hidden="true" />
          <div className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E4EDE4] px-5 py-4">
              <h3 className="font-display text-[16px] font-bold text-[#111111]">Transporter Profile</h3>
              <button type="button" onClick={() => setPartner(null)} aria-label="Close" className="grid h-8 w-8 place-items-center rounded-lg hover:bg-[#F3FAF3]">
                <X className="h-4 w-4" strokeWidth={2.4} />
              </button>
            </div>
            <div className="px-5 py-5">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#EAF6EA] text-[#2E7D32]">
                  <Truck className="h-6 w-6" strokeWidth={2} />
                </span>
                <div>
                  <p className="text-[15px] font-bold text-[#111111]">{partner.name}</p>
                  <p className="inline-flex items-center gap-1 text-[12px] text-[#666666]">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" strokeWidth={0} />
                    {partner.rating} · {partner.trips} trips
                  </p>
                </div>
              </div>
              <p className="mt-3 text-[12.5px] text-[#3E5B47]">{partner.details}</p>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                {[["On-time", "96%"], ["Claims", "<1%"], ["Fleet", "120+"]].map(([k, v]) => (
                  <div key={k} className="rounded-xl bg-[#F7FAF7] px-2 py-2.5">
                    <p className="text-[14px] font-bold text-[#2E7D32]">{v}</p>
                    <p className="text-[10.5px] text-[#666666]">{k}</p>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={scrollToBooking}
                className="mt-4 inline-flex h-[42px] w-full items-center justify-center rounded-xl bg-[#2E7D32] text-[13px] font-semibold text-white hover:bg-[#256628]"
              >
                Book with {partner.name}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full map modal */}
      {mapOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px]" onClick={() => setMapOpen(false)} aria-hidden="true" />
          <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-4">
              <h3 className="font-display text-[16px] font-bold text-[#111111]">Route Map — {tracked.id}</h3>
              <button type="button" onClick={() => setMapOpen(false)} aria-label="Close" className="grid h-8 w-8 place-items-center rounded-lg hover:bg-[#F3FAF3]">
                <X className="h-4 w-4" strokeWidth={2.4} />
              </button>
            </div>
            <RouteMap large onClose={() => setMapOpen(false)} />
            <p className="mt-3 text-[12px] text-[#666666]">
              Pickup: {tracked.from} · Destination: {tracked.to} · ETA: {tracked.expectedDelivery}
            </p>
          </div>
        </div>
      )}


    </BuyerDashboardLayout>
  );
}
