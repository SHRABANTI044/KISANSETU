import { Mail, MessageCircle, MessageSquare, Phone } from "lucide-react";
import { QUICK_CHANNELS } from "../../data/supportData";
import type { QuickChannel } from "../../data/supportData";

const ICONS: Record<string, typeof Phone> = {
  chat: MessageCircle,
  call: Phone,
  email: Mail,
  whatsapp: MessageSquare,
};

/** Right-side "Quick Support" 2x2 channel grid. */
export default function QuickSupport({ onAction }: { onAction: (c: QuickChannel) => void }) {
  return (
    <div className="rounded-2xl border border-[#E4EDE4] bg-white p-5 shadow-[0_10px_24px_-16px_rgba(17,17,17,0.18)]">
      <h3 className="font-display text-[15px] font-bold text-[#111111]">Quick Support</h3>
      <p className="mt-0.5 text-[11.5px] text-[#666666]">Get instant help through your preferred channel</p>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {QUICK_CHANNELS.map((c) => {
          const Icon = ICONS[c.id] ?? MessageCircle;
          return (
            <div key={c.id} className="rounded-xl border border-[#E4EDE4] bg-[#FBFDFB] p-4">
              <div className="flex items-start gap-3">
                <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${c.tone}`}>
                  <Icon className="h-4.5 w-4.5" strokeWidth={2} />
                </span>
                <div className="min-w-0">
                  <p className="text-[13px] font-bold text-[#111111]">{c.title}</p>
                  <p className="mt-0.5 truncate text-[11.5px] font-medium text-[#3E5B47]">{c.desc}</p>
                  {c.extra && <p className="mt-0.5 text-[11px] text-[#9AA79A]">{c.extra}</p>}
                </div>
              </div>
              <button
                type="button"
                onClick={() => onAction(c)}
                className="mt-3 inline-flex h-[32px] w-full items-center justify-center rounded-lg border-[1.5px] border-[#2E7D32] bg-white text-[11.5px] font-semibold text-[#2E7D32] transition-colors hover:bg-[#2E7D32] hover:text-white"
              >
                {c.button}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
