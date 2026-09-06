import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bookmark, Handshake, MapPin, MessageCircle, Star, X } from "lucide-react";
import type { InterestedBuyer } from "../../data/interestedBuyers";
import { BUYER_STATUS_META } from "../../data/interestedBuyers";
import { cn } from "../../../utils/cn";

export default function BuyerDetailsModal({
  buyer,
  onClose,
  onChat,
  onToggleSave,
}: {
  buyer: InterestedBuyer;
  onClose: () => void;
  onChat: (buyer: InterestedBuyer) => void;
  onToggleSave: (buyer: InterestedBuyer) => void;
}) {
  const navigate = useNavigate();
  const meta = BUYER_STATUS_META[buyer.status];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const rows: [string, string][] = [
    ["Company", buyer.company],
    ["Location", `${buyer.location} · ${buyer.state}`],
    ["Rating", `${buyer.rating.toFixed(1)} (${buyer.deals} deals)`],
    ["Interested Crop", `${buyer.crop} (Lot ID: ${buyer.lotId})`],
    ["Offered Price", `₹ ${buyer.offeredPrice.toLocaleString("en-IN")} /quintal`],
    ["Quantity", `${buyer.quantityQuintal} quintal`],
    ["Interest Date", buyer.interestDate],
  ];

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/45 p-4 backdrop-blur-[2px] sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-label={`Details for ${buyer.name}`}
      onClick={onClose}
    >
      <div
        className="animate-pop-in max-h-[92dvh] w-full max-w-[460px] overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <span className={cn("grid h-[54px] w-[54px] shrink-0 place-items-center rounded-full", buyer.tone)}>
              <buyer.icon className="h-[24px] w-[24px]" strokeWidth={2} />
            </span>
            <div>
              <h2 className="font-display text-[17px] leading-tight font-bold text-[#111111]">{buyer.name}</h2>
              <p className="mt-1 flex items-center gap-1.5 text-[11.5px] text-[#777777]">
                <MapPin className="h-3 w-3 shrink-0 text-[#2E7D32]" />
                {buyer.location}
              </p>
              <p className="mt-0.5 flex items-center gap-1 text-[11.5px] text-[#777777]">
                <Star className="h-3 w-3 text-amber-400" fill="currentColor" />
                <span className="font-semibold text-[#111111]">{buyer.rating.toFixed(1)}</span> · {buyer.deals} deals completed
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[#E1E5E1] text-[#666666] transition-colors hover:bg-[#EAF6EA] hover:text-[#2E7D32]"
          >
            <X className="h-[18px] w-[18px]" />
          </button>
        </div>

        <p className="mt-4">
          <span className={cn("inline-flex rounded-full px-3.5 py-1.5 text-[11.5px] font-bold", meta.cls)}>{meta.label}</span>
        </p>

        {/* Info grid */}
        <dl className="mt-4 flex flex-col gap-2.5">
          {rows.map(([label, value]) => (
            <div key={label} className="flex items-baseline justify-between gap-3 border-b border-[#F0F3F0] pb-2">
              <dt className="text-[12px] font-medium text-[#777777]">{label}</dt>
              <dd className="text-right text-[12.5px] font-semibold text-[#111111]">{value}</dd>
            </div>
          ))}
        </dl>

        {/* Actions */}
        <div className="mt-6 grid gap-2.5 sm:grid-cols-3">
          <button
            type="button"
            onClick={() => onChat(buyer)}
            className="inline-flex h-[44px] items-center justify-center gap-2 rounded-xl bg-[#2E7D32] text-[12.5px] font-semibold text-white transition-colors hover:bg-[#256628]"
          >
            <MessageCircle className="h-4 w-4" strokeWidth={2.2} />
            Chat with Buyer
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              navigate("/dashboard/offers");
            }}
            className="inline-flex h-[44px] items-center justify-center gap-2 rounded-xl border-[1.5px] border-[#1D6FB8] bg-white text-[12.5px] font-semibold text-[#1D6FB8] transition-colors hover:bg-[#F3F8FD]"
          >
            <Handshake className="h-4 w-4" strokeWidth={2.2} />
            View Offers
          </button>
          <button
            type="button"
            onClick={() => onToggleSave(buyer)}
            className={cn(
              "inline-flex h-[44px] items-center justify-center gap-2 rounded-xl border-[1.5px] text-[12.5px] font-semibold transition-colors",
              buyer.saved
                ? "border-[#2E7D32] bg-[#EAF6EA] text-[#2E7D32]"
                : "border-[#E1E5E1] bg-white text-[#444444] hover:border-[#2E7D32]/50 hover:text-[#2E7D32]"
            )}
          >
            <Bookmark className="h-4 w-4" strokeWidth={2.2} fill={buyer.saved ? "currentColor" : "none"} />
            {buyer.saved ? "Saved" : "Save Buyer"}
          </button>
        </div>
      </div>
    </div>
  );
}
