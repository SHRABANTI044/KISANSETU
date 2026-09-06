import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { CircleAlert, Clock, Mail, Play, X } from "lucide-react";
import type { SupportTicket } from "../../data/support";
import { TUTORIAL_VIDEOS } from "../../data/support";
import { cn } from "../../../utils/cn";

function ModalShell({
  title,
  onClose,
  children,
  wide = false,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  wide?: boolean;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/45 p-4 backdrop-blur-[2px] sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <div
        className={cn(
          "animate-pop-in max-h-[92dvh] w-full overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-7",
          wide ? "max-w-[540px]" : "max-w-[460px]"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-display text-[18px] font-bold text-[#111111]">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[#E1E5E1] text-[#666666] transition-colors hover:bg-[#EAF6EA] hover:text-[#2E7D32]"
          >
            <X className="h-[18px] w-[18px]" />
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}

/* ---------------------------- Create ticket -------------------------------- */

export interface NewTicketValues {
  subject: string;
  category: string;
  description: string;
  priority: string;
}

export function CreateTicketModal({
  categories,
  initialCategory,
  onClose,
  onSubmit,
}: {
  categories: string[];
  initialCategory?: string;
  onClose: () => void;
  onSubmit: (values: NewTicketValues) => void;
}) {
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState(initialCategory ?? categories[0]!);
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [error, setError] = useState("");

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) {
      setError("Please add a subject and a short description of your issue.");
      return;
    }
    onSubmit({ subject: subject.trim(), category, description: description.trim(), priority });
  };

  const inputCls =
    "h-[46px] w-full rounded-xl border border-[#E1E5E1] bg-[#FAFBFA] px-3.5 text-[13.5px] text-[#111111] transition-colors outline-none placeholder:text-[#999999] focus:border-[#2E7D32] focus:bg-white";
  const labelCls = "mb-1.5 block text-[12px] font-semibold text-[#111111]";

  return (
    <ModalShell title="Create Support Ticket" onClose={onClose} wide>
      <p className="-mt-1 text-[12.5px] text-[#666666]">Describe your issue — our team responds within a few hours.</p>
      <form onSubmit={submit} className="mt-4 flex flex-col gap-4">
        <div>
          <label htmlFor="ticket-subject" className={labelCls}>Subject</label>
          <input id="ticket-subject" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. Cannot add crop lot" className={inputCls} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="ticket-category" className={labelCls}>Category</label>
            <select id="ticket-category" value={category} onChange={(e) => setCategory(e.target.value)} className={inputCls}>
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="ticket-priority" className={labelCls}>Priority</label>
            <select id="ticket-priority" value={priority} onChange={(e) => setPriority(e.target.value)} className={inputCls}>
              {["Low", "Medium", "High"].map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="ticket-desc" className={labelCls}>Description</label>
          <textarea
            id="ticket-desc"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tell us what happened, what you expected, and any order/lot ID involved..."
            className="w-full resize-none rounded-xl border border-[#E1E5E1] bg-[#FAFBFA] px-3.5 py-3 text-[13.5px] text-[#111111] transition-colors outline-none placeholder:text-[#999999] focus:border-[#2E7D32] focus:bg-white"
          />
        </div>

        {error && (
          <p role="alert" className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2.5 text-[12.5px] font-medium text-red-600">
            <CircleAlert className="h-4 w-4 shrink-0" strokeWidth={2.2} />
            {error}
          </p>
        )}

        <div className="flex gap-3">
          <button type="button" onClick={onClose} className="inline-flex h-[46px] flex-1 items-center justify-center rounded-xl border-[1.5px] border-[#D8DED8] bg-white text-[13.5px] font-semibold text-[#444444] transition-colors hover:border-[#2E7D32]/50 hover:text-[#2E7D32]">
            Cancel
          </button>
          <button type="submit" className="inline-flex h-[46px] flex-1 items-center justify-center gap-2 rounded-xl bg-[#2E7D32] text-[13.5px] font-semibold text-white transition-colors hover:bg-[#256628]">
            <Mail className="h-4 w-4" strokeWidth={2.2} />
            Submit Ticket
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

/* ----------------------------- Ticket details ------------------------------ */

export function TicketDetailsModal({ ticket, onClose }: { ticket: SupportTicket; onClose: () => void }) {
  return (
    <ModalShell title="Ticket Details" onClose={onClose} wide>
      <div className="flex items-center justify-between gap-2 -mt-1">
        <span className="text-[13px] font-bold text-[#2E7D32]">{ticket.id}</span>
        <span className="rounded-full bg-[#F0FAF1] px-3 py-1 text-[11px] font-bold text-[#2E7D32]">{ticket.category}</span>
      </div>
      <h3 className="mt-3 font-display text-[16px] font-bold text-[#111111]">{ticket.subject}</h3>

      <dl className="mt-4 flex flex-col gap-2.5 border-y border-[#F0F3F0] py-4">
        <div className="flex items-baseline justify-between gap-3">
          <dt className="text-[12px] font-medium text-[#777777]">Created On</dt>
          <dd className="text-[12.5px] font-semibold text-[#111111]">{ticket.createdOn}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-3">
          <dt className="text-[12px] font-medium text-[#777777]">Last Updated</dt>
          <dd className="text-[12.5px] font-semibold text-[#111111]">{ticket.lastUpdated}</dd>
        </div>
      </dl>

      <div className="mt-4">
        <p className="text-[12px] font-bold text-[#111111]">Your Description</p>
        <p className="mt-1.5 rounded-xl bg-[#F7FAF7] px-4 py-3 text-[12.5px] leading-relaxed text-[#555555] ring-1 ring-[#E1E5E1]">
          {ticket.description}
        </p>
      </div>
      <div className="mt-3">
        <p className="text-[12px] font-bold text-[#111111]">Support Response</p>
        <p className="mt-1.5 rounded-xl border border-[#BFE3C5]/70 bg-[#F0FAF1] px-4 py-3 text-[12.5px] leading-relaxed font-medium text-[#155B32]">
          {ticket.agentNote}
        </p>
      </div>
    </ModalShell>
  );
}

/* ------------------------------- Tutorials ---------------------------------- */

export function TutorialsModal({ onClose, onPlay }: { onClose: () => void; onPlay: (title: string) => void }) {
  return (
    <ModalShell title="Video Tutorials" onClose={onClose} wide>
      <p className="-mt-1 text-[12.5px] text-[#666666]">Short step-by-step videos that cover the whole platform.</p>
      <ul className="mt-4 flex flex-col gap-3">
        {TUTORIAL_VIDEOS.map((video, i) => (
          <li key={video.id}>
            <button
              type="button"
              onClick={() => onPlay(video.title)}
              className="group flex w-full items-center gap-3.5 rounded-2xl border border-[#E1E5E1] bg-[#F7FAF7] px-4 py-3.5 text-left transition-all duration-200 hover:border-[#2E7D32]/40 hover:bg-[#F0FAF1]"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#2E7D32] text-white transition-transform duration-200 group-hover:scale-105">
                <Play className="h-4 w-4" fill="currentColor" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13px] font-semibold text-[#111111]">{i + 1}. {video.title}</span>
                <span className="mt-0.5 flex items-center gap-1 text-[11px] text-[#777777]">
                  <Clock className="h-3 w-3" /> {video.duration}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </ModalShell>
  );
}
