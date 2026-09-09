import { TRANSPORT_SUMMARY } from "../../data/transportLogisticsData";

/** Four summary cards (Active / Delivered / Pending / Avg. cost). */
export default function ShipmentSummaryCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {TRANSPORT_SUMMARY.map((s) => (
        <div
          key={s.id}
          className="rounded-2xl border border-[#E4EDE4] bg-white p-4 shadow-[0_10px_24px_-16px_rgba(17,17,17,0.18)]"
        >
          <div className="flex items-center justify-between">
            <p className="text-[12px] font-semibold uppercase tracking-wide text-[#666666]">{s.label}</p>
            <span className={`grid h-9 w-9 place-items-center rounded-full ${s.tone}`}>
              <s.icon className="h-[18px] w-[18px]" strokeWidth={2} />
            </span>
          </div>
          <div className="mt-2 flex items-end gap-1">
            <p className="font-display text-[28px] font-bold leading-none text-[#111111]">{s.value}</p>
            {"unit" in s && s.unit ? <span className="pb-0.5 text-[12px] font-medium text-[#666666]">{s.unit}</span> : null}
          </div>
          <p className="mt-2 text-[12px] font-medium text-[#3E5B47]">{s.supporting}</p>
        </div>
      ))}
    </div>
  );
}
