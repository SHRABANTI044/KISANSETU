import { useMemo, useState } from "react";
import { ArrowDownWideNarrow, EllipsisVertical, Filter, Sprout } from "lucide-react";
import {
  CROP_TONE,
  PARTNER_TONE,
  PARTNER_TONE_DEFAULT,
  SHIPMENTS,
  SHIPMENT_TABS,
  STATUS_BADGE,
} from "../../data/transportLogisticsData";
import type { Shipment, ShipmentStatus } from "../../data/transportLogisticsData";

type SortKey = "latest" | "oldest" | "id";

/**
 * "Your Shipments" section: status tabs, sorting, filter dropdown,
 * shipment table and per-row three-dot actions.
 */
export default function ShipmentTable({
  activeTab,
  onTabChange,
  onTrack,
  onView,
}: {
  activeTab: string;
  onTabChange: (key: string) => void;
  onTrack: (s: Shipment) => void;
  onView: (s: Shipment) => void;
}) {
  const [sortKey, setSortKey] = useState<SortKey>("latest");
  const [sortOpen, setSortOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [partnerFilter, setPartnerFilter] = useState<string>("All");
  const [menuFor, setMenuFor] = useState<string | null>(null);

  const partners = useMemo(() => ["All", ...Array.from(new Set(SHIPMENTS.map((s) => s.partner)))], []);

  const rows = useMemo(() => {
    let r = SHIPMENTS.filter((s) => activeTab === "all" || s.status === activeTab);
    if (partnerFilter !== "All") r = r.filter((s) => s.partner === partnerFilter);
    const order = ["Pending Pickup", "In Transit", "Delivered", "Cancelled"];
    if (sortKey === "id") r = [...r].sort((a, b) => b.id.localeCompare(a.id));
    if (sortKey === "oldest") r = [...r].reverse();
    if (sortKey === "latest") r = [...r].sort((a, b) => order.indexOf(a.status) - order.indexOf(b.status));
    return r;
  }, [activeTab, sortKey, partnerFilter]);

  return (
    <section className="rounded-2xl border border-[#E4EDE4] bg-white shadow-[0_10px_24px_-16px_rgba(17,17,17,0.18)]">
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 pt-5">
        <h2 className="font-display text-[16px] font-bold text-[#111111]">Your Shipments</h2>
        <div className="flex items-center gap-2">
          {/* Sorting dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setSortOpen((v) => !v);
                setFilterOpen(false);
              }}
              className="inline-flex h-[36px] items-center gap-2 rounded-xl border-[1.5px] border-[#E4EDE4] bg-white px-3 text-[12.5px] font-semibold text-[#3E5B47] hover:border-[#2E7D32]"
            >
              {sortKey === "latest" ? "Latest First" : sortKey === "oldest" ? "Oldest First" : "Shipment ID"}
              <ArrowDownWideNarrow className="h-3.5 w-3.5" strokeWidth={2.2} />
            </button>
            {sortOpen && (
              <div className="absolute right-0 z-20 mt-1.5 w-[160px] overflow-hidden rounded-xl border border-[#E4EDE4] bg-white py-1 shadow-lg">
                {(
                  [
                    { k: "latest", l: "Latest First" },
                    { k: "oldest", l: "Oldest First" },
                    { k: "id", l: "Shipment ID" },
                  ] as { k: SortKey; l: string }[]
                ).map((o) => (
                  <button
                    key={o.k}
                    type="button"
                    onClick={() => {
                      setSortKey(o.k);
                      setSortOpen(false);
                    }}
                    className={`block w-full px-3.5 py-2 text-left text-[12.5px] hover:bg-[#F3FAF3] ${
                      sortKey === o.k ? "font-semibold text-[#2E7D32]" : "text-[#3E5B47]"
                    }`}
                  >
                    {o.l}
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* Filter dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setFilterOpen((v) => !v);
                setSortOpen(false);
              }}
              className={`inline-flex h-[36px] items-center gap-2 rounded-xl border-[1.5px] px-3 text-[12.5px] font-semibold ${
                partnerFilter !== "All" ? "border-[#2E7D32] bg-[#EAF6EA] text-[#2E7D32]" : "border-[#E4EDE4] bg-white text-[#3E5B47] hover:border-[#2E7D32]"
              }`}
            >
              <Filter className="h-3.5 w-3.5" strokeWidth={2.2} />
              Filter
            </button>
            {filterOpen && (
              <div className="absolute right-0 z-20 mt-1.5 w-[180px] overflow-hidden rounded-xl border border-[#E4EDE4] bg-white py-1 shadow-lg">
                <p className="px-3.5 pb-1 pt-2 text-[10.5px] font-bold uppercase tracking-wide text-[#9AA79A]">Transport Partner</p>
                {partners.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => {
                      setPartnerFilter(p);
                      setFilterOpen(false);
                    }}
                    className={`block w-full px-3.5 py-2 text-left text-[12.5px] hover:bg-[#F3FAF3] ${
                      partnerFilter === p ? "font-semibold text-[#2E7D32]" : "text-[#3E5B47]"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Status tabs */}
      <div className="mt-4 flex gap-5 overflow-x-auto border-b border-[#E4EDE4] px-5">
        {SHIPMENT_TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => onTabChange(t.key)}
            className={`relative whitespace-nowrap pb-2.5 pt-1 text-[12.5px] font-semibold transition-colors ${
              activeTab === t.key ? "text-[#2E7D32]" : "text-[#666666] hover:text-[#3E5B47]"
            }`}
          >
            {t.label} ({t.count})
            {activeTab === t.key && <span className="absolute inset-x-0 -bottom-px h-[2.5px] rounded-full bg-[#2E7D32]" />}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto px-2 pb-3">
        <table className="w-full min-w-[980px] border-collapse text-left">
          <thead>
            <tr className="text-[11px] uppercase tracking-wide text-[#9AA79A]">
              {["Shipment ID", "Order ID", "Crop & Quantity", "From", "To", "Transport Partner", "Status", "Expected Delivery", "Action", ""].map((h) => (
                <th key={h} className="whitespace-nowrap px-4 py-3 font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={10} className="px-4 py-10 text-center text-[13px] text-[#666666]">
                  No shipments found for this filter.
                </td>
              </tr>
            )}
            {rows.map((s) => (
              <ShipmentRow key={s.id} s={s} menuFor={menuFor} setMenuFor={setMenuFor} onTrack={onTrack} onView={onView} />
            ))}
          </tbody>
        </table>
      </div>

    </section>
  );
}

/** One table row with status badge, partner icon and three-dot action menu. */
function ShipmentRow({
  s,
  menuFor,
  setMenuFor,
  onTrack,
  onView,
}: {
  s: Shipment;
  menuFor: string | null;
  setMenuFor: (id: string | null) => void;
  onTrack: (s: Shipment) => void;
  onView: (s: Shipment) => void;
}) {
  const tone = PARTNER_TONE[s.partner] ?? PARTNER_TONE_DEFAULT;
  return (
    <tr className="border-t border-[#EFF4EF] transition-colors hover:bg-[#FAFCFA]">
      <td className="whitespace-nowrap px-4 py-3.5 text-[13px] font-bold text-[#111111]">{s.id}</td>
      <td className="whitespace-nowrap px-4 py-3.5 text-[13px] text-[#3E5B47]">{s.orderId}</td>
      <td className="whitespace-nowrap px-4 py-3.5">
        <div className="flex items-center gap-2.5">
          <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${CROP_TONE[s.crop] ?? "bg-[#EAF6EA] text-[#2E7D32]"}`}>
            <Sprout className="h-4 w-4" strokeWidth={2} />
          </span>
          <div>
            <p className="text-[13px] font-semibold text-[#111111]">{s.crop}</p>
            <p className="text-[11px] text-[#666666]">{s.quantity}</p>
          </div>
        </div>
      </td>
      <td className="whitespace-nowrap px-4 py-3.5 text-[12.5px] text-[#3E5B47]">{s.from}</td>
      <td className="whitespace-nowrap px-4 py-3.5 text-[12.5px] text-[#3E5B47]">{s.to}</td>
      <td className="whitespace-nowrap px-4 py-3.5">
        <div className="flex items-center gap-2">
          <span className={`grid h-7 w-7 place-items-center rounded-lg ${tone.cls}`}>
            <tone.icon className="h-4 w-4" strokeWidth={2} />
          </span>
          <span className="text-[12.5px] font-medium text-[#111111]">{s.partner}</span>
        </div>
      </td>
      <td className="whitespace-nowrap px-4 py-3.5">
        <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${STATUS_BADGE[s.status as ShipmentStatus]}`}>
          {s.status}
        </span>
      </td>
      <td className="whitespace-nowrap px-4 py-3.5 text-[12.5px] text-[#3E5B47]">{s.expectedDelivery}</td>
      <td className="whitespace-nowrap px-4 py-3.5">
        <button
          type="button"
          onClick={() => (s.action === "Track" ? onTrack(s) : onView(s))}
          className="inline-flex h-[30px] items-center rounded-lg border-[1.5px] border-[#2E7D32] px-3 text-[11.5px] font-semibold text-[#2E7D32] transition-colors hover:bg-[#2E7D32] hover:text-white"
        >
          {s.action}
        </button>
      </td>
      <td className="relative px-2 py-3.5">
        <button
          type="button"
          aria-label={`More actions for ${s.id}`}
          onClick={() => setMenuFor(menuFor === s.id ? null : s.id)}
          className="grid h-8 w-8 place-items-center rounded-lg text-[#666666] hover:bg-[#F3FAF3] hover:text-[#2E7D32]"
        >
          <EllipsisVertical className="h-4 w-4" strokeWidth={2.2} />
        </button>
        {menuFor === s.id && (
          <div className="absolute right-2 z-20 mt-1 w-[160px] overflow-hidden rounded-xl border border-[#E4EDE4] bg-white py-1 shadow-lg">
            {[
              { l: "Track shipment", fn: () => onTrack(s) },
              { l: "View details", fn: () => onView(s) },
              { l: "Download invoice", fn: () => {} },
              { l: "Contact partner", fn: () => {} },
            ].map((m) => (
              <button
                key={m.l}
                type="button"
                onClick={() => {
                  m.fn();
                  setMenuFor(null);
                }}
                className="block w-full px-3.5 py-2 text-left text-[12.5px] text-[#3E5B47] hover:bg-[#F3FAF3]"
              >
                {m.l}
              </button>
            ))}
          </div>
        )}
      </td>
    </tr>
  );
}
