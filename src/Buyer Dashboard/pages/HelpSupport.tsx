import { useState } from "react";
import { CheckCircle2, Clock3, Headphones, Leaf, MessageSquare, Send, Star, Users, X } from "lucide-react";
import BuyerDashboardLayout from "../layouts/BuyerDashboardLayout";
import HelpCategories from "../components/support/HelpCategories";
import QuickSupport from "../components/support/QuickSupport";
import FaqAccordion from "../components/support/FaqAccordion";
import RecentTickets from "../components/support/RecentTickets";
import { SUPPORT_STATS, SUPPORT_TABS } from "../data/supportData";
import type { HelpCategory, QuickChannel, SupportTab } from "../data/supportData";

const STAT_ICONS = [MessageSquare, CheckCircle2, Clock3, Users];

/**
 * /buyer/help-support — Buyer Help & Support.
 * Tabs, category picker, quick-support channels, FAQ accordion,
 * recent tickets and feedback — all frontend mock interactions.
 */
export default function HelpSupport() {
  const [tab, setTab] = useState<SupportTab>("Get Help");
  const [toast, setToast] = useState<string | null>(null);
  const [requestFor, setRequestFor] = useState<HelpCategory | null>(null);
  const [requestText, setRequestText] = useState("");

  const notify = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 3200);
  };

  const onQuickAction = (c: QuickChannel) => notify(`${c.button}: ${c.desc} — connecting you shortly (demo).`);

  return (
    <BuyerDashboardLayout>
      <div className="mx-auto w-full max-w-[1240px]">
        {/* Page header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#EAF6EA] text-[#2E7D32]">
              <Headphones className="h-6 w-6" strokeWidth={2} />
            </span>
            <div>
              <h1 className="font-display text-[24px] font-bold tracking-[-0.01em] text-[#111111] sm:text-[28px]">Help & Support</h1>
              <p className="mt-1 max-w-xl text-[13.5px] leading-relaxed text-[#666666]">
                We are here to help you. Get quick assistance, find answers, or raise a support request.
              </p>
            </div>
          </div>
          {/* Success banner */}
          <div className="relative overflow-hidden rounded-2xl bg-[#EAF6EA] px-5 py-4">
            <Leaf className="absolute -bottom-3 -right-2 h-16 w-16 rotate-12 text-[#CBE6CC]" strokeWidth={1.4} />
            <p className="text-[10.5px] font-semibold uppercase tracking-wide text-[#2E7D32]">Your Success</p>
            <p className="font-display text-[15px] font-bold leading-tight text-[#155B32]">Our Support</p>
            <p className="mt-0.5 text-[11px] font-medium text-[#3E5B47]">Stronger Agri Supply Chains</p>
          </div>
        </div>

        {/* Statistics */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {SUPPORT_STATS.map((s, i) => {
            const Icon = STAT_ICONS[i] ?? MessageSquare;
            return (
              <div key={s.id} className="rounded-2xl border border-[#E4EDE4] bg-white p-4 shadow-[0_10px_24px_-16px_rgba(17,17,17,0.18)]">
                <div className="flex items-center justify-between">
                  <p className="text-[12px] font-semibold uppercase tracking-wide text-[#666666]">{s.title}</p>
                  <span className={`grid h-9 w-9 place-items-center rounded-full ${s.tone}`}>
                    <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
                  </span>
                </div>
                <p className="mt-2 font-display text-[26px] font-bold leading-none text-[#111111]">{s.value}</p>
                <p className="mt-2 text-[12px] font-medium text-[#3E5B47]">{s.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="mt-6 flex gap-6 overflow-x-auto border-b border-[#E4EDE4]">
          {SUPPORT_TABS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`relative whitespace-nowrap pb-3 pt-1 text-[13px] font-semibold transition-colors ${
                tab === t ? "text-[#2E7D32]" : "text-[#666666] hover:text-[#3E5B47]"
              }`}
            >
              {t}
              {tab === t && <span className="absolute inset-x-0 -bottom-px h-[2.5px] rounded-full bg-[#2E7D32]" />}
            </button>
          ))}
        </div>
        {tab === "Get Help" && (
          <>
            <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,1fr)]">
              <HelpCategories onSelect={setRequestFor} />
              <QuickSupport onAction={onQuickAction} />
            </div>

            <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,1fr)]">
              <section className="rounded-2xl border border-[#E4EDE4] bg-white p-5 shadow-[0_10px_24px_-16px_rgba(17,17,17,0.18)]">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="font-display text-[18px] font-bold text-[#111111]">Frequently Asked Questions</h2>
                    <p className="mt-0.5 text-[12px] text-[#666666]">Find quick answers to common questions</p>
                  </div>
                  <button type="button" onClick={() => setTab("FAQs")} className="shrink-0 text-[12px] font-semibold text-[#2E7D32] hover:underline">
                    View All FAQs →
                  </button>
                </div>
                <div className="mt-4"><FaqAccordion /></div>
              </section>
              <div className="space-y-5">
                <RecentTickets />
                <section className="rounded-2xl border border-[#E5D9F8] bg-[#FAF7FF] p-5">
                  <div className="flex items-start gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#EDE2FF] text-[#7C3AED]"><Star className="h-5 w-5" /></span>
                    <div>
                      <h3 className="font-display text-[15px] font-bold text-[#29154F]">Help Us Improve</h3>
                      <p className="mt-1 text-[12px] leading-relaxed text-[#6B5A82]">Share your feedback about your experience.</p>
                    </div>
                  </div>
                  <button type="button" onClick={() => notify("Thanks for helping us improve KrishiLink AI!")} className="mt-4 inline-flex h-9 items-center gap-2 rounded-lg border border-[#8B5CF6] px-3.5 text-[12px] font-semibold text-[#7C3AED] transition-colors hover:bg-[#7C3AED] hover:text-white">
                    <Star className="h-3.5 w-3.5" /> Give Feedback
                  </button>
                </section>
              </div>
            </div>
          </>
        )}

        {tab === "My Support Tickets" && (
          <div className="mt-6 max-w-3xl"><RecentTickets /></div>
        )}

        {tab === "FAQs" && (
          <section className="mt-6 max-w-3xl rounded-2xl border border-[#E4EDE4] bg-white p-5 shadow-[0_10px_24px_-16px_rgba(17,17,17,0.18)]">
            <h2 className="font-display text-[18px] font-bold text-[#111111]">Frequently Asked Questions</h2>
            <p className="mt-0.5 text-[12px] text-[#666666]">Answers for common buyer questions</p>
            <div className="mt-4"><FaqAccordion /></div>
          </section>
        )}

        {tab === "Contact Us" && (
          <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(320px,1fr)]">
            <section className="rounded-2xl border border-[#E4EDE4] bg-white p-5 shadow-[0_10px_24px_-16px_rgba(17,17,17,0.18)]">
              <div className="flex items-start gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#EAF6EA] text-[#2E7D32]"><Send className="h-5 w-5" /></span>
                <div>
                  <h2 className="font-display text-[18px] font-bold text-[#111111]">Raise a support request</h2>
                  <p className="mt-0.5 text-[12px] text-[#666666]">Tell us what you need help with and our team will respond.</p>
                </div>
              </div>
              <button type="button" onClick={() => setRequestFor({ id: "contact", title: "General Support", desc: "Tell us how we can help" })} className="mt-5 rounded-lg bg-[#2E7D32] px-4 py-2.5 text-[12px] font-semibold text-white transition-colors hover:bg-[#246428]">Create support request</button>
            </section>
            <QuickSupport onAction={onQuickAction} />
          </div>
        )}
      </div>

      {requestFor && (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-black/35 p-4" role="dialog" aria-modal="true" aria-labelledby="support-request-title">
          <div className="w-full max-w-lg rounded-2xl border border-[#E4EDE4] bg-white p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[#2E7D32]">Support request</p>
                <h2 id="support-request-title" className="mt-1 font-display text-[20px] font-bold text-[#111111]">{requestFor.title}</h2>
                <p className="mt-1 text-[12px] text-[#666666]">{requestFor.desc}</p>
              </div>
              <button type="button" onClick={() => setRequestFor(null)} aria-label="Close support request" className="grid h-8 w-8 place-items-center rounded-lg text-[#666666] hover:bg-[#F3FAF3] hover:text-[#2E7D32]"><X className="h-4 w-4" /></button>
            </div>
            <textarea value={requestText} onChange={(e) => setRequestText(e.target.value)} rows={4} placeholder="Describe your issue or question..." className="mt-5 w-full resize-none rounded-xl border border-[#E1E5E1] bg-[#F7FAF7] p-3 text-[13px] outline-none placeholder:text-[#999999] focus:border-[#2E7D32] focus:bg-white" />
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" onClick={() => setRequestFor(null)} className="rounded-lg px-3.5 py-2 text-[12px] font-semibold text-[#666666] hover:bg-[#F3FAF3]">Cancel</button>
              <button type="button" onClick={() => { setRequestFor(null); setRequestText(""); notify("Your support request has been saved for our team."); }} className="rounded-lg bg-[#2E7D32] px-3.5 py-2 text-[12px] font-semibold text-white hover:bg-[#246428]">Submit request</button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed right-4 bottom-4 z-[80] rounded-xl bg-[#155B32] px-4 py-3 text-[12px] font-semibold text-white shadow-xl" role="status">{toast}</div>
      )}
    </BuyerDashboardLayout>
  );
}
