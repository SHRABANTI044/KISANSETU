import { Leaf } from "lucide-react";

export default function RelatedQuestions({
  questions,
  onPick,
}: {
  questions: string[];
  onPick: (question: string) => void;
}) {
  return (
    <div className="animate-pop-in ml-[46px] max-w-[640px]">
      <p className="flex items-center gap-2 text-[11.5px] font-bold text-[#2E7D32]">
        <Leaf className="h-3.5 w-3.5" strokeWidth={2.2} />
        Related questions you can ask:
      </p>
      <div className="mt-2.5 flex flex-wrap gap-2">
        {questions.map((question) => (
          <button
            key={question}
            type="button"
            onClick={() => onPick(question)}
            className="rounded-full border border-[#D8DED8] bg-white px-3.5 py-1.5 text-[11.5px] font-semibold text-[#4A5548] transition-all duration-150 hover:border-[#2E7D32] hover:bg-[#EAF6EA] hover:text-[#2E7D32]"
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  );
}
