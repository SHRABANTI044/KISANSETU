import { ArrowRight, Eye } from "lucide-react";
import type { SupportTicket } from "../../data/support";
import { TICKET_STATUS_META } from "../../data/support";
import { cn } from "../../../utils/cn";

export default function SupportTickets({
  tickets,
  onView,
}: {
  tickets: SupportTicket[];
  onView: (ticket: SupportTicket) => void;
}) {
  return (
    <section className="rounded-2xl border border-[#E1E5E1] bg-white p-5 shadow-[0_10px_30px_-18px_rgba(17,17,17,0.12)] sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-[16.5px] font-semibold text-[#111111]">My Support Tickets</h2>
        <a href="#" onClick={(e) => e.preventDefault()} className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-[#2E7D32] transition-colors hover:text-[#155B32]">
          View All Tickets <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.4} />
        </a>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left">
          <thead>
            <tr className="border-b border-[#E1E5E1]">
              {["Ticket ID", "Subject", "Category", "Status", "Created On", "Action"].map((head) => (
                <th key={head} className="pb-2.5 pr-3 text-[10.5px] font-bold tracking-[0.08em] whitespace-nowrap text-[#999999] uppercase">
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id} className="border-b border-[#F0F3F0] last:border-0">
                <td className="py-3 pr-3 text-[12.5px] font-bold whitespace-nowrap text-[#2E7D32]">{ticket.id}</td>
                <td className="py-3 pr-3 text-[12.5px] font-semibold text-[#111111]">{ticket.subject}</td>
                <td className="py-3 pr-3 text-[12px] whitespace-nowrap text-[#666666]">{ticket.category}</td>
                <td className="py-3 pr-3">
                  <span className={cn("inline-flex rounded-full px-3 py-1 text-[10.5px] font-bold whitespace-nowrap", TICKET_STATUS_META[ticket.status].cls)}>
                    {TICKET_STATUS_META[ticket.status].label}
                  </span>
                </td>
                <td className="py-3 pr-3 text-[12px] whitespace-nowrap text-[#666666]">{ticket.createdOn}</td>
                <td className="py-3">
                  <button
                    type="button"
                    onClick={() => onView(ticket)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#CBDCF2] bg-[#F3F8FD] px-3 py-1.5 text-[11.5px] font-semibold whitespace-nowrap text-[#1D6FB8] transition-colors hover:bg-[#DCEAF7]"
                  >
                    <Eye className="h-3.5 w-3.5" strokeWidth={2.2} />
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
