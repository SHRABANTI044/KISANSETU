/**
 * FRONTEND MOCK DATA — Buyer "Help & Support" page.
 * Purely frontend; later swap tickets for a Supabase `support_tickets` table.
 */

export interface SupportStat {
  id: string;
  title: string;
  value: string;
  desc: string;
  tone: string;
}

export const SUPPORT_STATS: SupportStat[] = [
  { id: "open", title: "Open Tickets", value: "2", desc: "Awaiting response", tone: "bg-sky-100 text-sky-700" },
  { id: "resolved", title: "Resolved Tickets", value: "12", desc: "This month", tone: "bg-[#EAF6EA] text-[#2E7D32]" },
  { id: "response", title: "Avg. Response Time", value: "< 12 hours", desc: "We respond quickly", tone: "bg-amber-100 text-amber-600" },
  { id: "csat", title: "Customer Satisfaction", value: "4.8 / 5", desc: "Based on 120+ reviews", tone: "bg-violet-100 text-violet-700" },
];

export interface HelpCategory {
  id: string;
  title: string;
  desc: string;
}

export const HELP_CATEGORIES: HelpCategory[] = [
  { id: "account", title: "Account & Profile", desc: "Registration, KYC, profile settings" },
  { id: "orders", title: "Buying & Orders", desc: "Order placement, payments, tracking" },
  { id: "transport", title: "Transport & Logistics", desc: "Shipment, delivery, logistics partners" },
  { id: "payments", title: "Payments & Refunds", desc: "Payment issues, refund status" },
  { id: "farmers", title: "Farmers & FPOs", desc: "Finding suppliers, verification" },
  { id: "market", title: "Market Information", desc: "Prices, trends, availability" },
  { id: "technical", title: "Technical Issues", desc: "App errors, features not working" },
  { id: "other", title: "Other Queries", desc: "Anything else? We're here to help" },
];

export interface Faq {
  q: string;
  a: string;
}

export const FAQS: Faq[] = [
  {
    q: "How do I place an order on KrishiLink AI?",
    a: "Browse crop lots from the Buyer Dashboard, open a lot, and click \"Place Order\" or send a requirement. The farmer confirms, you pay securely through the platform, and the order moves to tracking.",
  },
  {
    q: "What payment methods are available?",
    a: "We support UPI, net banking, debit/credit cards and bank transfers (NEFT/RTGS). Escrow-backed payments keep your money safe until delivery is confirmed.",
  },
  {
    q: "How can I track my order?",
    a: "Go to Orders & Tracking in your Buyer Dashboard. Every shipment shows live status, transport partner details and expected delivery date.",
  },
  {
    q: "How do I find verified farmers and FPOs?",
    a: "Open the Farmers page in your dashboard to browse KYC-verified farmers and FPOs with ratings, locations and produce history before you commit to a purchase.",
  },
  {
    q: "What if there is an issue with the delivered quality?",
    a: "Raise a dispute within 48 hours of delivery from the order page or contact support with photos of the consignment. Our team mediates and, if verified, arranges a refund or replacement.",
  },
];

export type TicketStatus = "In Progress" | "Resolved";

export interface SupportTicket {
  id: string;
  issue: string;
  status: TicketStatus;
  date: string;
}

export const SUPPORT_TICKETS: SupportTicket[] = [
  { id: "#TK2587", issue: "Payment not reflected", status: "In Progress", date: "24 May 2026" },
  { id: "#TK2410", issue: "Order tracking issue", status: "Resolved", date: "18 May 2026" },
  { id: "#TK2305", issue: "Need help with KYC", status: "Resolved", date: "10 May 2026" },
];

export const TICKET_BADGE: Record<TicketStatus, string> = {
  "In Progress": "bg-amber-100 text-amber-700",
  Resolved: "bg-[#EAF6EA] text-[#2E7D32]",
};

export interface QuickChannel {
  id: string;
  title: string;
  desc: string;
  extra?: string;
  button: string;
  tone: string;
}

export const QUICK_CHANNELS: QuickChannel[] = [
  { id: "chat", title: "Live Chat", desc: "Chat with our support team", button: "Start Chat", tone: "bg-sky-100 text-sky-700" },
  { id: "call", title: "Call Support", desc: "+91 1800 123 4567", extra: "Mon - Sat, 9 AM - 7 PM", button: "Call Now", tone: "bg-[#EAF6EA] text-[#2E7D32]" },
  { id: "email", title: "Email Support", desc: "support@krishilink.ai", extra: "We usually reply within 12 hours", button: "Send Email", tone: "bg-sky-100 text-sky-700" },
  { id: "whatsapp", title: "WhatsApp Support", desc: "+91 98765 43210", extra: "Quick assistance on WhatsApp", button: "Chat on WhatsApp", tone: "bg-[#EAF6EA] text-[#2E7D32]" },
];

export const SUPPORT_TABS = ["Get Help", "My Support Tickets", "FAQs", "Contact Us"] as const;
export type SupportTab = (typeof SUPPORT_TABS)[number];
