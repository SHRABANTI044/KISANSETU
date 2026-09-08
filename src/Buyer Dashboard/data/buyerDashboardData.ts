import type { LucideIcon } from "lucide-react";
import {
  ClipboardList,
  CreditCard,
  Handshake,
  Headphones,
  Home,
  Leaf,
  Package,
  Sparkles,
  Truck,
  Users,
} from "lucide-react";

/**
 * FRONTEND MOCK DATA — Buyer Dashboard home.
 * Typed structures map 1:1 to future Supabase/PostgreSQL tables.
 */

export interface BuyerIdentity {
  name: string;
  firstName: string;
  location: string;
  state: string;
  role: string;
  initials: string;
  verified: boolean;
}

export const BUYER: BuyerIdentity = {
  name: "Priya Das",
  firstName: "Priya",
  location: "Kolkata",
  state: "West Bengal",
  role: "Buyer",
  initials: "PD",
  verified: true,
};

export const BUYER_WEATHER = { temp: "28°C", city: "Kolkata" };
export const BUYER_NOTIFICATIONS = 5;

export interface BuyerSidebarItem {
  label: string;
  to: string;
  icon: LucideIcon;
}

/** Exactly eight buyer features, in the approved order. */
export const BUYER_SIDEBAR_ITEMS: BuyerSidebarItem[] = [
  { label: "Dashboard", to: "/buyer/dashboard", icon: Home },
  { label: "My Requirements", to: "/buyer/requirements", icon: ClipboardList },
  { label: "Farmers", to: "/buyer/farmers", icon: Users },
  {
    label: "Offers & Negotiations",
    to: "/buyer/offers-negotiations",
    icon: Handshake,
  },
  { label: "Orders & Tracking", to: "/buyer/orders-tracking", icon: Package },
  { label: "Payments", to: "/buyer/payments", icon: CreditCard },
  { label: "Transport & Logistics", to: "/buyer/transport-logistics", icon: Truck },
  { label: "Help & Support", to: "/buyer/help-support", icon: Headphones },
];

export interface BuyerDashboardStat {
  id: string;
  label: string;
  value: string;
  supporting: string;
  tone: "green" | "blue" | "amber" | "violet";
  icon: LucideIcon;
}

export const BUYER_SUMMARY_STATS: BuyerDashboardStat[] = [
  { id: "rfqs", label: "Active RFQs", value: "3", supporting: "1 new response", tone: "green", icon: ClipboardList },
  { id: "orders", label: "Ongoing Orders", value: "5", supporting: "2 in transit", tone: "blue", icon: Package },
  { id: "procurement", label: "Total Procurement", value: "₹1,25,000", supporting: "↑ 18% vs last month", tone: "amber", icon: CreditCard },
  { id: "suppliers", label: "Saved Suppliers", value: "12", supporting: "Trusted farmers", tone: "violet", icon: Users },
];

export const TONE_STYLES: Record<BuyerDashboardStat["tone"], string> = {
  green: "bg-[#EAF6EA] text-[#2E7D32]",
  blue: "bg-sky-100 text-sky-700",
  amber: "bg-amber-100 text-amber-700",
  violet: "bg-violet-100 text-violet-700",
};

export interface PricePoint {
  label: string;
  price: number;
}

export interface MarketTrendInfo {
  crop: string;
  avgPrice: string;
  avgUnit: string;
  change: string;
}

export const MARKET_TREND_INFO: MarketTrendInfo = {
  crop: "Paddy - Common",
  avgPrice: "₹2,183",
  avgUnit: "/quintal",
  change: "↑ 2.6% vs last week",
};

export const PRICE_SERIES: Record<"7d" | "15d" | "30d", PricePoint[]> = {
  "7d": [
    { label: "19 May", price: 1780 },
    { label: "20 May", price: 2120 },
    { label: "21 May", price: 1950 },
    { label: "22 May", price: 2080 },
    { label: "23 May", price: 1920 },
    { label: "24 May", price: 2220 },
    { label: "25 May", price: 2050 },
  ],
  "15d": [
    { label: "11 May", price: 1650 },
    { label: "13 May", price: 1710 },
    { label: "15 May", price: 1690 },
    { label: "17 May", price: 1800 },
    { label: "19 May", price: 1780 },
    { label: "21 May", price: 1950 },
    { label: "23 May", price: 1920 },
    { label: "25 May", price: 2050 },
  ],
  "30d": [
    { label: "26 Apr", price: 1520 },
    { label: "31 Apr", price: 1580 },
    { label: "05 May", price: 1620 },
    { label: "10 May", price: 1660 },
    { label: "15 May", price: 1690 },
    { label: "20 May", price: 1900 },
    { label: "25 May", price: 2050 },
  ],
};

export const PRICE_RANGES = [
  { key: "7d", label: "7 Days" },
  { key: "15d", label: "15 Days" },
  { key: "30d", label: "30 Days" },
] as const;

export interface BuyerAIRecommendation {
  recommendation: string;
  note: string;
  rangeLabel: string;
  range: string;
}

/** Frontend mock — replaced by the real procurement/ML service later. */
export const BUYER_AI_ADVISOR: BuyerAIRecommendation = {
  recommendation: "Recommendation: Buy Now",
  note: "Prices are likely to remain stable for the next 3–5 days. Good time to place bulk orders.",
  rangeLabel: "Expected Price Range (Next 7 Days)",
  range: "₹2,150 – ₹2,220 /quintal",
};

export interface RecentActivityItem {
  id: string;
  text: string;
  timeAgo: string;
  icon: LucideIcon;
}

export const BUYER_ACTIVITIES: RecentActivityItem[] = [
  { id: "a1", text: "New offer received from Ramesh Kumar", timeAgo: "10 min ago", icon: Handshake },
  { id: "a2", text: "RFQ sent for Wheat (100 quintal)", timeAgo: "1 hr ago", icon: ClipboardList },
  { id: "a3", text: "Order #KL2587 is in transit", timeAgo: "5 hrs ago", icon: Truck },
  { id: "a4", text: "Payment of ₹45,000 completed", timeAgo: "1 day ago", icon: CreditCard },
  { id: "a5", text: "Supplier AgriFoods Ltd. accepted your offer", timeAgo: "1 day ago", icon: Sparkles },
];

export interface RecommendedLot {
  id: string;
  crop: string;
  variety: string;
  quantity: string;
  pricePerQuintal: number;
  farmer: string;
  location: string;
  rating: number;
}

export const RECOMMENDED_LOTS: RecommendedLot[] = [
  { id: "l1", crop: "Paddy", variety: "Common", quantity: "50 Quintal", pricePerQuintal: 2180, farmer: "Ramesh Kumar", location: "Burdwan, WB", rating: 4.8 },
  { id: "l2", crop: "Wheat", variety: "Lokwan", quantity: "100 Quintal", pricePerQuintal: 1950, farmer: "Sita Devi", location: "Nadia, WB", rating: 4.6 },
  { id: "l3", crop: "Maize", variety: "Hybrid", quantity: "80 Quintal", pricePerQuintal: 1720, farmer: "Arjun Mondal", location: "Hooghly, WB", rating: 4.5 },
  { id: "l4", crop: "Moong Dal", variety: "Premium", quantity: "40 Quintal", pricePerQuintal: 5200, farmer: "Rahul Yadav", location: "Patna, BR", rating: 4.4 },
  { id: "l5", crop: "Potato", variety: "Local", quantity: "200 Quintal", pricePerQuintal: 1060, farmer: "Sunita Pradhan", location: "Purulia, WB", rating: 4.3 },
];

export interface Supplier {
  id: string;
  name: string;
  location: string;
  rating: number;
  deals: number;
  initials: string;
  tone: string;
}

export const TOP_SUPPLIERS: Supplier[] = [
  { id: "s1", name: "Ramesh Kumar", location: "Burdwan, WB", rating: 4.8, deals: 23, initials: "RK", tone: "bg-[#EAF6EA] text-[#2E7D32]" },
  { id: "s2", name: "Green Harvest Pvt. Ltd.", location: "Nadia, WB", rating: 4.6, deals: 18, initials: "GH", tone: "bg-emerald-100 text-emerald-700" },
  { id: "s3", name: "AgriFoods Ltd.", location: "Kolkata, WB", rating: 4.5, deals: 31, initials: "AF", tone: "bg-sky-100 text-sky-700" },
  { id: "s4", name: "FreshMart Retail", location: "Howrah, WB", rating: 4.4, deals: 12, initials: "FM", tone: "bg-violet-100 text-violet-700" },
];

export const BUYER_GREETING = {
  title: `Welcome back, ${BUYER.firstName}!`,
  subtitle: "Find quality crops, connect with trusted farmers, and build a better supply chain.",
  badgeLine1: "Good Food",
  badgeLine2: "Stronger Communities",
  badgeIcon: Leaf,
};
