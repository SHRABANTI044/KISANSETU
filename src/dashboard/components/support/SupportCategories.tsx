import { ChevronRight } from "lucide-react";
import type { SupportCategory } from "../../data/support";

export default function SupportCategories({
  categories,
  selectedId,
  onSelect,
}: {
  categories: SupportCategory[];
  selectedId: string | null;
  onSelect: (category: SupportCategory) => void;
}) {
  return (
    <section className="rounded-2xl border border-[#E1E5E1] bg-white p-4 shadow-[0_10px_30px_-18px_rgba(17,17,17,0.12)] sm:p-5">
      <h2 className="px-1.5 pb-1 font-display text-[16.5px] font-semibold text-[#111111]">Support Categories</h2>
      <ul className="mt-2 flex flex-col">
        {categories.map((category) => {
          const selected = selectedId === category.id;
          return (
            <li key={category.id}>
              <button
                type="button"
                onClick={() => onSelect(category)}
                aria-pressed={selected}
                className={`flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-left transition-colors duration-150 ${
                  selected ? "bg-[#F0FAF1]" : "hover:bg-[#F7FAF7]"
                }`}
              >
                <span className={`grid h-[38px] w-[38px] shrink-0 place-items-center rounded-xl ${category.tone}`}>
                  <category.icon className="h-[18px] w-[18px]" strokeWidth={2.1} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-semibold text-[#111111]">{category.title}</span>
                  <span className="mt-0.5 block truncate text-[11px] text-[#888888]">{category.desc}</span>
                </span>
                <ChevronRight className={`h-4 w-4 shrink-0 transition-colors ${selected ? "text-[#2E7D32]" : "text-[#B9BFB9]"}`} strokeWidth={2.2} />
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
