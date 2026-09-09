import { BarChart3, ClipboardList, FileText, IndianRupee, Leaf, Settings, ShoppingCart, Truck } from "lucide-react";
import { HELP_CATEGORIES } from "../../data/supportData";
import type { HelpCategory } from "../../data/supportData";

const ICONS: Record<string, typeof ClipboardList> = {
  account: ClipboardList,
  orders: ShoppingCart,
  transport: Truck,
  payments: IndianRupee,
  farmers: Leaf,
  market: BarChart3,
  technical: Settings,
  other: FileText,
};

/** 8 clickable support-category cards inside the "How can we help you?" card. */
export default function HelpCategories({ onSelect }: { onSelect: (c: HelpCategory) => void }) {
  return (
    <div className="rounded-2xl border border-[#E4EDE4] bg-white p-5 shadow-[0_10px_24px_-16px_rgba(17,17,17,0.18)]">
      <h2 className="font-display text-[18px] font-bold text-[#111111]">How can we help you?</h2>
      <p className="mt-0.5 text-[12.5px] text-[#666666]">Choose a topic to get started</p>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {HELP_CATEGORIES.map((c) => {
          const Icon = ICONS[c.id] ?? FileText;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => onSelect(c)}
              className="group flex flex-col items-start rounded-xl border border-[#E4EDE4] bg-[#FBFDFB] p-4 text-left transition-all duration-150 hover:-translate-y-0.5 hover:border-[#2E7D32] hover:bg-[#F3FAF3] hover:shadow-[0_12px_24px_-14px_rgba(46,125,50,0.4)]"
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#EAF6EA] text-[#2E7D32] transition-colors group-hover:bg-[#2E7D32] group-hover:text-white">
                <Icon className="h-5 w-5" strokeWidth={2} />
              </span>
              <p className="mt-3 text-[13px] font-bold text-[#111111]">{c.title}</p>
              <p className="mt-1 text-[11.5px] leading-relaxed text-[#666666]">{c.desc}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
