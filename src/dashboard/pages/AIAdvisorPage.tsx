import { useEffect, useMemo, useRef, useState } from "react";
import { Bot, Sprout } from "lucide-react";
import ChatInput from "../components/ai/ChatInput";
import ChatMessage from "../components/ai/ChatMessage";
import RelatedQuestions from "../components/ai/RelatedQuestions";
import SuggestionChips from "../components/ai/SuggestionChips";
import DashboardLayout from "../components/DashboardLayout";
import type { ChatMessage as ChatMessageType } from "../data/aiAdvisor";
import { nowTime, seedConversation, sendMessageToAI } from "../data/aiAdvisor";
import { getRegistration } from "../../utils/authStore";

let messageSeq = 100;
const nextId = () => `m${++messageSeq}`;

/** /ai-advisor — farmer AI chat assistant (frontend demo, backend-ready seam). */
export default function AIAdvisorPage() {
  /* Personalise with the registered farmer when available */
  const ctx = useMemo(() => {
    const reg = getRegistration();
    const fullName = reg?.fullName?.trim() || "Ramesh Patil";
    return { firstName: fullName.split(" ")[0] || "Ramesh", location: "Kothur, Ahmednagar" };
  }, []);

  const [messages, setMessages] = useState<ChatMessageType[]>(() => seedConversation(ctx.firstName));
  const [typing, setTyping] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);

  /* Auto-scroll to the newest message */
  useEffect(() => {
    const list = listRef.current;
    if (list) list.scrollTo({ top: list.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  /* Clean up pending timers on unmount */
  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || typing) return;

    setMessages((prev) => [...prev, { id: nextId(), role: "user", text: trimmed, time: nowTime() }]);
    setTyping(true);

    const timer = window.setTimeout(() => {
      const response = sendMessageToAI(trimmed, ctx);
      const aiMessage: ChatMessageType = {
        id: nextId(),
        role: "ai",
        text: response.text,
        time: nowTime(),
        related: response.related,
      };
      setMessages((prev) => [...prev, aiMessage]);
      setTyping(false);
    }, 1200);
    timers.current.push(timer);
  };

  return (
    <DashboardLayout>
      <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-5">
        {/* Page header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-[24px] font-bold tracking-[-0.01em] text-[#111111] sm:text-[28px]">
              KisanSetu AI Assistant
            </h1>
            <p className="mt-1 max-w-xl text-[13.5px] text-[#666666]">
              Ask anything about crops, market prices, weather, or farming practices. I&apos;m here
              to help!
            </p>
          </div>

          <div className="flex items-center gap-3.5 rounded-2xl border border-[#BFE3C5] bg-[#F0FAF1] px-5 py-3.5">
            <span className="grid h-[42px] w-[42px] shrink-0 place-items-center rounded-2xl bg-[#2E7D32] text-white">
              <Sprout className="h-[21px] w-[21px]" strokeWidth={2} />
            </span>
            <div>
              <p className="font-display text-[14px] font-bold text-[#155B32]">Powered by AI</p>
              <p className="mt-0.5 text-[11.5px] text-[#5B7A63]">Simple answers for a better tomorrow.</p>
            </div>
          </div>
        </div>

        {/* Chat panel */}
        <section
          aria-label="AI chat conversation"
          className="flex h-[calc(100dvh-300px)] min-h-[500px] flex-col overflow-hidden rounded-2xl border border-[#E1E5E1] bg-white shadow-[0_10px_30px_-18px_rgba(17,17,17,0.12)]"
        >
          {/* Conversation */}
          <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
            <div className="flex flex-col gap-5">
              {messages.map((message) => (
                <div key={message.id} className="flex flex-col gap-3">
                  <ChatMessage message={message} />
                  {message.showSuggestions && <SuggestionChips onPick={send} />}
                  {message.role === "ai" && message.related && message.related.length > 0 && (
                    <RelatedQuestions questions={message.related} onPick={send} />
                  )}
                </div>
              ))}

              {/* Typing indicator */}
              {typing && (
                <div className="animate-pop-in flex items-end gap-2.5">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#2E7D32] text-white">
                    <Bot className="h-[18px] w-[18px]" strokeWidth={2} />
                  </span>
                  <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-[#E7EEE7] bg-[#F4F8F4] px-4 py-3.5">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#2E7D32]"
                        style={{ animationDelay: `${i * 180}ms` }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Input (stays pinned at the bottom of the panel) */}
          <ChatInput onSend={send} />
        </section>

        <p className="-mt-2 text-center text-[11px] text-[#999999]">
          KisanSetu AI gives general guidance from demo data — verify important decisions with your
          local mandi or agriculture officer.
        </p>
      </div>

      {/* Screen-reader live region for new AI replies */}
      <span aria-live="polite" className="sr-only">
        {messages[messages.length - 1]?.role === "ai" ? "AI replied." : ""}
      </span>
    </DashboardLayout>
  );
}
