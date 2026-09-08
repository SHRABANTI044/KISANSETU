import { useEffect, useState } from "react";
import {
  Calendar,
  EllipsisVertical,
  Eye,
  Handshake,
  MapPin,
  Package,
  Pencil,
  Sprout,
  XCircle,
} from "lucide-react";
import type { BuyerRequirement, CropKey } from "../../data/buyerRequirements";
import {
  CROP_THUMB_STYLES,
  priceRange,
  REQUIREMENT_STATUS_META,
} from "../../data/buyerRequirements";
import { cn } from "../../../utils/cn";

export type RequirementRowAction = "view" | "edit" | "offers" | "close";

function CropThumb({ cropKey, cropName, image }: { cropKey: CropKey; cropName: string; image?: string }) {
  if (image) {
    return <img src={image} alt={cropName} className="h-12 w-12 shrink-0 rounded-xl object-cover" />;
  }
  const style = CROP_THUMB_STYLES[cropKey];
  return (
    <span className={cn("grid h-12 w-12 shrink-0 place-items-center rounded-xl", style.tile)}>
      <Sprout className="h-[22px] w-[22px]" strokeWidth={1.9} />
    </span>
  );
}

function RowMenu({
  status,
  onAction,
}: {
  status: BuyerRequirement["status"];
  onAction: (action: RequirementRowAction) => void;
}) {
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

  type MenuItem = { action: RequirementRowAction; label: string; icon: typeof Eye; tone?: string };
  const items: MenuItem[] = [{ action: "view", label: "View Details", icon: Eye }];
  if (status === "negotiation") items.push({ action: "offers", label: "View Offers", icon: Handshake });
  if (status === "open" || status === "negotiation") {
    items.push({ action: "edit", label: "Edit Requirement", icon: Pencil });
    items.push({ action: "close", label: "Close Requirement", icon: XCircle, tone: "text-red-500" });
  }

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
        <div className="animate-pop-in absolute top-[calc(100%+6px)] right-0 z-30 w-[190px] rounded-xl border border-[#E1E5E1] bg-white p-1.5 shadow-[0_18px_44px_-16px_rgba(17,17,17,0.25)]">
          {items.map((item) => (
            <button
              key={item.label}
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

export default function RequirementTable({
  requirements,
  onView,
  onViewOffers,
  onAction,
}: {
  requirements: BuyerRequirement[];
  onView: (req: BuyerRequirement) => void;
  onViewOffers: (req: BuyerRequirement) => void;
  onAction: (req: BuyerRequirement, action: RequirementRowAction) => void;
}) {
  if (requirements.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-2xl border border-[#E1E5E1] bg-white shadow-[0_10px_30px_-18px_rgba(17,17,17,0.12)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1080px] border-collapse text-left">
          <thead>
            <tr className="border-b border-[#E1E5E1] bg-[#F7FAF7]">
              {[
                "Requirement Details",
                "Quantity",
                "Preferred Price (₹/quintal)",
                "Location",
                "Timeline",
                "Offers",
                "Status",
                "Action",
                "",
              ].map((head) => (
                <th key={head} className="px-4 py-3.5 text-[10.5px] font-bold tracking-[0.08em] whitespace-nowrap text-[#777777] uppercase">
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {requirements.map((req) => {
              const meta = REQUIREMENT_STATUS_META[req.status];
              return (
                <tr key={req.id} className="border-b border-[#F0F3F0] transition-colors last:border-0 hover:bg-[#FAFCFA]">
                  {/* Requirement details */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3.5">
                      <CropThumb cropKey={req.cropKey} cropName={req.cropName} image={req.image} />
                      <div className="min-w-0">
                        <p className="text-[13.5px] leading-tight font-bold text-[#111111]">{req.cropName}</p>
                        <p className="mt-1 text-[11.5px] text-[#777777]">
                          Variety: {req.variety} | Grade: {req.grade}
                        </p>
                        <p className="mt-0.5 text-[10.5px] text-[#999999]">
                          Req ID: {req.requirementId} | {req.createdLabel}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Quantity */}
                  <td className="px-4 py-3.5">
                    <span className="flex items-center gap-1.5 text-[12.5px] font-semibold whitespace-nowrap text-[#111111]">
                      <Package className="h-3.5 w-3.5 text-[#2E7D32]" />
                      {req.quantity.toLocaleString("en-IN")} {req.unit}
                    </span>
                  </td>

                  {/* Preferred price */}
                  <td className="px-4 py-3.5 font-display text-[13px] font-bold whitespace-nowrap text-[#2E7D32]">
                    {priceRange(req.minPrice, req.maxPrice)}
                  </td>

                  {/* Location */}
                  <td className="px-4 py-3.5">
                    <span className="flex items-center gap-1 text-[12.5px] whitespace-nowrap text-[#444444]">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-[#2E7D32]" />
                      {req.location}
                    </span>
                  </td>

                  {/* Timeline */}
                  <td className="px-4 py-3.5">
                    <span className="flex items-center gap-1.5 text-[12px] whitespace-nowrap text-[#444444]">
                      <Calendar className="h-3.5 w-3.5 shrink-0 text-[#B9BFB9]" />
                      <span>
                        {req.timeline}
                        <span className="block text-[10.5px] text-[#999999]">Due: {req.dueDateLabel}</span>
                      </span>
                    </span>
                  </td>

                  {/* Offers */}
                  <td className="px-4 py-3.5">
                    <p className="font-display text-[14px] font-bold text-[#111111]">
                      {req.offersCount}
                      <span className="ml-1 text-[10.5px] font-medium text-[#999999]">
                        {req.offersCount === 1 ? "offer" : "offers"}
                      </span>
                    </p>
                    <button
                      type="button"
                      onClick={() => onViewOffers(req)}
                      className="mt-0.5 text-[11.5px] font-semibold text-[#2E7D32] transition-colors hover:text-[#155B32]"
                    >
                      View Offers
                    </button>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3.5">
                    <span className={cn("inline-flex rounded-full px-3 py-1 text-[11px] font-bold whitespace-nowrap", meta.badgeClass)}>
                      {meta.label}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="px-4 py-3.5">
                    <button
                      type="button"
                      onClick={() => onView(req)}
                      className="inline-flex h-9 items-center rounded-lg border-[1.5px] border-[#2E7D32] px-3.5 text-[12px] font-semibold whitespace-nowrap text-[#2E7D32] transition-colors hover:bg-[#EAF6EA]"
                    >
                      View Details
                    </button>
                  </td>

                  {/* Menu */}
                  <td className="px-2 py-3.5">
                    <RowMenu status={req.status} onAction={(action) => onAction(req, action)} />
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
