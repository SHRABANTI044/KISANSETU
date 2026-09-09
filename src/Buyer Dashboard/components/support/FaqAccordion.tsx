import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { FAQS } from "../../data/supportData";

/** Expandable FAQ accordion. */
export default function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="space-y-2.5">
      {FAQS.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={f.q} className="overflow-hidden rounded-xl border border-[#E4EDE4] bg-white">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left"
            >
              <span className={`text-[13px] font-semibold ${isOpen ? "text-[#2E7D32]" : "text-[#111111]"}`}>{f.q}</span>
              <ChevronDown
                className={`h-4 w-4 shrink-0 text-[#666666] transition-transform duration-200 ${isOpen ? "rotate-180 text-[#2E7D32]" : ""}`}
                strokeWidth={2.2}
              />
            </button>
            {isOpen && <p className="border-t border-[#EFF4EF] px-4 py-3 text-[12.5px] leading-relaxed text-[#666666]">{f.a}</p>}
          </div>
        );
      })}
    </div>
  );
}
