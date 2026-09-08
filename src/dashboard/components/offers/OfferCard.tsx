import { ArrowLeftRight, BadgeCheck, Check, MapPin, Star, X } from "lucide-react";
import type { Buyer, Offer } from "../../data/offers";
import { inr, STATUS_META } from "../../data/offers";
import { cn } from "../../../utils/cn";

export type OfferAction = "accept" | "counter" | "reject";

const BTN = "inline-flex h-9 items-center justify-center gap-1.5 rounded-lg px-3.5 text-[12px] font-semibold transition-all duration-150";

export default function OfferCard({
  offer,
  buyer,
  selected,
  onSelect,
  onAction,
}: {
  offer: Offer;
  buyer: Buyer;
  selected: boolean;
  onSelect: () => void;
  onAction: (action: OfferAction) => void;
}) {
  const act = (action: OfferAction) => (e: React.MouseEvent) => {
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
      aria-label={`Offer from ${buyer.name}`}
      className={cn(
        "group cursor-pointer rounded-2xl border-2 bg-white p-4 transition-all duration-200 sm:p-[18px]",
        selected
          ? "border-[#2E7D32] bg-[#F4FAF4] shadow-[0_14px_34px_-18px_rgba(46,125,50,0.4)]"
          : "border-transparent shadow-[0_0_0_1px_#E1E5E1] hover:shadow-[0_0_0_1.5px_#9fd0a5]"
      )}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        {/* Buyer identity */}
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#0E9F6E] font-display text-[13px] font-bold text-white">
            {buyer.initials}
          </span>
          <div className="min-w-0">
            <p className="flex flex-wrap items-center gap-1.5 text-[14.5px] leading-tight font-bold text-[#111111]">
              <span className="truncate">{buyer.name}</span>
              {buyer.verified && <BadgeCheck className="h-4 w-4 shrink-0 text-[#2E7D32]" aria-label="Verified buyer" />}
            </p>
            <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11.5px] text-[#777777]">
              <span className="flex items-center gap-1 font-semibold text-[#111111]">
                <Star className="h-3 w-3 text-amber-400" fill="currentColor" />
                {buyer.rating.toFixed(1)}
              </span>
              <span>({buyer.reviews} reviews)</span>
            </p>
            <p className="mt-0.5 flex items-center gap-1 text-[11.5px] text-[#777777]">
              <MapPin className="h-3 w-3 shrink-0 text-[#2E7D32]" />
              {buyer.location}
            </p>
            <p className="mt-0.5 text-[11px] text-[#999999]">
              {buyer.description} | Since {buyer.since}
            </p>
          </div>
        </div>

        {/* Price / quantity / total */}
        <div className="flex shrink-0 flex-wrap items-center gap-x-7 gap-y-2 lg:flex-col lg:items-end lg:gap-1.5">
          <p className="font-display text-[18px] leading-none font-bold text-[#2E7D32]">
            ₹ {offer.pricePerKg.toFixed(2)}
            <span className="font-sans text-[12px] font-semibold text-[#777777]"> /kg</span>
          </p>
          <p className="text-[12px] font-medium text-[#555555]">
            {offer.quantityKg.toLocaleString("en-IN")} kg
          </p>
          <p className="text-[11.5px] text-[#999999]">
            Total: <span className="font-bold text-[#111111]">{inr(offer.totalAmount)}</span>
          </p>
        </div>
      </div>

      {/* Message + time */}
      <p className="mt-3 max-w-[720px] text-[12.5px] leading-relaxed text-[#555555]">
        &ldquo;{offer.message}&rdquo;
      </p>
      <p className="mt-1.5 text-[11px] text-[#999999]">{offer.timeReceived}</p>

      {/* Actions / resolved badge */}
      {offer.status === "pending" ? (
        <div className="mt-3.5 flex flex-wrap items-center gap-2">
          <button type="button" onClick={act("accept")} className={`${BTN} bg-[#2E7D32] text-white hover:bg-[#256628]`}>
            <Check className="h-3.5 w-3.5" strokeWidth={2.6} />
            Accept
          </button>
          <button
            type="button"
            onClick={act("counter")}
            className={`${BTN} border-[1.5px] border-[#1D6FB8] bg-white text-[#1D6FB8] hover:bg-[#F3F8FD]`}
          >
            <ArrowLeftRight className="h-3.5 w-3.5" strokeWidth={2.4} />
            Counter
          </button>
          <button
            type="button"
            onClick={act("reject")}
            className={`${BTN} border-[1.5px] border-red-300 bg-white text-red-500 hover:bg-red-50`}
          >
            <X className="h-3.5 w-3.5" strokeWidth={2.6} />
            Reject
          </button>
        </div>
      ) : (
        <p className="mt-3.5">
          <span className={cn("inline-flex rounded-full px-3.5 py-1.5 text-[11.5px] font-bold", STATUS_META[offer.status].badgeClass)}>
            {STATUS_META[offer.status].label}
            {offer.status === "countered" && offer.counterPrice !== undefined ? `: ₹ ${offer.counterPrice.toFixed(2)}/kg` : ""}
          </span>
        </p>
      )}
    </article>
  );
}
