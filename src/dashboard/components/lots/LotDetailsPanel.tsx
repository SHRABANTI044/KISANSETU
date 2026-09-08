import { useEffect, useState } from "react";
import {
  BadgeCheck,
  Check,
  Clock,
  Copy,
  IndianRupee,
  MapPin,
  Package,
  Sprout,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { CropLot, LotOffer, LotViewer } from "../../data/cropLots";
import { formatPrice } from "../../data/cropLots";
import { cn } from "../../../utils/cn";
import ImageGallery from "./ImageGallery";
import { LotStatusBadge } from "./LotCard";
import OfferList from "./OfferList";
import ViewerList from "./ViewerList";

export type DetailTab = "details" | "offers" | "viewers";

function DetailRow({
  icon: Icon,
  label,
  value,
  strong = false,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="mt-[3px] h-4 w-4 shrink-0 text-[#2E7D32]" strokeWidth={2.1} />
      <div className="grid flex-1 grid-cols-[110px_1fr] items-baseline gap-2">
        <span className="text-[11.5px] font-medium text-[#888888]">{label}</span>
        <span className={cn("text-[12.5px] text-[#111111]", strong && "font-bold")}>{value}</span>
      </div>
    </div>
  );
}

export default function LotDetailsPanel({
  lot,
  tab,
  onTabChange,
  offers,
  viewers,
  onOfferUpdate,
  onAddPhoto,
}: {
  lot: CropLot;
  tab: DetailTab;
  onTabChange: (tab: DetailTab) => void;
  offers: LotOffer[];
  viewers: LotViewer[];
  onOfferUpdate: (offer: LotOffer) => void;
  onAddPhoto: (dataUrl: string) => void;
}) {
  const [copied, setCopied] = useState(false);

  /* Reset transient UI when the selected lot changes */
  useEffect(() => setCopied(false), [lot.id]);

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(lot.id);
    } catch {
      /* clipboard unavailable — still show feedback */
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  const tabs: { key: DetailTab; label: string }[] = [
    { key: "details", label: "Details" },
    { key: "offers", label: `Offers (${offers.length})` },
    { key: "viewers", label: `Viewers (${lot.views})` },
  ];

  return (
    <aside
      aria-label={`Details for ${lot.crop}`}
      className="rounded-2xl border border-[#E1E5E1] bg-white p-4 shadow-[0_12px_34px_-20px_rgba(17,17,17,0.14)] sm:p-5 xl:sticky xl:top-[92px] xl:max-h-[calc(100dvh-108px)] xl:overflow-y-auto"
    >
      {/* Banner */}
      <div className="relative">
        <img src={lot.images[0] ?? lot.image} alt={lot.crop} className="h-44 w-full rounded-xl object-cover" />
        <LotStatusBadge status={lot.status} className="absolute top-3 right-3 shadow" />
      </div>

      {/* Title + Lot ID */}
      <div className="mt-4">
        <h2 className="text-[17px] font-bold text-[#111111]">{lot.crop}</h2>
        <button
          type="button"
          onClick={copyId}
          className="group mt-1.5 inline-flex items-center gap-1.5 rounded-lg bg-[#F7FAF7] px-2.5 py-1.5 text-[11.5px] font-semibold text-[#666666] ring-1 ring-[#E1E5E1] transition-colors hover:text-[#2E7D32] hover:ring-[#2E7D32]/40"
          aria-live="polite"
        >
          Lot ID: {lot.id}
          {copied ? (
            <Check className="h-3.5 w-3.5 text-[#2E7D32]" strokeWidth={2.6} />
          ) : (
            <Copy className="h-3.5 w-3.5 text-[#999999] transition-colors group-hover:text-[#2E7D32]" />
          )}
        </button>
      </div>

      {/* Panel tabs */}
      <div className="mt-4 border-b border-[#E1E5E1]">
        <div className="flex gap-5" role="tablist" aria-label="Lot details">
          {tabs.map((t) => {
            const selected = tab === t.key;
            return (
              <button
                key={t.key}
                role="tab"
                aria-selected={selected}
                onClick={() => onTabChange(t.key)}
                className={cn(
                  "relative pb-2.5 text-[12.5px] whitespace-nowrap transition-colors duration-200",
                  selected ? "font-bold text-[#2E7D32]" : "font-medium text-[#666666] hover:text-[#111111]"
                )}
              >
                {t.label}
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute right-0 -bottom-px left-0 h-[2.5px] rounded-full bg-[#2E7D32] transition-all duration-300",
                    selected ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
                  )}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab content */}
      <div className="mt-4">
        {tab === "details" && (
          <div className="animate-pop-in flex flex-col gap-4">
            <div className="flex flex-col gap-3.5">
              <DetailRow icon={Sprout} label="Crop" value={lot.crop} strong />
              <DetailRow icon={Package} label="Quantity" value={`${lot.quantity.toLocaleString("en-IN")} ${lot.unit}`} strong />
              <DetailRow icon={BadgeCheck} label="Quality / Grade" value={lot.grade} strong />
              <DetailRow
                icon={IndianRupee}
                label={lot.status === "sold" ? "Sold Price" : "Expected Price"}
                value={`${formatPrice(lot.status === "sold" ? lot.soldPrice : lot.expectedPrice)} /${lot.unit}`}
                strong
              />
              {lot.status === "sold" && lot.buyer && (
                <DetailRow icon={BadgeCheck} label="Buyer" value={lot.buyer} strong />
              )}
              {lot.variety && <DetailRow icon={Sprout} label="Variety" value={lot.variety} />}
              <DetailRow icon={BadgeCheck} label="Organic" value={lot.organic ? "Yes" : "No"} />
              <DetailRow icon={MapPin} label="Location" value={lot.location} />
            </div>

            <div>
              <p className="text-[12px] font-bold text-[#111111]">Description</p>
              <p className="mt-1.5 text-[12px] leading-relaxed text-[#666666]">{lot.description}</p>
            </div>

            <ImageGallery images={lot.images} onAddPhoto={onAddPhoto} />

            <div className="flex flex-col gap-2.5 border-t border-[#F0F3F0] pt-4">
              {lot.postedOn && (
                <div className="flex items-center gap-2.5 text-[11.5px] text-[#777777]">
                  <Clock className="h-3.5 w-3.5 shrink-0 text-[#2E7D32]" />
                  <span className="w-[105px] font-medium text-[#888888]">Posted On</span>
                  <span className="font-semibold text-[#111111]">{lot.postedOn}, 10:30 AM</span>
                </div>
              )}
              <div className="flex items-center gap-2.5 text-[11.5px] text-[#777777]">
                <Clock className="h-3.5 w-3.5 shrink-0 text-[#2E7D32]" />
                <span className="w-[105px] font-medium text-[#888888]">Last Updated</span>
                <span className="font-semibold text-[#111111]">{lot.lastUpdated}</span>
              </div>
            </div>
          </div>
        )}

        {tab === "offers" && (
          <div className="animate-pop-in">
            <OfferList offers={offers} onUpdate={onOfferUpdate} />
          </div>
        )}

        {tab === "viewers" && (
          <div className="animate-pop-in">
            <ViewerList viewers={viewers} totalViews={lot.views} />
          </div>
        )}
      </div>
    </aside>
  );
}
