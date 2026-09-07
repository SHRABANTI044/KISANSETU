import { Bot, CheckCheck } from "lucide-react";
import type { ChatMessage as ChatMessageType } from "../../data/aiAdvisor";
import { cn } from "../../../utils/cn";

/** Renders `**bold**` segments as <strong>, keeps line breaks. */
function RichText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <span className="whitespace-pre-line">
      {parts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={i} className="font-bold">
            {part.slice(2, -2)}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
}

export function AIAvatar() {
  return (
    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#2E7D32] text-white shadow-[0_8px_16px_-6px_rgba(46,125,50,0.5)]">
      <Bot className="h-[18px] w-[18px]" strokeWidth={2} />
    </span>
  );
}

export default function ChatMessage({ message }: { message: ChatMessageType }) {
  const isUser = message.role === "user";

  return (
    <div className={cn("animate-pop-in flex items-end gap-2.5", isUser && "flex-row-reverse")}>
      {!isUser && <AIAvatar />}
      <div className={cn("flex max-w-[85%] flex-col sm:max-w-[70%]", isUser && "items-end")}>
        <div
          className={cn(
            "rounded-2xl px-4 py-3 text-[13px] leading-relaxed shadow-[0_6px_18px_-10px_rgba(17,17,17,0.15)]",
            isUser
              ? "rounded-br-md bg-[#2E7D32] text-white"
              : "rounded-bl-md border border-[#E7EEE7] bg-[#F4F8F4] text-[#111111]"
          )}
        >
          <RichText text={message.text} />
        </div>
        <div className={cn("mt-1.5 flex items-center gap-1.5 px-1", isUser && "flex-row-reverse")}>
          <span className="text-[10.5px] font-medium text-[#999999]">{message.time}</span>
          {isUser && <CheckCheck className="h-3.5 w-3.5 text-[#2E7D32]" strokeWidth={2.2} aria-label="Read" />}
        </div>
      </div>
    </div>
  );
}
