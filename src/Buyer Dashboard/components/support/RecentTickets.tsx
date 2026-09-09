import { useState } from "react";
import { EllipsisVertical } from "lucide-react";
import { SUPPORT_TICKETS, TICKET_BADGE } from "../../data/supportData";
import type { SupportTicket } from "../../data/supportData";

/** "My Recent Support Tickets" list with per-row three-dot menu. */
export default function RecentTickets() {
  const [menuFor, setMenuFor] = useState<string | null>(null);

  return (
    <div className="rounded-2xl border border-[#E4EDE4] bg-white p-5 shadow-[0_10px_24px_-16px_rgba(17,17,17,0.18)]">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-[15px] font-bold text-[#111111]">My Recent Support Tickets</h3>
        <button type="button" className="text-[12px] font-semibold text-[#2E7D32] hover:underline">
          View All →
        </button>
      </div>

      <div className="mt-3 divide-y divide-[#EFF4EF]">
        {SUPPORT_TICKETS.map((t: SupportTicket) => (
          <div key={t.id} className="flex items-center gap-3 py-3">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-[12.5px] font-bold text-[#111111]">{t.id}</p>
                <span className={`inline-flex rounded-full px-2 py-0.5 text-[10.5px] font-semibold ${TICKET_BADGE[t.status]}`}>{t.status}</span>
              </div>
              <p className="mt-0.5 truncate text-[12px] text-[#3E5B47]">{t.issue}</p>
              <p className="text-[11px] text-[#9AA79A]">{t.date}</p>
            </div>
            <div className="relative">
              <button
                type="button"
                aria-label={`Actions for ticket ${t.id}`}
                onClick={() => setMenuFor(menuFor === t.id ? null : t.id)}
                className="grid h-8 w-8 place-items-center rounded-lg text-[#666666] hover:bg-[#F3FAF3] hover:text-[#2E7D32]"
              >
                <EllipsisVertical className="h-4 w-4" strokeWidth={2.2} />
              </button>
              {menuFor === t.id && (
                <div className="absolute right-0 z-20 mt-1 w-[150px] overflow-hidden rounded-xl border border-[#E4EDE4] bg-white py-1 shadow-lg">
                  {["View ticket", "Add comment", "Close ticket"].map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => setMenuFor(null)}
                      className="block w-full px-3.5 py-2 text-left text-[12px] text-[#3E5B47] hover:bg-[#F3FAF3]"
                    >
                      {a}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
