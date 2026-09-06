import { useEffect, useState } from "react";
import { Bookmark, EllipsisVertical, Eye, Handshake, MapPin, MessageCircle, Star, Trash2 } from "lucide-react";
import type { InterestedBuyer } from "../../data/interestedBuyers";
import { BUYER_STATUS_META } from "../../data/interestedBuyers";
import { cn } from "../../../utils/cn";

export type BuyerRowAction = "view" | "chat" | "save" | "offers" | "remove";

function RowMenu({ onAction }: { onAction: (action: BuyerRowAction) => void }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onPointer = () => setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const items: { action: BuyerRowAction; label: string; icon: typeof Eye; tone?: string }[] = [
    { action: "view", label: "View Details", icon: Eye },
    { action: "chat", label: "Chat", icon: MessageCircle },
    { action: "save", label: "Save Buyer", icon: Bookmark },
    { action: "offers", label: "View Offers", icon: Handshake },
    { action: "remove", label: "Remove / Ignore", icon: Trash2, tone: "text-red-500" },
  ];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        aria-expanded={open}
        aria-label="More actions"
        className="grid h-8 w-8 place-items-center rounded-lg text-[#999999] transition-colors hover:bg-[#EAF6EA] hover:text-[#2E7D32]"
      >
        <EllipsisVertical className="h-[18px] w-[18px]" strokeWidth={2} />
      </button>
      {open && (
        <div className="animate-pop-in absolute top-[calc(100%+6px)] right-0 z-30 w-[180px] rounded-xl border border-[#E1E5E1] bg-white p-1.5 shadow-[0_18px_44px_-16px_rgba(17,17,17,0.25)]">
          {items.map((item) => (
            <button
              key={item.action}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
                onAction(item.action);
              }}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-[12.5px] font-medium transition-colors",
                item.tone ?? "text-[#444444] hover:bg-[#F0FAF1] hover:text-[#2E7D32]",
                item.tone && "hover:bg-red-50"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" strokeWidth={2.1} />
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function BuyersTable({
  buyers,
  onView,
  onAction,
}: {
  buyers: InterestedBuyer[];
  onView: (buyer: InterestedBuyer) => void;
  onAction: (buyer: InterestedBuyer, action: BuyerRowAction) => void;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#E1E5E1] bg-white shadow-[0_10px_30px_-18px_rgba(17,17,17,0.12)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] border-collapse text-left">
          <thead>
            <tr className="border-b border-[#E1E5E1] bg-[#F7FAF7]">
              {["Buyer Name", "Company", "Location", "Interested In (Your Lot)", "Offered Price (₹/quintal)", "Quantity (Quintal)", "Interest Date", "Status", "Action", ""].map((head) => (
                <th key={head} className="px-4 py-3.5 text-[10.5px] font-bold tracking-[0.08em] whitespace-nowrap text-[#777777] uppercase">
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {buyers.map((buyer) => {
              const meta = BUYER_STATUS_META[buyer.status];
              return (
                <tr key={buyer.id} className="border-b border-[#F0F3F0] transition-colors last:border-0 hover:bg-[#FAFCFA]">
                  {/* Buyer name + rating */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <span className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-full", buyer.tone)}>
                        <buyer.icon className="h-[18px] w-[18px]" strokeWidth={2} />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-semibold text-[#111111]">{buyer.name}</p>
                        <p className="mt-0.5 flex items-center gap-1 text-[11px] text-[#777777]">
                          <Star className="h-3 w-3 text-amber-400" fill="currentColor" />
                          <span className="font-semibold text-[#111111]">{buyer.rating.toFixed(1)}</span>
                          ({buyer.deals} deals)
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-[12.5px] whitespace-nowrap text-[#444444]">{buyer.company}</td>
                  <td className="px-4 py-3.5">
                    <span className="flex items-center gap-1 text-[12.5px] whitespace-nowrap text-[#444444]">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-[#2E7D32]" />
                      {buyer.location}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="text-[12.5px] font-semibold whitespace-nowrap text-[#111111]">{buyer.crop}</p>
                    <p className="mt-0.5 text-[11px] text-[#999999]">(Lot ID: {buyer.lotId})</p>
                  </td>
                  <td className="px-4 py-3.5 text-[13px] font-bold whitespace-nowrap text-[#2E7D32]">
                    {buyer.offeredPrice.toLocaleString("en-IN")}
                  </td>
                  <td className="px-4 py-3.5 text-[12.5px] text-[#444444]">{buyer.quantityQuintal}</td>
                  <td className="px-4 py-3.5 text-[12.5px] whitespace-nowrap text-[#666666]">{buyer.interestDate}</td>
                  <td className="px-4 py-3.5">
                    <span className={cn("inline-flex rounded-full px-3 py-1 text-[11px] font-bold whitespace-nowrap", meta.cls)}>
                      {meta.label}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <button
                      type="button"
                      onClick={() => onView(buyer)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-[#CBDCF2] bg-[#F3F8FD] px-3 py-1.5 text-[11.5px] font-semibold whitespace-nowrap text-[#1D6FB8] transition-colors hover:bg-[#DCEAF7]"
                    >
                      <Eye className="h-3.5 w-3.5" strokeWidth={2.2} />
                      View
                    </button>
                  </td>
                  <td className="px-2 py-3.5">
                    <RowMenu onAction={(action) => onAction(buyer, action)} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
