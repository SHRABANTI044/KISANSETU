import { BadgeCheck, Building2, Calendar, CreditCard, Handshake, IndianRupee, Lightbulb, MapPin, Package, ReceiptText, Star, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import type { Buyer, Offer } from "../../data/offers";
import { inr, STATUS_META } from "../../data/offers";
import { cn } from "../../../utils/cn";

function Row({ icon: Icon, label, value, strong = false }: { icon: LucideIcon; label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="mt-[3px] h-4 w-4 shrink-0 text-[#2E7D32]" strokeWidth={2.1} />
      <div className="grid flex-1 grid-cols-[112px_1fr] items-baseline gap-2">
        <span className="text-[11.5px] font-medium text-[#888888]">{label}</span>
        <span className={cn("text-[12.5px] text-[#111111]", strong && "font-bold")}>{value}</span>
      </div>
    </div>
  );
}

export function DetailPlaceholder() {
  return (
    <aside className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-[#D8DED8] bg-white px-6 py-16 text-center xl:sticky xl:top-[92px]">
      <span className="grid h-14 w-14 place-items-center rounded-full bg-[#EAF6EA] text-[#2E7D32]">
        <Handshake className="h-6 w-6" strokeWidth={1.9} />
      </span>
      <p className="text-[14px] font-semibold text-[#111111]">Select an offer to view details</p>
      <p className="max-w-[260px] text-[12.5px] text-[#666666]">
        Choose any offer from the list to see buyer information, offer terms and actions.
      </p>
    </aside>
  );
}

export function OfferDetailPanel({
  offer,
  buyer,
  onClose,
  onAction,
}: {
  offer: Offer;
  buyer: Buyer;
  onClose: () => void;
  onAction: (action: "accept" | "counter" | "reject") => void;
}) {
  const meta = STATUS_META[offer.status];

  return (
    <aside
      aria-label={`Offer details from ${buyer.name}`}
      className="rounded-2xl border border-[#E1E5E1] bg-white p-5 shadow-[0_12px_34px_-20px_rgba(17,17,17,0.14)] sm:p-6 xl:sticky xl:top-[92px] xl:max-h-[calc(100dvh-108px)] xl:overflow-y-auto"
    >
      {/* Buyer header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3.5">
          <span className="grid h-[54px] w-[54px] shrink-0 place-items-center rounded-full bg-[#0E9F6E] font-display text-[17px] font-bold text-white">
            {buyer.initials}
          </span>
          <div>
            <p className="flex items-center gap-1.5 text-[15px] leading-tight font-bold text-[#111111]">
              {buyer.name}
              {buyer.verified && <BadgeCheck className="h-4 w-4 shrink-0 text-[#2E7D32]" aria-label="Verified buyer" />}
            </p>
            <p className="mt-1 flex items-center gap-1.5 text-[11.5px] text-[#777777]">
              <Star className="h-3 w-3 text-amber-400" fill="currentColor" />
              <span className="font-semibold text-[#111111]">{buyer.rating.toFixed(1)}</span>
              ({buyer.reviews} reviews)
            </p>
            <p className="mt-0.5 flex items-center gap-1 text-[11.5px] text-[#777777]">
              <MapPin className="h-3 w-3 shrink-0 text-[#2E7D32]" />
              {buyer.location} · Since {buyer.since}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close details"
          className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-[#E1E5E1] text-[#8A938A] transition-colors hover:bg-[#EAF6EA] hover:text-[#2E7D32]"
        >
          <X className="h-4 w-4" strokeWidth={2.2} />
        </button>
      </div>

      <Link
        to="/dashboard/buyers"
        className="mt-4 inline-flex items-center gap-1 text-[12.5px] font-semibold text-[#2E7D32] transition-colors hover:text-[#155B32]"
      >
        View Full Profile →
      </Link>

      {/* Offer details */}
      <h3 className="mt-6 flex items-center justify-between gap-3 border-t border-[#F0F3F0] pt-5 font-display text-[15px] font-semibold text-[#111111]">
        Offer Details
        <span className={cn("rounded-full px-3 py-1 text-[10.5px] font-bold", meta.badgeClass)}>{meta.label}</span>
      </h3>
      <div className="mt-4 flex flex-col gap-3.5">
        <Row icon={IndianRupee} label="Offered Price" value={`₹ ${offer.pricePerKg.toFixed(2)} /kg`} strong />
        <Row icon={Package} label="Quantity" value={`${offer.quantityKg.toLocaleString("en-IN")} kg`} strong />
        <Row icon={ReceiptText} label="Total Amount" value={inr(offer.totalAmount)} strong />
        <Row icon={Calendar} label="Pickup Date" value={offer.pickupDate} />
        <Row icon={CreditCard} label="Payment Terms" value={offer.paymentTerms} />
        {offer.status === "countered" && offer.counterPrice !== undefined && (
          <Row icon={Handshake} label="Your Counter" value={`₹ ${offer.counterPrice.toFixed(2)} /kg`} strong />
        )}
      </div>

      <div className="mt-4">
        <p className="text-[11.5px] font-medium text-[#888888]">Additional Note</p>
        <p className="mt-1.5 rounded-xl bg-[#F7FAF7] px-3.5 py-3 text-[12.5px] leading-relaxed text-[#555555] ring-1 ring-[#E1E5E1]">
          {offer.message}
        </p>
      </div>

      {/* Buyer information */}
      <h3 className="mt-6 flex items-center gap-2.5 border-t border-[#F0F3F0] pt-5 font-display text-[15px] font-semibold text-[#111111]">
        <Building2 className="h-[18px] w-[18px] text-[#2E7D32]" />
        Buyer Information
      </h3>
      <dl className="mt-4 flex flex-col gap-2.5">
        {[
          ["Business Type", buyer.businessType],
          ["GST Number", buyer.gst],
          ["Total Transactions", String(buyer.totalTransactions)],
          ["On-time Payment Rate", `${buyer.onTimeRate}%`],
        ].map(([label, value]) => (
          <div key={label} className="flex items-baseline justify-between gap-3 border-b border-[#F0F3F0] pb-2 last:border-0">
            <dt className="text-[11.5px] font-medium text-[#888888]">{label}</dt>
            <dd className="text-right text-[12.5px] font-semibold text-[#111111]">{value}</dd>
          </div>
        ))}
      </dl>
      <Link
        to="/dashboard/earnings"
        className="mt-4 inline-flex h-[42px] w-full items-center justify-center rounded-xl border-[1.5px] border-[#2E7D32] text-[12.5px] font-semibold text-[#2E7D32] transition-colors hover:bg-[#EAF6EA]"
      >
        View Transaction History
      </Link>

      {/* Take action */}
      <h3 className="mt-6 border-t border-[#F0F3F0] pt-5 font-display text-[15px] font-semibold text-[#111111]">
        Take Action
      </h3>
      {offer.status === "pending" ? (
        <div className="mt-4 grid gap-2.5 sm:grid-cols-3 xl:grid-cols-1 2xl:grid-cols-3">
          <button type="button" onClick={() => onAction("accept")} className="inline-flex h-[44px] items-center justify-center rounded-xl bg-[#2E7D32] text-[13px] font-semibold text-white transition-colors hover:bg-[#256628]">
            Accept Offer
          </button>
          <button type="button" onClick={() => onAction("counter")} className="inline-flex h-[44px] items-center justify-center rounded-xl border-[1.5px] border-[#1D6FB8] bg-white text-[13px] font-semibold text-[#1D6FB8] transition-colors hover:bg-[#F3F8FD]">
            Counter Offer
          </button>
          <button type="button" onClick={() => onAction("reject")} className="inline-flex h-[44px] items-center justify-center rounded-xl border-[1.5px] border-red-300 bg-white text-[13px] font-semibold text-red-500 transition-colors hover:bg-red-50">
            Reject Offer
          </button>
        </div>
      ) : (
        <p className={cn("mt-4 rounded-xl px-4 py-3 text-[12.5px] leading-relaxed font-semibold", meta.badgeClass)}>
          {offer.status === "accepted" && "This offer has been accepted. Coordinate pickup with the buyer."}
          {offer.status === "rejected" && "This offer has been rejected."}
          {offer.status === "countered" && `Your counter offer of ₹ ${offer.counterPrice?.toFixed(2)}/kg has been sent. Waiting for the buyer's response.`}
        </p>
      )}

      {/* Tip */}
      <div className="mt-5 flex items-start gap-2.5 rounded-2xl border border-[#BFE3C5]/70 bg-[#F0FAF1] px-4 py-3.5">
        <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-[#E8862D]" strokeWidth={2.2} />
        <p className="text-[11.5px] leading-relaxed font-medium text-[#155B32]">
          <span className="font-bold">Tip:</span> Compare multiple offers and check buyer ratings before accepting. You can also negotiate for a better price!
        </p>
      </div>
    </aside>
  );
}
