import { Building2, MapPin } from "lucide-react";
import type { LotOffer } from "../../data/cropLots";
import { formatPrice } from "../../data/cropLots";
import { cn } from "../../../utils/cn";

const statusStyles: Record<LotOffer["status"], string> = {
  pending: "bg-amber-100 text-amber-700",
  accepted: "bg-[#EAF6EA] text-[#2E7D32]",
  rejected: "bg-red-50 text-red-600",
};
const statusLabels: Record<LotOffer["status"], string> = {
  pending: "Pending",
  accepted: "Accepted",
  rejected: "Rejected",
};

export default function OfferList({
  offers,
  onUpdate,
}: {
  offers: LotOffer[];
  onUpdate: (offer: LotOffer) => void;
}) {
  if (offers.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-[#D8DED8] bg-[#FAFBFA] px-4 py-6 text-center text-[12.5px] text-[#777777]">
        No offers yet — buyers will appear here when they make an offer.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {offers.map((offer, i) => (
        <li key={offer.id} className="rounded-xl border border-[#E1E5E1] bg-white p-3.5">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[10.5px] font-bold tracking-[0.1em] text-[#999999] uppercase">Offer {i + 1}</p>
              <p className="mt-0.5 flex items-center gap-1.5 text-[13.5px] font-semibold text-[#111111]">
                <Building2 className="h-3.5 w-3.5 shrink-0 text-[#2E7D32]" />
                {offer.buyer}
              </p>
              <p className="mt-0.5 flex items-center gap-1 text-[11.5px] text-[#777777]">
                <MapPin className="h-3 w-3" />
                {offer.location}
              </p>
            </div>
            <span className={cn("shrink-0 rounded-full px-2.5 py-1 text-[10.5px] font-bold", statusStyles[offer.status])}>
              {statusLabels[offer.status]}
            </span>
          </div>

          <div className="mt-2.5 flex items-baseline gap-4">
            <p className="text-[13px]">
              <span className="text-[#777777]">Price: </span>
              <span className="font-display text-[15px] font-bold text-[#2E7D32]">{formatPrice(offer.price)}</span>
              <span className="text-[11px] font-medium text-[#777777]">/{offer.unit}</span>
            </p>
            <p className="text-[12px] text-[#666666]">
              <span className="text-[#777777]">Qty: </span>
              <span className="font-semibold">{offer.quantity.toLocaleString("en-IN")} {offer.unit}</span>
            </p>
          </div>

          <div className="mt-3 flex gap-2">
            {offer.status === "pending" ? (
              <>
                <button
                  type="button"
                  onClick={() => onUpdate({ ...offer, status: "accepted" })}
                  className="inline-flex h-8 flex-1 items-center justify-center rounded-lg bg-[#2E7D32] text-[11.5px] font-semibold text-white transition-colors hover:bg-[#256628]"
                >
                  Accept
                </button>
                <button
                  type="button"
                  onClick={() => onUpdate({ ...offer, status: "rejected" })}
                  className="inline-flex h-8 flex-1 items-center justify-center rounded-lg border border-red-300 bg-white text-[11.5px] font-semibold text-red-500 transition-colors hover:bg-red-50"
                >
                  Reject
                </button>
              </>
            ) : (
              <p className={cn(
                "flex h-8 flex-1 items-center justify-center rounded-lg text-[11.5px] font-bold",
                offer.status === "accepted" ? "bg-[#EAF6EA] text-[#2E7D32]" : "bg-red-50 text-red-500"
              )}>
                {offer.status === "accepted" ? "Offer Accepted" : "Offer Rejected"}
              </p>
            )}
            <button
              type="button"
              className="inline-flex h-8 items-center justify-center rounded-lg border-[1.5px] border-[#2E7D32] bg-white px-3 text-[11.5px] font-semibold text-[#2E7D32] transition-colors hover:bg-[#EAF6EA]"
            >
              View Buyer
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
