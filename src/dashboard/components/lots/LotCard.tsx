import { Eye, MapPin, Pencil, Trash2 } from "lucide-react";
import type { CropLot, LotStatus } from "../../data/cropLots";
import { formatPrice } from "../../data/cropLots";
import { cn } from "../../../utils/cn";

export type LotAction = "offers" | "edit" | "delete" | "publish";

export function LotStatusBadge({ status, className }: { status: LotStatus; className?: string }) {
  const styles: Record<LotStatus, string> = {
    active: "bg-[#EAF6EA] text-[#2E7D32]",
    sold: "bg-sky-100 text-sky-700",
    draft: "bg-amber-100 text-amber-700",
    expired: "bg-[#E8EAE8] text-[#666666]",
  };
  const labels: Record<LotStatus, string> = {
    active: "Active",
    sold: "Sold",
    draft: "Draft",
    expired: "Expired",
  };
  return (
    <span className={cn("inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold", styles[status], className)}>
      {labels[status]}
    </span>
  );
}

const BTN = "inline-flex h-9 items-center justify-center gap-1.5 rounded-lg text-[12px] font-semibold transition-all duration-150";

export default function LotCard({
  lot,
  selected,
  onSelect,
  onAction,
}: {
  lot: CropLot;
  selected: boolean;
  onSelect: () => void;
  onAction: (action: LotAction) => void;
}) {
  const priceLabel = lot.status === "sold" ? "Sold Price" : "Expected Price";
  const priceValue = formatPrice(lot.status === "sold" ? lot.soldPrice : lot.expectedPrice);

  const act = (action: LotAction) => (e: React.MouseEvent) => {
    e.stopPropagation();
    onAction(action);
  };

  return (
    <article
      onClick={onSelect}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelect()}
      tabIndex={0}
      role="button"
      aria-pressed={selected}
      aria-label={`Select lot ${lot.crop}`}
      className={cn(
        "group flex cursor-pointer flex-col gap-4 rounded-2xl border-2 bg-white p-4 transition-all duration-200 sm:p-[18px] lg:flex-row lg:items-stretch",
        selected
          ? "border-[#2E7D32] bg-[#F4FAF4] shadow-[0_14px_34px_-18px_rgba(46,125,50,0.4)]"
          : "border-transparent shadow-[0_0_0_1px_#E1E5E1] hover:shadow-[0_0_0_1.5px_#9fd0a5]"
      )}
    >
      {/* Crop image */}
      <img
        src={lot.image}
        alt={lot.crop}
        loading="lazy"
        className="h-40 w-full shrink-0 rounded-xl object-cover sm:h-36 lg:h-auto lg:min-h-[104px] lg:w-[124px]"
      />

      {/* Middle — lot info */}
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-[5px]">
        <h3 className="text-[15px] leading-tight font-bold text-[#111111]">{lot.crop}</h3>
        <p className="text-[12.5px] font-medium text-[#666666]">
          {lot.quantity.toLocaleString("en-IN")} {lot.unit} • {lot.grade}
        </p>
        <p className="flex items-center gap-1.5 text-[12px] text-[#777777]">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-[#2E7D32]" />
          {lot.location}
        </p>
        {lot.harvestDate && (
          <p className="text-[12px] text-[#777777]">Harvest Date: {lot.harvestDate}</p>
        )}
        {lot.lastSaved && lot.status === "draft" && (
          <p className="text-[12px] text-[#777777]">Last Saved: {lot.lastSaved}</p>
        )}
        <p className="text-[13px] font-semibold text-[#111111]">
          {priceLabel}: <span className="text-[#2E7D32]">{priceValue}</span>
          <span className="font-medium text-[#777777]"> /{lot.unit}</span>
        </p>
        {lot.status === "sold" && lot.buyer && (
          <p className="text-[12px] text-[#777777]">
            Buyer: <span className="font-semibold text-[#111111]">{lot.buyer}</span>
          </p>
        )}
        {lot.status === "sold" && lot.transactionCompleted && (
          <p className="text-[11.5px] text-[#999999]">Transaction Completed: {lot.transactionCompleted}</p>
        )}
      </div>

      {/* Right — status, stats, actions */}
      <div className="flex shrink-0 flex-row flex-wrap items-center justify-between gap-x-4 gap-y-3 lg:w-[190px] lg:flex-col lg:items-end lg:justify-between lg:gap-2 lg:flex-nowrap">
        <div className="flex items-center gap-2 lg:flex-col lg:items-end lg:gap-2">
          <LotStatusBadge status={lot.status} />
          {lot.status !== "draft" && (
            <div className="flex items-center gap-3 lg:flex-col lg:items-end lg:gap-1">
              <p className="text-[12.5px] font-bold text-[#111111]">
                {lot.offers} {lot.offers === 1 ? "Offer" : "Offers"}
              </p>
              <p className="flex items-center gap-1 text-[11.5px] text-[#777777]">
                <Eye className="h-3.5 w-3.5" />
                {lot.views} Views
              </p>
            </div>
          )}
          {lot.postedOn && <p className="hidden text-[11px] text-[#999999] lg:block">Posted On: {lot.postedOn}</p>}
        </div>

        <div className="flex flex-wrap items-center gap-2 lg:justify-end">
          {lot.status === "active" && (
            <>
              <button
                type="button"
                onClick={act("offers")}
                className={`${BTN} bg-[#2E7D32] px-3.5 text-white hover:bg-[#256628]`}
              >
                View Offers
              </button>
              <button
                type="button"
                onClick={act("edit")}
                className={`${BTN} border-[1.5px] border-[#2E7D32] bg-white px-3 text-[#2E7D32] hover:bg-[#EAF6EA]`}
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit Lot
              </button>
              <button
                type="button"
                onClick={act("delete")}
                aria-label={`Delete ${lot.crop}`}
                className={`${BTN} border-[1.5px] border-red-300 bg-white px-3 text-red-500 hover:bg-red-50`}
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Delete</span>
              </button>
            </>
          )}
          {lot.status === "sold" && (
            <button
              type="button"
              onClick={act("offers")}
              className={`${BTN} border-[1.5px] border-[#2E7D32] bg-white px-3.5 text-[#2E7D32] hover:bg-[#EAF6EA]`}
            >
              View Details
            </button>
          )}
          {lot.status === "draft" && (
            <>
              <button
                type="button"
                onClick={act("publish")}
                className={`${BTN} bg-[#2E7D32] px-3.5 text-white hover:bg-[#256628]`}
              >
                Complete &amp; Publish
              </button>
              <button
                type="button"
                onClick={act("edit")}
                className={`${BTN} border-[1.5px] border-[#2E7D32] bg-white px-3 text-[#2E7D32] hover:bg-[#EAF6EA]`}
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit Draft
              </button>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
