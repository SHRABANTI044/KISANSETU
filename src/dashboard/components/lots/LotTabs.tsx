import { cn } from "../../../utils/cn";

export type LotTabKey = "all" | "active" | "sold";

const TAB_LABELS: { key: LotTabKey; label: string }[] = [
  { key: "all", label: "All Lots" },
  { key: "active", label: "Active" },
  { key: "sold", label: "Sold" },
];

export default function LotTabs({
  counts,
  active,
  onChange,
}: {
  counts: Record<LotTabKey, number>;
  active: LotTabKey;
  onChange: (key: LotTabKey) => void;
}) {
  return (
    <div className="border-b border-[#E1E5E1]">
      <div className="no-scrollbar flex items-end gap-7 overflow-x-auto" role="tablist" aria-label="Lot status">
        {TAB_LABELS.map((tab) => {
          const selected = active === tab.key;
          return (
            <button
              key={tab.key}
              role="tab"
              aria-selected={selected}
              onClick={() => onChange(tab.key)}
              className={cn(
                "relative shrink-0 pb-3 text-[13.5px] whitespace-nowrap transition-colors duration-200",
                selected ? "font-semibold text-[#2E7D32]" : "font-medium text-[#666666] hover:text-[#111111]"
              )}
            >
              {tab.label} ({counts[tab.key]})
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
  );
}
