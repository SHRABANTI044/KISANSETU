import { useState } from "react";
import { ArrowRight, Minus, Plus } from "lucide-react";
import type { FAQ } from "../../data/support";
import { cn } from "../../../utils/cn";

function FAQRow({ faq, open, onToggle }: { faq: FAQ; open: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-[#F0F3F0] last:border-0">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 py-4 text-left transition-colors hover:text-[#2E7D32]"
      >
        <span className={cn("text-[13.5px] font-semibold", open ? "text-[#2E7D32]" : "text-[#111111]")}>
          {faq.question}
        </span>
        <span
          className={cn(
            "grid h-7 w-7 shrink-0 place-items-center rounded-full transition-colors",
            open ? "bg-[#2E7D32] text-white" : "bg-[#EAF6EA] text-[#2E7D32]"
          )}
        >
          {open ? <Minus className="h-4 w-4" strokeWidth={2.4} /> : <Plus className="h-4 w-4" strokeWidth={2.4} />}
        </span>
      </button>
      {open && (
        <p className="animate-pop-in pr-10 pb-4 text-[12.5px] leading-relaxed text-[#555555]">{faq.answer}</p>
      )}
    </div>
  );
}

export default function FAQSection({ faqs, query }: { faqs: FAQ[]; query: string }) {
  const [openId, setOpenId] = useState<string | null>("f1");

  return (
    <section className="rounded-2xl border border-[#E1E5E1] bg-white p-5 shadow-[0_10px_30px_-18px_rgba(17,17,17,0.12)] sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-[16.5px] font-semibold text-[#111111]">Frequently Asked Questions</h2>
        <a href="#" onClick={(e) => e.preventDefault()} className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-[#2E7D32] transition-colors hover:text-[#155B32]">
          View All FAQs <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.4} />
        </a>
      </div>

      {faqs.length === 0 ? (
        <p className="mt-6 rounded-xl border border-dashed border-[#D8DED8] bg-[#FAFBFA] px-4 py-8 text-center text-[12.5px] text-[#777777]">
          No FAQs match &ldquo;{query}&rdquo;. Try a different keyword or ask in the live chat.
        </p>
      ) : (
        <div className="mt-2">
          {faqs.map((faq) => (
            <FAQRow key={faq.id} faq={faq} open={openId === faq.id} onToggle={() => setOpenId((id) => (id === faq.id ? null : faq.id))} />
          ))}
        </div>
      )}
    </section>
  );
}
