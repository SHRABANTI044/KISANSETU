import type { LucideIcon } from "lucide-react";
import {
  BrainCircuit,
  ChartColumn,
  ChartLine,
  CircleHelp,
  Handshake,
  IndianRupee,
  LayoutDashboard,
  Settings,
  Sprout,
  Truck,
  UserCheck,
  Users,
  Wallet,
} from "lucide-react";

/**
 * FRONTEND MOCK DATA for the Farmer Dashboard.
 * Everything below is demo content kept in typed structures so real APIs
 * (market prices, weather, buyers, AI predictions) can drop in later
 * without reshaping the UI.
 */

/* ------------------------------- Sidebar ---------------------------------- */

export interface SidebarItem {
  label: string;
  to: string;
  icon: LucideIcon;
}

/** Exactly ten items — per the approved feature list. */
export const FARMER_SIDEBAR_ITEMS: SidebarItem[] = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "My Crop Lots", to: "/dashboard/crop-lots", icon: Sprout },
  { label: "Market Prices", to: "/dashboard/market-prices", icon: ChartColumn },
  { label: "Buyers", to: "/dashboard/buyers", icon: Users },
  { label: "AI Advisor", to: "/dashboard/ai-advisor", icon: BrainCircuit },
  { label: "Deals & Offers", to: "/dashboard/offers", icon: Handshake },
  { label: "Orders & Shipments", to: "/dashboard/orders", icon: Truck },
  { label: "Earnings", to: "/dashboard/earnings", icon: Wallet },
  { label: "Support", to: "/dashboard/help-support", icon: CircleHelp },
  { label: "Settings", to: "/dashboard/settings", icon: Settings },
];

/* ------------------------------ Header mock ------------------------------- */

export interface HeaderUser {
  name: string;
  role: string;
  initials: string;
  notifications: number;
}

export interface WeatherInfo {
  temp: string;
  city: string;
}

export const FARMER_USER: HeaderUser = {
  name: "Ramesh Kumar",
  role: "Farmer",
  initials: "RK",
  notifications: 3,
};

export const WEATHER: WeatherInfo = { temp: "28°C", city: "Kolkata" };

/* ----------------------------- Summary cards ------------------------------ */

export interface SummaryMetric {
  id: string;
  label: string;
  value: string;
  supporting: string;
  trend: "up" | "neutral";
  icon: LucideIcon;
}

export const SUMMARY_METRICS: SummaryMetric[] = [
  {
    id: "lots",
    label: "Active Crop Lots",
    value: "4",
    supporting: "2 new this week",
    trend: "neutral",
    icon: Sprout,
  },
  {
    id: "return",
    label: "Expected Net Return",
    value: "₹18,450",
    supporting: "↑ 12% vs last month",
    trend: "up",
    icon: IndianRupee,
  },
  {
    id: "ai",
    label: "AI Recommendation",
    value: "Sell Soon",
    supporting: "For your selected crop",
    trend: "neutral",
    icon: BrainCircuit,
  },
  {
    id: "buyers",
    label: "Interested Buyers",
    value: "7",
    supporting: "For your crop lots",
    trend: "neutral",
    icon: Users,
  },
];

/* --------------------------- Market price graph --------------------------- */

export interface MarketPricePoint {
  label: string;
  price: number;
}

export interface MarketOverview {
  title: string;
  crop: string;
  avgLabel: string;
  avgValue: string;
  avgUnit: string;
  change: string;
  range: string;
}

export const MARKET_OVERVIEW: MarketOverview = {
  title: "Market Price Overview",
  crop: "Paddy - Common",
  avgLabel: "Mandi Avg Price",
  avgValue: "₹2,080",
  avgUnit: "/quintal",
  change: "↑ 2.6% vs yesterday",
  range: "7 Days",
};

/** Mock — replaced by the market data API later. */
export const MARKET_PRICE_SERIES: MarketPricePoint[] = [
  { label: "19 May", price: 1780 },
  { label: "20 May", price: 1950 },
  { label: "21 May", price: 2120 },
  { label: "22 May", price: 1940 },
  { label: "23 May", price: 2030 },
  { label: "24 May", price: 2150 },
  { label: "25 May", price: 2080 },
];

/* ------------------------------- AI advisor ------------------------------- */

export interface AIRecommendation {
  recommendation: string;
  description: string;
  predictedPrice: string;
  market: string;
  marketPrice: string;
  netReturn: string;
}

/** Mock AI insight — NOT a live ML prediction. */
export const AI_ADVISOR: AIRecommendation = {
  recommendation: "Recommendation: Sell Soon",
  description:
    "Market prices are showing a positive trend. Consider monitoring prices closely before selling.",
  predictedPrice: "₹2,150 – ₹2,220 /quintal",
  market: "Burdwan Mandi",
  marketPrice: "₹2,205 /quintal",
  netReturn: "₹4,850",
};

/* ------------------------------ Activity ---------------------------------- */

export interface ActivityItem {
  id: string;
  text: string;
  timeAgo: string;
  icon: LucideIcon;
}

export const RECENT_ACTIVITIES: ActivityItem[] = [
  {
    id: "a1",
    text: "Buyer AgriFoods Ltd. showed interest in your lot",
    timeAgo: "10 min ago",
    icon: UserCheck,
  },
  {
    id: "a2",
    text: "Price updated in Burdwan Mandi",
    timeAgo: "1 hr ago",
    icon: ChartLine,
  },
  {
    id: "a3",
    text: "Your lot 'Paddy - Common' is live now",
    timeAgo: "3 hr ago",
    icon: Sprout,
  },
  {
    id: "a4",
    text: "New offer received for Wheat",
    timeAgo: "5 hr ago",
    icon: Handshake,
  },
];

/* ------------------------------- Crop lots -------------------------------- */

export interface CropLot {
  id: string;
  name: string;
  lotId: string;
  quantity: string;
  quality: string;
  status: "Live" | "Negotiation";
  interestedBuyers: number;
  initials: string;
  tone: string;
}

export const CROP_LOTS: CropLot[] = [
  {
    id: "cl1001",
    name: "Paddy - Common",
    lotId: "CL1001",
    quantity: "50 Quintal",
    quality: "Good",
    status: "Live",
    interestedBuyers: 3,
    initials: "PA",
    tone: "bg-emerald-100 text-emerald-700",
  },
  {
    id: "cl1002",
    name: "Wheat",
    lotId: "CL1002",
    quantity: "100 Quintal",
    quality: "Good",
    status: "Live",
    interestedBuyers: 2,
    initials: "WH",
    tone: "bg-amber-100 text-amber-700",
  },
  {
    id: "cl1003",
    name: "Maize",
    lotId: "CL1003",
    quantity: "80 Quintal",
    quality: "Average",
    status: "Live",
    interestedBuyers: 1,
    initials: "MA",
    tone: "bg-sky-100 text-sky-700",
  },
  {
    id: "cl1004",
    name: "Moong Dal",
    lotId: "CL1004",
    quantity: "20 Quintal",
    quality: "Premium",
    status: "Negotiation",
    interestedBuyers: 1,
    initials: "MD",
    tone: "bg-violet-100 text-violet-700",
  },
];

/* -------------------------------- Buyers ---------------------------------- */

export interface Buyer {
  id: string;
  name: string;
  location: string;
  rating: number;
  initials: string;
}

export const TOP_BUYERS: Buyer[] = [
  { id: "b1", name: "AgriFoods Ltd.", location: "Kolkata, WB", rating: 4.8, initials: "AF" },
  { id: "b2", name: "Green Harvest Pvt. Ltd.", location: "Burdwan, WB", rating: 4.6, initials: "GH" },
  { id: "b3", name: "FreshMart Retail", location: "Howrah, WB", rating: 4.5, initials: "FM" },
];

/* -------------------------------- Greeting -------------------------------- */

export const GREETING = {
  title: "Welcome back, Ramesh!",
  subtitle: "Here's what's happening in your market today.",
};
