import type { LucideIcon } from "lucide-react";
import {
  CircleHelp,
  FileText,
  Handshake,
  Mail,
  MessageCircle,
  Package,
  Phone,
  Play,
  TrendingUp,
  Truck,
  User,
  Users,
  Wallet,
  Wrench,
} from "lucide-react";

/**
 * FRONTEND MOCK DATA for the Help & Support page.
 * FAQs, categories, tickets, resources and the support-chat seed are kept in
 * typed structures so a real support/ticket API can replace them later.
 */

/* ------------------------------ Action cards ------------------------------- */

export interface ActionCardDef {
  key: "chat" | "ticket" | "call" | "videos";
  icon: LucideIcon;
  title: string;
  subtitle: string;
  cta: string;
  cardClass: string;
  iconClass: string;
  buttonClass: string;
}

export const SUPPORT_ACTION_CARDS: ActionCardDef[] = [
  {
    key: "chat",
    icon: MessageCircle,
    title: "Chat with Support",
    subtitle: "Get instant help from our team",
    cta: "Start Chat",
    cardClass: "border-[#BFE3C5] bg-[#F0FAF1]",
    iconClass: "bg-[#2E7D32] text-white",
    buttonClass: "bg-[#2E7D32] text-white hover:bg-[#256628]",
  },
  {
    key: "ticket",
    icon: Mail,
    title: "Raise a Ticket",
    subtitle: "Describe your issue in detail",
    cta: "Create Ticket",
    cardClass: "border-[#CBDCF2] bg-[#F3F8FD]",
    iconClass: "bg-[#1D6FB8] text-white",
    buttonClass: "bg-[#1D6FB8] text-white hover:bg-[#175c99]",
  },
  {
    key: "call",
    icon: Phone,
    title: "Call Support",
    subtitle: "Talk to our support executive",
    cta: "1800-123-5757",
    cardClass: "border-[#F0E2B8] bg-[#FDF8E9]",
    iconClass: "bg-[#E8A020] text-white",
    buttonClass: "bg-[#E8A020] text-white hover:bg-[#CC8B18]",
  },
  {
    key: "videos",
    icon: Play,
    title: "Watch Help Videos",
    subtitle: "Learn how to use the platform",
    cta: "View Tutorials",
    cardClass: "border-[#E3D3F4] bg-[#F7F2FD]",
    iconClass: "bg-[#7C3AED] text-white",
    buttonClass: "bg-[#7C3AED] text-white hover:bg-[#682ec9]",
  },
];

/* ---------------------------------- FAQs ----------------------------------- */

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export const FAQS: FAQ[] = [
  {
    id: "f1",
    question: "How do I add a new crop lot?",
    answer:
      "Go to My Crop Lots from the sidebar and click “+ Create New Lot”. Fill in the crop name, quantity, quality grade, harvest date and expected price, then choose whether to publish it immediately or save it as a draft. You can edit the lot anytime.",
  },
  {
    id: "f2",
    question: "How are market prices updated?",
    answer:
      "Mandi prices are refreshed daily from market data across nearby mandis. Open Market Prices, select your crop, state and district, and click Get Prices to see the latest min/max/average rates, trends and historical data.",
  },
  {
    id: "f3",
    question: "How do I accept or reject a buyer's offer?",
    answer:
      "Open Offers from the sidebar. Every pending offer shows Accept, Counter and Reject buttons. Accepting confirms the deal, Counter lets you quote a better price to the buyer, and Reject closes that offer.",
  },
  {
    id: "f4",
    question: "When will I receive payment?",
    answer:
      "Payments are released after the order is delivered and the buyer confirms quality. Settlements usually reach your linked bank account within 24 hours. You can track every settlement on the Earnings page.",
  },
  {
    id: "f5",
    question: "How can I track my order?",
    answer:
      "Go to Orders & Tracking and select your order. You will see a stage-by-stage timeline (confirmed, pickup, transit, delivered) along with the live location panel for orders currently in transit.",
  },
  {
    id: "f6",
    question: "What if the buyer cancels the order?",
    answer:
      "If a buyer cancels before pickup, the order is marked Cancelled and no payment is processed. Your remaining produce stays listed, so other interested buyers can still make offers on it.",
  },
  {
    id: "f7",
    question: "How do I contact my FPO?",
    answer:
      "FPO & Group features are rolling out progressively. Till then, you can reach your FPO through the group contact shared at registration, or call our support team and we will connect you.",
  },
  {
    id: "f8",
    question: "Is there any charge for using KrishiLink AI?",
    answer:
      "KisanSetu is free for farmers during the launch period — listing lots, checking prices and closing deals have no service fee. Any future charges will be clearly communicated in advance.",
  },
];

/* ----------------------------- Support categories --------------------------- */

export interface SupportCategory {
  id: string;
  title: string;
  desc: string;
  icon: LucideIcon;
  tone: string;
}

export const SUPPORT_CATEGORIES: SupportCategory[] = [
  { id: "account", title: "Account & Profile", desc: "Login, KYC, update details", icon: User, tone: "bg-sky-100 text-sky-700" },
  { id: "lots", title: "Crop Lots", desc: "Add, edit, delete lots", icon: Package, tone: "bg-[#EAF6EA] text-[#2E7D32]" },
  { id: "prices", title: "Market Prices", desc: "Price related queries", icon: TrendingUp, tone: "bg-amber-100 text-amber-700" },
  { id: "offers", title: "Offers & Negotiations", desc: "Accept, reject, counter offers", icon: Handshake, tone: "bg-[#DCEAF7] text-[#1D6FB8]" },
  { id: "orders", title: "Orders & Tracking", desc: "Delivery, tracking, logistics", icon: Truck, tone: "bg-violet-100 text-violet-700" },
  { id: "payments", title: "Payments", desc: "Payment status, settlements", icon: Wallet, tone: "bg-emerald-100 text-emerald-700" },
  { id: "fpo", title: "FPO & Group", desc: "Join, create, manage FPO", icon: Users, tone: "bg-rose-100 text-rose-600" },
  { id: "technical", title: "Technical Issues", desc: "App or website problems", icon: Wrench, tone: "bg-slate-100 text-slate-600" },
  { id: "others", title: "Others", desc: "Any other help", icon: CircleHelp, tone: "bg-[#F0E2B8] text-[#C08A18]" },
];

/* ------------------------------ Support tickets ----------------------------- */

export type TicketStatus = "open" | "in_progress" | "resolved";

export interface SupportTicket {
  id: string;
  subject: string;
  category: string;
  status: TicketStatus;
  createdOn: string;
  lastUpdated: string;
  description: string;
  agentNote: string;
}

export const TICKET_STATUS_META: Record<TicketStatus, { label: string; cls: string }> = {
  open: { label: "Open", cls: "bg-red-50 text-red-600" },
  in_progress: { label: "In Progress", cls: "bg-sky-100 text-sky-700" },
  resolved: { label: "Resolved", cls: "bg-[#EAF6EA] text-[#2E7D32]" },
};

export const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: "#TK250526001",
    subject: "Cannot add crop lot",
    category: "Crop Lots",
    status: "open",
    createdOn: "25 May 2025",
    lastUpdated: "25 May 2025, 11:20 AM",
    description: "Getting an error while publishing a tomato lot. The form shows a validation message even after filling every field.",
    agentNote: "Ticket created automatically with the error log attached. Our team will review the lot form within 4 hours.",
  },
  {
    id: "#TK250520014",
    subject: "Payment not received",
    category: "Payments",
    status: "in_progress",
    createdOn: "20 May 2025",
    lastUpdated: "23 May 2025, 04:10 PM",
    description: "Order ORD2505150423 was delivered on 18 May but settlement has not reached my SBI account yet.",
    agentNote: "Payment batch is being verified with the bank. Expected credit within 24 hours — we have your bank details on file.",
  },
  {
    id: "#TK250515009",
    subject: "Price not updating",
    category: "Market Prices",
    status: "resolved",
    createdOn: "15 May 2025",
    lastUpdated: "16 May 2025, 10:05 AM",
    description: "Tomato price for Nashik showed yesterday's value on the dashboard card.",
    agentNote: "Resolved — the daily feed was refreshed and the correct ₹22.30/kg rate is now visible.",
  },
  {
    id: "#TK250510007",
    subject: "Login issue",
    category: "Account",
    status: "resolved",
    createdOn: "10 May 2025",
    lastUpdated: "10 May 2025, 03:30 PM",
    description: "OTP was not arriving on my registered mobile number.",
    agentNote: "Resolved — number was re-verified and OTP delivery restored. Marked the mobile route as healthy.",
  },
];

/* ------------------------------ Support chat -------------------------------- */

export interface ChatMsg {
  id: string;
  role: "agent" | "user";
  text: string;
  time: string;
}

export const SUPPORT_CHAT_AGENT = {
  name: "Priya Sharma",
  role: "Support Executive",
  initials: "PS",
};

export const SUPPORT_CHAT_SEED: ChatMsg[] = [
  { id: "c1", role: "agent", text: "Hello Ramesh ji! 👋\nHow can I help you today?", time: "10:24 AM" },
  { id: "c2", role: "user", text: "I am facing an issue while adding\nmy crop lot. It is showing an error.", time: "10:26 AM" },
  { id: "c3", role: "agent", text: "Sure! I'll be happy to assist you.\nCan you please share a screenshot\nof the error?", time: "10:27 AM" },
];

export function supportAutoReply(userText: string): string {
  const t = userText.toLowerCase();
  if (t.includes("lot") || t.includes("crop") || t.includes("error")) {
    return "Thanks for sharing that! I can see the issue now.\nPlease try saving the lot as a **Draft** once — I have also forwarded this to our technical team and they will fix it shortly.";
  }
  if (t.includes("payment") || t.includes("paisa") || t.includes("money")) {
    return "I understand payment matters are important.\nPlease share your Order ID and I will check the settlement status with our payments team right away.";
  }
  return "Thank you for the details!\nI have noted this down. If it is urgent, you can also **Raise a Ticket** — our team responds within a few hours.";
}

/* ------------------------------- Resources --------------------------------- */

export interface SupportResource {
  id: string;
  icon: LucideIcon;
  title: string;
  desc: string;
  action: "download" | "tutorials" | "forum";
}

export const SUPPORT_RESOURCES: SupportResource[] = [
  { id: "r1", icon: FileText, title: "User Guide (PDF)", desc: "Download complete user manual", action: "download" },
  { id: "r2", icon: Play, title: "Video Tutorials", desc: "Step-by-step guidance", action: "tutorials" },
  { id: "r3", icon: Users, title: "Community Forum", desc: "Ask questions and connect with other farmers", action: "forum" },
];

/* ------------------------------- Tutorials ---------------------------------- */

export const TUTORIAL_VIDEOS = [
  { id: "v1", title: "Getting started with KisanSetu", duration: "4:32" },
  { id: "v2", title: "How to list your first crop lot", duration: "6:10" },
  { id: "v3", title: "Reading mandi prices & predictions", duration: "5:45" },
  { id: "v4", title: "Accepting offers & tracking orders", duration: "7:20" },
];
