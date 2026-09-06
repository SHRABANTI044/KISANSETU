import { useEffect, useMemo, useState } from "react";
import { ArrowRight, ChevronRight, Download, Headset, Phone, Search } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import FAQSection from "../components/support/FAQSection";
import LiveSupportChat from "../components/support/LiveSupportChat";
import SupportActionCards from "../components/support/SupportActionCards";
import SupportCategories from "../components/support/SupportCategories";
import {
  CreateTicketModal,
  TicketDetailsModal,
  TutorialsModal,
} from "../components/support/SupportModals";
import type { NewTicketValues } from "../components/support/SupportModals";
import SupportTickets from "../components/support/SupportTickets";
import type { SupportCategory, SupportTicket } from "../data/support";
import {
  FAQS,
  INITIAL_TICKETS,
  SUPPORT_CATEGORIES,
  SUPPORT_RESOURCES,
} from "../data/support";
import { cn } from "../../utils/cn";

function todayLabel(): string {
  return new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}
function nowStamp(): string {
  const d = new Date();
  return `${todayLabel()}, ${d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}`;
}

type ModalState =
  | { kind: "createTicket"; category?: string }
  | { kind: "ticket"; ticket: SupportTicket }
  | { kind: "tutorials" }
  | null;

let ticketSeq = 250529004;
const nextTicketId = () => `#TK${++ticketSeq}`;

export default function HelpSupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>(INITIAL_TICKETS);
  const [search, setSearch] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalState>(null);
  const [chatFocus, setChatFocus] = useState(0);
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(t);
  }, [toast]);

  /* ------------------------- Search-driven filtering ------------------------ */
  const q = search.trim().toLowerCase();
  const filteredFaqs = useMemo(
    () => (q ? FAQS.filter((f) => f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q)) : FAQS),
    [q]
  );
  const filteredCategories = useMemo(
    () =>
      q
        ? SUPPORT_CATEGORIES.filter(
            (c) => c.title.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q)
          )
        : SUPPORT_CATEGORIES,
    [q]
  );

  /* --------------------------------- Actions -------------------------------- */
  const handleActionCard = (key: "chat" | "ticket" | "call" | "videos") => {
    if (key === "chat") {
      setChatFocus((n) => n + 1);
      document.getElementById("live-support-chat")?.scrollIntoView({ behavior: "smooth", block: "center" });
      setToast("You're connected to Priya from support — say hello!");
    } else if (key === "ticket") {
      setModal({ kind: "createTicket", category: selectedCategoryId ? SUPPORT_CATEGORIES.find((c) => c.id === selectedCategoryId)?.title : undefined });
    } else if (key === "videos") {
      setModal({ kind: "tutorials" });
    }
  };

  const handleCategorySelect = (category: SupportCategory) => {
    setSelectedCategoryId((id) => (id === category.id ? null : category.id));
    setModal({ kind: "createTicket", category: category.title });
  };

  const handleResource = (action: "download" | "tutorials" | "forum", title: string) => {
    if (action === "download") {
      const blob = new Blob(
        ["KisanSetu User Guide\n======================\n\n1. Getting started\n2. List a crop lot\n3. Check market prices\n4. Accept an offer\n5. Track your order\n6. Receive payment\n\n(Full PDF will ship with the backend.)"],
        { type: "text/plain;charset=utf-8" }
      );
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "kisansetu-user-guide.txt";
      anchor.click();
      URL.revokeObjectURL(url);
      setToast("User guide downloaded.");
    } else if (action === "tutorials") {
      setModal({ kind: "tutorials" });
    } else {
      setToast(`"${title}" community forum — launching soon.`);
    }
  };

  const submitTicket = (values: NewTicketValues) => {
    const ticket: SupportTicket = {
      id: nextTicketId(),
      subject: values.subject,
      category: values.category,
      status: "open",
      createdOn: todayLabel(),
      lastUpdated: nowStamp(),
      description: values.description,
      agentNote: `Ticket received (priority: ${values.priority}). Our ${values.category} specialist will respond within a few hours.`,
    };
    setTickets((prev) => [ticket, ...prev]);
    setModal(null);
    setToast(`Ticket ${ticket.id} created — support will reach out soon.`);
  };

  /* --------------------------------- Render --------------------------------- */
  return (
    <DashboardLayout>
      <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-5 sm:gap-6">
        {/* Page header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-[24px] font-bold tracking-[-0.01em] text-[#111111] sm:text-[28px]">
              Help &amp; Support
            </h1>
            <p className="mt-1 max-w-xl text-[13.5px] text-[#666666]">
              We&apos;re here to help you. Get quick answers, raise a request, or talk to our support
              team.
            </p>
          </div>

          <div className="flex items-center gap-3.5 rounded-2xl border border-[#BFE3C5] bg-[#F0FAF1] px-5 py-3.5">
            <span className="grid h-[42px] w-[42px] shrink-0 place-items-center rounded-2xl bg-[#2E7D32] text-white">
              <Headset className="h-[21px] w-[21px]" strokeWidth={2} />
            </span>
            <div>
              <p className="font-display text-[14px] font-bold text-[#155B32]">Need immediate help?</p>
              <a href="tel:18001235757" className="mt-0.5 flex items-center gap-1.5 text-[12px] font-semibold text-[#2E7D32] transition-colors hover:text-[#155B32]">
                <Phone className="h-3.5 w-3.5" strokeWidth={2.2} />
                Call us at 1800-123-5757
              </a>
              <p className="text-[11px] text-[#5B7A63]">Available 24/7 in multiple languages</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-4 h-[18px] w-[18px] -translate-y-1/2 text-[#8A938A]" />
          <input
            type="search"
            aria-label="Search help topics"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for help, FAQs, or type your question..."
            className="h-[52px] w-full rounded-2xl border border-[#E1E5E1] bg-white pr-4 pl-12 text-[14px] text-[#111111] shadow-[0_10px_30px_-18px_rgba(17,17,17,0.12)] transition-colors outline-none placeholder:text-[#999999] focus:border-[#2E7D32]"
          />
        </div>

        {/* Four support action cards */}
        <SupportActionCards onAction={handleActionCard} />

        {/* Main content + right column */}
        <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
          {/* Left column */}
          <div className="flex min-w-0 flex-col gap-5">
            <FAQSection faqs={filteredFaqs} query={search} />
            <SupportTickets tickets={tickets} onView={(ticket) => setModal({ kind: "ticket", ticket })} />
          </div>

          {/* Right column */}
          <div className="flex min-w-0 flex-col gap-5">
            <SupportCategories categories={filteredCategories} selectedId={selectedCategoryId} onSelect={handleCategorySelect} />

            <div id="live-support-chat" className="scroll-mt-[100px]">
              <LiveSupportChat focusSignal={chatFocus} />
            </div>

            {/* Additional resources */}
            <section className="rounded-2xl border border-[#E1E5E1] bg-white p-5 shadow-[0_10px_30px_-18px_rgba(17,17,17,0.12)]">
              <h2 className="font-display text-[16.5px] font-semibold text-[#111111]">Additional Support Resources</h2>
              <ul className="mt-4 flex flex-col gap-3">
                {SUPPORT_RESOURCES.map((resource) => (
                  <li key={resource.id}>
                    <button
                      type="button"
                      onClick={() => handleResource(resource.action, resource.title)}
                      className="group flex w-full items-center gap-3.5 rounded-2xl border border-[#BFE3C5]/70 bg-[#F7FCF8] px-4 py-3.5 text-left transition-all duration-200 hover:border-[#2E7D32]/40 hover:bg-[#F0FAF1]"
                    >
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#EAF6EA] text-[#2E7D32]">
                        <resource.icon className="h-[19px] w-[19px]" strokeWidth={2} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13px] font-semibold text-[#111111]">{resource.title}</span>
                        <span className="mt-0.5 block truncate text-[11px] text-[#888888]">{resource.desc}</span>
                      </span>
                      {resource.action === "download" ? (
                        <Download className="h-4 w-4 shrink-0 text-[#2E7D32]" strokeWidth={2.2} />
                      ) : (
                        <ChevronRight className="h-4 w-4 shrink-0 text-[#2E7D32] transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={2.2} />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
              <a href="#" onClick={(e) => e.preventDefault()} className="mt-4 inline-flex items-center gap-1 text-[12.5px] font-semibold text-[#2E7D32] transition-colors hover:text-[#155B32]">
                Browse all resources <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.4} />
              </a>
            </section>
          </div>
        </div>
      </div>

      {/* Modals */}
      {modal?.kind === "createTicket" && (
        <CreateTicketModal
          categories={SUPPORT_CATEGORIES.map((c) => c.title)}
          initialCategory={modal.category}
          onClose={() => setModal(null)}
          onSubmit={submitTicket}
        />
      )}
      {modal?.kind === "ticket" && (
        <TicketDetailsModal ticket={modal.ticket} onClose={() => setModal(null)} />
      )}
      {modal?.kind === "tutorials" && (
        <TutorialsModal
          onClose={() => setModal(null)}
          onPlay={(title) => {
            setModal(null);
            setToast(`Playing “${title}” — videos launch with the help center.`);
          }}
        />
      )}

      {/* Toast */}
      {toast && (
        <p
          role="status"
          className={cn(
            "animate-pop-in fixed bottom-6 left-1/2 z-[90] max-w-[92vw] -translate-x-1/2 rounded-full",
            "bg-[#155B32] px-5 py-3 text-center text-[13px] font-medium text-white shadow-[0_16px_40px_-12px_rgba(0,0,0,0.4)]"
          )}
        >
          {toast}
        </p>
      )}
    </DashboardLayout>
  );
}
