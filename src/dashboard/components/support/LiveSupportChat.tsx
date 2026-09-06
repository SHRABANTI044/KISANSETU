import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Paperclip, Send } from "lucide-react";
import type { ChatMsg } from "../../data/support";
import { SUPPORT_CHAT_AGENT, SUPPORT_CHAT_SEED, supportAutoReply } from "../../data/support";
import { getRegistration } from "../../../utils/authStore";
import { cn } from "../../../utils/cn";

function nowTime(): string {
  return new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
}

let seq = 100;
const nextId = () => `c${++seq}`;

export default function LiveSupportChat({ focusSignal }: { focusSignal: number }) {
  const [messages, setMessages] = useState<ChatMsg[]>(SUPPORT_CHAT_SEED);
  const [input, setInput] = useState("");
  const [agentTyping, setAgentTyping] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const firstName = (getRegistration()?.fullName || "Ramesh").trim().split(" ")[0];

  /* Focus the input when "Start Chat" is used */
  useEffect(() => {
    if (focusSignal > 0) inputRef.current?.focus();
  }, [focusSignal]);

  useEffect(() => {
    const list = listRef.current;
    if (list) list.scrollTo({ top: list.scrollHeight, behavior: "smooth" });
  }, [messages, agentTyping]);

  const send = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || agentTyping) return;
    setMessages((prev) => [...prev, { id: nextId(), role: "user", text, time: nowTime() }]);
    setInput("");
    setAgentTyping(true);
    window.setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: nextId(),
          role: "agent",
          text: supportAutoReply(text),
          time: nowTime(),
        },
      ]);
      setAgentTyping(false);
    }, 1400);
  };

  return (
    <section
      aria-label="Live support chat"
      className="flex h-[540px] flex-col overflow-hidden rounded-2xl border border-[#E1E5E1] bg-white shadow-[0_10px_30px_-18px_rgba(17,17,17,0.12)] xl:sticky xl:top-[92px] xl:h-[calc(100dvh-108px)] xl:max-h-[620px]"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-[#E1E5E1] px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="grid h-[42px] w-[42px] shrink-0 place-items-center rounded-full bg-[#2E7D32] font-display text-[12.5px] font-bold text-white">
            {SUPPORT_CHAT_AGENT.initials}
          </span>
          <div>
            <h2 className="font-display text-[15px] font-semibold text-[#111111]">Live Support Chat</h2>
            <p className="text-[11.5px] text-[#777777]">
              {SUPPORT_CHAT_AGENT.name} · {SUPPORT_CHAT_AGENT.role}
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EAF6EA] px-3 py-1 text-[10.5px] font-bold text-[#2E7D32]">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#2E7D32]" aria-hidden="true" />
          Online
        </span>
      </div>

      {/* Messages */}
      <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-5">
        <div className="flex flex-col gap-4">
          {messages.map((message) => {
            const isUser = message.role === "user";
            return (
              <div key={message.id} className={cn("flex items-end gap-2.5", isUser && "flex-row-reverse")}>
                {!isUser && (
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#2E7D32] text-[10px] font-bold text-white">
                    {SUPPORT_CHAT_AGENT.initials}
                  </span>
                )}
                <div className={cn("flex max-w-[82%] flex-col", isUser && "items-end")}>
                  <div
                    className={cn(
                      "whitespace-pre-line rounded-2xl px-3.5 py-2.5 text-[12.5px] leading-relaxed",
                      isUser
                        ? "rounded-br-md bg-[#2E7D32] text-white"
                        : "rounded-bl-md border border-[#E7EEE7] bg-[#F4F8F4] text-[#111111]"
                    )}
                  >
                    {message.text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
                      part.startsWith("**") ? (
                        <strong key={i} className="font-bold">{part.slice(2, -2)}</strong>
                      ) : (
                        <span key={i}>{part}</span>
                      )
                    )}
                  </div>
                  <span className="mt-1 px-1 text-[10px] font-medium text-[#999999]">{message.time}</span>
                </div>
              </div>
            );
          })}

          {agentTyping && (
            <div className="flex items-end gap-2.5">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#2E7D32] text-[10px] font-bold text-white">
                {SUPPORT_CHAT_AGENT.initials}
              </span>
              <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-[#E7EEE7] bg-[#F4F8F4] px-4 py-3">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#2E7D32]" style={{ animationDelay: `${i * 180}ms` }} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <form onSubmit={send} className="flex items-center gap-2.5 border-t border-[#E1E5E1] bg-white px-4 py-3.5">
        <button type="button" aria-label="Attach a file (coming soon)" title="Attachments — coming soon" className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-[#E1E5E1] text-[#8A938A] transition-colors hover:text-[#2E7D32]">
          <Paperclip className="h-4 w-4" strokeWidth={2} />
        </button>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Type your message${firstName ? "" : ""}...`}
          aria-label="Type your message"
          className="h-[44px] min-w-0 flex-1 rounded-xl border border-[#E1E5E1] bg-[#FAFBFA] px-3.5 text-[13px] text-[#111111] transition-colors outline-none placeholder:text-[#999999] focus:border-[#2E7D32] focus:bg-white"
        />
        <button type="submit" aria-label="Send message" className="grid h-[44px] w-[44px] shrink-0 place-items-center rounded-xl bg-[#2E7D32] text-white transition-all duration-200 hover:bg-[#256628]">
          <Send className="h-[17px] w-[17px]" strokeWidth={2.2} />
        </button>
      </form>
    </section>
  );
}
