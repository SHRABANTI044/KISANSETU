import type { LucideIcon } from "lucide-react";
import { Leaf, ShoppingCart, Sprout, Wheat } from "lucide-react";

/**
 * FRONTEND MOCK DATA for the Buyers page.
 * Typed structures keep the farmer → lots → interested-buyers relationship
 * explicit so the real API can swap in later without touching the UI.
 */

export type BuyerBadgeStatus = "new" | "offer_received" | "negotiation" | "interested" | "saved";

export interface InterestedBuyer {
  id: string;
  name: string;
  rating: number;
  deals: number;
  company: string;
  location: string;
  state: string;
  crop: string;
  lotId: string;
  offeredPrice: number; // ₹ per quintal
  quantityQuintal: number;
  interestDate: string;
  isoDate: string;
  status: BuyerBadgeStatus;
  icon: LucideIcon;
  tone: string;
  /* attribute flags — tabs are attribute-based per the reference counts */
  hasOffer: boolean;
  negotiating: boolean;
  converted: boolean;
  saved: boolean;
}

export const INITIAL_BUYERS: InterestedBuyer[] = [
  {
    id: "ib1", name: "AgriFoods Ltd.", rating: 4.8, deals: 23, company: "AgriFoods Ltd.",
    location: "Kolkata, WB", state: "West Bengal", crop: "Paddy", lotId: "CL1001",
    offeredPrice: 2200, quantityQuintal: 50, interestDate: "25 May 2026", isoDate: "2026-05-25",
    status: "new", icon: Sprout, tone: "bg-[#EAF6EA] text-[#2E7D32]",
    hasOffer: true, negotiating: false, converted: true, saved: false,
  },
  {
    id: "ib2", name: "Green Harvest Pvt. Ltd.", rating: 4.6, deals: 18, company: "Green Harvest Pvt. Ltd.",
    location: "Burdwan, WB", state: "West Bengal", crop: "Wheat", lotId: "CL1002",
    offeredPrice: 1950, quantityQuintal: 100, interestDate: "24 May 2026", isoDate: "2026-05-24",
    status: "offer_received", icon: Leaf, tone: "bg-emerald-50 text-emerald-700",
    hasOffer: true, negotiating: false, converted: true, saved: false,
  },
  {
    id: "ib3", name: "FreshMart Retail", rating: 4.5, deals: 12, company: "FreshMart Retail",
    location: "Howrah, WB", state: "West Bengal", crop: "Maize", lotId: "CL1003",
    offeredPrice: 1780, quantityQuintal: 80, interestDate: "24 May 2026", isoDate: "2026-05-24",
    status: "negotiation", icon: ShoppingCart, tone: "bg-amber-50 text-amber-600",
    hasOffer: true, negotiating: true, converted: false, saved: false,
  },
  {
    id: "ib4", name: "Sita Traders", rating: 4.4, deals: 9, company: "Sita Traders",
    location: "Nadia, WB", state: "West Bengal", crop: "Paddy", lotId: "CL1001",
    offeredPrice: 2100, quantityQuintal: 30, interestDate: "23 May 2026", isoDate: "2026-05-23",
    status: "interested", icon: Wheat, tone: "bg-violet-50 text-violet-700",
    hasOffer: true, negotiating: false, converted: false, saved: false,
  },
  {
    id: "ib5", name: "Eastern Grains Co.", rating: 4.3, deals: 7, company: "Eastern Grains Co.",
    location: "Patna, BR", state: "Bihar", crop: "Moong Dal", lotId: "CL1004",
    offeredPrice: 5000, quantityQuintal: 20, interestDate: "22 May 2026", isoDate: "2026-05-22",
    status: "offer_received", icon: Wheat, tone: "bg-teal-50 text-teal-700",
    hasOffer: true, negotiating: true, converted: true, saved: false,
  },
  {
    id: "ib6", name: "Nexus Agri Imports", rating: 4.2, deals: 5, company: "Nexus Agri Imports",
    location: "Guwahati, AS", state: "Assam", crop: "Paddy", lotId: "CL1001",
    offeredPrice: 2150, quantityQuintal: 40, interestDate: "21 May 2026", isoDate: "2026-05-21",
    status: "saved", icon: Leaf, tone: "bg-slate-100 text-slate-600",
    hasOffer: false, negotiating: false, converted: false, saved: true,
  },
  {
    id: "ib7", name: "Bharat Foods", rating: 4.1, deals: 3, company: "Bharat Foods",
    location: "Ranchi, JH", state: "Jharkhand", crop: "Wheat", lotId: "CL1002",
    offeredPrice: 1900, quantityQuintal: 60, interestDate: "20 May 2026", isoDate: "2026-05-20",
    status: "interested", icon: Wheat, tone: "bg-rose-50 text-rose-600",
    hasOffer: false, negotiating: false, converted: false, saved: false,
  },
];

/* ------------------------------ Status styles ------------------------------ */

export const BUYER_STATUS_META: Record<BuyerBadgeStatus, { label: string; cls: string }> = {
  new: { label: "New", cls: "bg-sky-100 text-sky-700" },
  offer_received: { label: "Offer Received", cls: "bg-[#EAF6EA] text-[#2E7D32]" },
  negotiation: { label: "Negotiation", cls: "bg-amber-100 text-amber-700" },
  interested: { label: "Interested", cls: "bg-violet-100 text-violet-700" },
  saved: { label: "Saved", cls: "bg-[#E8EAE8] text-[#666666]" },
};

/* ------------------------------- Stat cards -------------------------------- */

export interface BuyerStat {
  label: string;
  value: string;
  supporting: string;
  iconBox: string;
}

export const BUYER_STATS: BuyerStat[] = [
  {
    label: "Total Interested Buyers",
    value: "7",
    supporting: "↑ 2 new this week",
    iconBox: "bg-violet-100 text-violet-700",
  },
  {
    label: "Total Offers Received",
    value: "5",
    supporting: "↑ 25% vs last month",
    iconBox: "bg-[#DCEAF7] text-[#1D6FB8]",
  },
  {
    label: "Best Offer (Paddy)",
    value: "₹ 2,250 /quintal",
    supporting: "↑ 8% above market avg",
    iconBox: "bg-amber-100 text-amber-700",
  },
  {
    label: "Buyers from",
    value: "4",
    supporting: "States/UTs",
    iconBox: "bg-sky-100 text-sky-700",
  },
];

/* ------------------------------ Filter options ----------------------------- */

export const BUYER_CROPS = ["All Crops", "Paddy", "Wheat", "Maize", "Moong Dal"];
export const BUYER_LOCATIONS = ["All Locations", "Kolkata, WB", "Burdwan, WB", "Howrah, WB", "Nadia, WB", "Patna, BR", "Guwahati, AS", "Ranchi, JH"];
export const BUYER_OFFER_RANGES = ["Any Offer", "Under ₹2,000", "₹2,000 – ₹3,000", "Above ₹3,000"];

export function offerInRange(value: number, range: string): boolean {
  if (range === "Under ₹2,000") return value < 2000;
  if (range === "₹2,000 – ₹3,000") return value >= 2000 && value <= 3000;
  if (range === "Above ₹3,000") return value > 3000;
  return true;
}
