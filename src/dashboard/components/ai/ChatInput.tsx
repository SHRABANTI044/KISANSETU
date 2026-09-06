import { useState } from "react";
import type { FormEvent } from "react";
import { Paperclip, Send } from "lucide-react";

export default function ChatInput({ onSend }: { onSend: (text: string) => void }) {
  const [value, setValue] = useState("");

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = value.trim();
    if (!text) return;
    onSend(text);
    setValue("");
  };

  return (
    <form
      onSubmit={submit}
      className="flex items-center gap-3 border-t border-[#E1E5E1] bg-white px-4 py-4 sm:px-5"
    >
      <button
        type="button"
        aria-label="Attach a file (coming soon)"
        title="Attachments — coming soon"
        className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-[#E1E5E1] text-[#8A938A] transition-colors hover:border-[#2E7D32]/50 hover:text-[#2E7D32]"
      >
        <Paperclip className="h-[18px] w-[18px]" strokeWidth={2} />
      </button>

      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Type your question here..."
        aria-label="Type your question"
        className="h-[48px] min-w-0 flex-1 rounded-xl border border-[#E1E5E1] bg-[#FAFBFA] px-4 text-[14px] text-[#111111] transition-colors outline-none placeholder:text-[#999999] focus:border-[#2E7D32] focus:bg-white"
      />

      <button
        type="submit"
        aria-label="Send message"
        className="grid h-[48px] w-[48px] shrink-0 place-items-center rounded-xl bg-[#2E7D32] text-white shadow-[0_12px_24px_-10px_rgba(46,125,50,0.6)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#256628] active:translate-y-0"
      >
        <Send className="h-[19px] w-[19px]" strokeWidth={2.2} />
      </button>
    </form>
  );
}
