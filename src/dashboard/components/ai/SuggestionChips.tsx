import { Lightbulb } from "lucide-react";
import { SUGGESTED_QUESTIONS } from "../../data/aiAdvisor";

export default function SuggestionChips({ onPick }: { onPick: (question: string) => void }) {
  return (
    <div className="animate-pop-in ml-[46px] max-w-[640px] rounded-2xl border border-[#BFE3C5]/70 bg-[#F0FAF1] p-4">
      <p className="flex items-center gap-2 text-[12px] font-bold text-[#155B32]">
        <Lightbulb className="h-4 w-4 text-[#E8862D]" strokeWidth={2.2} />
        You can try asking:
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {SUGGESTED_QUESTIONS.map((question) => (
          <button
            key={question}
            type="button"
            onClick={() => onPick(question)}
            className="rounded-full border-[1.5px] border-[#2E7D32]/60 bg-white px-4 py-2 text-[12px] font-semibold text-[#2E7D32] transition-all duration-150 hover:-translate-y-0.5 hover:bg-[#2E7D32] hover:text-white hover:shadow-[0_8px_18px_-8px_rgba(46,125,50,0.5)]"
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  );
}
