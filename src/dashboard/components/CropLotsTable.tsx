import { Link } from "react-router-dom";
import { ArrowRight, EllipsisVertical } from "lucide-react";
import { CROP_LOTS } from "../data/farmerDashboardData";
import { cn } from "../../utils/cn";

function StatusBadge({ status }: { status: "Live" | "Negotiation" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold",
        status === "Live"
          ? "bg-[#EAF6EA] text-[#2E7D32]"
          : "border border-amber-200 bg-amber-50 text-amber-700"
      )}
    >
      {status}
    </span>
  );
}

export default function CropLotsTable({ crops }: { crops?: any[] }) {
  // If real crops are fetched from farmer_crops, display them:
  const displayLots =
    crops && crops.length > 0
      ? crops.map((c, i) => {
          const isLive =
            c.status?.toLowerCase() === "live" || c.list_for_sale === true;
          const statusVal: "Live" | "Negotiation" = isLive
            ? "Live"
            : "Negotiation";
          return {
            id: c.id || `crop-${i}`,
            name: c.crop_name || c.crop || "Unnamed Crop",
            lotId: c.id
              ? `CL${c.id.toString().slice(-4).toUpperCase()}`
              : `CL100${i + 1}`,
            quantity: c.quantity
              ? `${c.quantity} ${c.unit || "Quintal"}`
              : "Not specified",
            quality: c.grade ? `Grade ${c.grade}` : "Standard",
            status: statusVal,
            interestedBuyers: 0,
            initials: (c.crop_name || c.crop || "CR")
              .slice(0, 2)
              .toUpperCase(),
            tone: isLive
              ? "bg-emerald-100 text-emerald-700"
              : "bg-amber-100 text-amber-700",
          };
        })
      : CROP_LOTS;

  return (
    <section className="rounded-2xl border border-[#E1E5E1] bg-white p-5 shadow-[0_10px_30px_-18px_rgba(17,17,17,0.12)] sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-[16.5px] font-semibold text-[#111111]">Your Crop Lots</h2>
        <Link
          to="/dashboard/crop-lots"
          className="group inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-[#2E7D32] transition-colors hover:text-[#155B32]"
        >
          View All Lots
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={2.5} />
        </Link>
      </div>

      {/* Table head (desktop) */}
      <div className="mt-5 hidden grid-cols-[2.1fr_1.1fr_0.9fr_0.9fr_44px] gap-3 border-b border-[#F0F3F0] pb-2.5 lg:grid">
        {["Crop Lot", "Quantity", "Status", "Buyers", ""].map((head) => (
          <p key={head} className="text-[10.5px] font-bold tracking-[0.1em] text-[#999999] uppercase">
            {head}
          </p>
        ))}
      </div>

      <ul>
        {displayLots.map((lot) => (
          <li
            key={lot.id}
            className="grid grid-cols-[auto_1fr_auto] items-center gap-3 border-b border-[#F0F3F0] py-3.5 last:border-0 last:pb-0 lg:grid-cols-[2.1fr_1.1fr_0.9fr_0.9fr_44px]"
          >
            {/* Crop identity */}
            <div className="col-span-2 flex min-w-0 items-center gap-3 lg:col-span-1">
              <span
                className={cn(
                  "grid h-10 w-10 shrink-0 place-items-center rounded-xl text-[11px] font-bold",
                  lot.tone
                )}
              >
                {lot.initials}
              </span>
              <div className="min-w-0">
                <p className="truncate text-[13.5px] font-semibold text-[#111111]">{lot.name}</p>
                <p className="mt-0.5 text-[11px] text-[#999999]">
                  Lot ID: {lot.lotId} · Quality: {lot.quality}
                </p>
              </div>
            </div>

            {/* Quantity */}
            <p className="hidden text-[12.5px] font-medium text-[#444444] lg:block">{lot.quantity}</p>

            {/* Status */}
            <div>
              <StatusBadge status={lot.status} />
            </div>

            {/* Interested buyers */}
            <p className="hidden text-[12.5px] font-medium text-[#444444] lg:block">
              {lot.interestedBuyers} interested
            </p>

            {/* Actions */}
            <button
              type="button"
              aria-label={`Actions for ${lot.name}`}
              className="grid h-8 w-8 place-items-center justify-self-end rounded-lg text-[#999999] transition-colors hover:bg-[#EAF6EA] hover:text-[#2E7D32]"
            >
              <EllipsisVertical className="h-[18px] w-[18px]" strokeWidth={2} />
            </button>
          </li>
        ))}
      </ul>


      <p className="mt-3 text-[11px] text-[#999999] lg:hidden">Showing quantity, quality and buyer counts on larger screens.</p>
    </section>
  );
}
