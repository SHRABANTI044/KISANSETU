import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck,
  Bot,
  ChartColumn,
  ChartLine,
  CircleCheckBig,
  ClipboardList,
  Handshake,
  IndianRupee,
  Leaf,
  MapPinned,
  Package,
  PackageCheck,
  ShoppingBasket,
  Store,
  Target,
  Truck,
  UserCheck,
  UserPlus,
  Users,
  Wallet,
} from "lucide-react";

/* ---------------------------------- Nav ---------------------------------- */

export interface SectionLink {
  label: string;
  /** id of the landing-page section to smooth-scroll to */
  id: string;
}

/** Landing-page anchor navigation (order shown in the navbar). */
export const SECTION_LINKS: SectionLink[] = [
{ label: "Home", id: "home" },
  { label: "How It Works", id: "how-it-works" },
  { label: "Features", id: "features" },
  { label: "About Us", id: "about" },
  { label: "Contact", id: "contact" },
];

export const TAGLINE = "Connecting Farmers to Better Markets";

/* ------------------------- Price search panel data ------------------------ */

export const PRODUCE_OPTIONS = [
  "Onion",
  "Tomato",
  "Potato",
  "Wheat",
  "Rice",
  "Cabbage",
  "Maize",
  "Cotton",
  "Sugarcane",
];

export const LOCATION_OPTIONS = [
  "Maharashtra",
  "Nashik",
  "Pune",
  "Mumbai",
  "Nagpur",
  "Sinnar",
  "Lasalgaon",
];

/* ------------------------------- Hero features ---------------------------- */

export interface IconTextItem {
  icon: LucideIcon;
  title: string;
  desc: string;
}

export const HERO_FEATURES: IconTextItem[] = [
  {
    icon: ChartColumn,
    title: "Market Prices\n& Trends",
    desc: "Check real-time prices\nand market trends",
  },
  {
    icon: Users,
    title: "Connect with\nBuyers",
    desc: "Find verified buyers\nacross regions",
  },
  {
    icon: Handshake,
    title: "Transparent\nDeals",
    desc: "Negotiate and close\ndeals with trust",
  },
  {
    icon: Truck,
    title: "Track Orders\n& Payments",
    desc: "Track orders, delivery\nand payments",
  },
];

/* --------------------------------- Stats ---------------------------------- */

export interface StatItem {
  icon: LucideIcon;
  value: string;
  label: string;
}

/** Demo / showcase statistics — not live production data. */
export const STATS: StatItem[] = [
  { icon: Users, value: "25K+", label: "Farmers Joined" },
  { icon: ShoppingBasket, value: "15K+", label: "Buyers Connected" },
  { icon: Leaf, value: "100+", label: "Crops Listed" },
  { icon: Handshake, value: "50K+", label: "Deals Completed" },
  { icon: IndianRupee, value: "120Cr+", label: "Worth of Produce Sold" },
];

/* ---------------------------- Market prices demo --------------------------- */

export interface PriceRow {
  crop: string;
  market: string;
  price: string;
  unit: string;
  change: string;
  up: boolean;
  dot: string;
}

/** Illustrative demo rows for the landing-page price card. */
export const PRICE_ROWS: PriceRow[] = [
  { crop: "Onion", market: "Lasalgaon, Nashik", price: "₹1,850", unit: "/q", change: "+4.2%", up: true, dot: "bg-violet-500" },
  { crop: "Tomato", market: "Pune APMC", price: "₹1,340", unit: "/q", change: "-1.1%", up: false, dot: "bg-red-500" },
  { crop: "Potato", market: "Mumbai (Vashi)", price: "₹1,120", unit: "/q", change: "+2.4%", up: true, dot: "bg-amber-500" },
  { crop: "Wheat", market: "Nagpur APMC", price: "₹2,275", unit: "/q", change: "+0.8%", up: true, dot: "bg-yellow-600" },
  { crop: "Rice", market: "Sinnar", price: "₹3,050", unit: "/q", change: "-0.6%", up: false, dot: "bg-emerald-600" },
];

/** Sparkline points (0–100 scale) for the demo trend graph. */
export const PRICE_SPARK = [34, 41, 37, 48, 44, 56, 50, 62, 58, 71];

export const MARKET_PRICE_POINTS = [
  "Check current market prices for your crop",
  "Compare prices across markets near you",
  "View historical and seasonal price trends",
  "See predicted prices to time your sale better",
  "Identify potentially better selling opportunities",
];

/* --------------------------------- Buyers --------------------------------- */

export const FARMER_BUYER_POINTS = [
  "Discover buyers actively looking for your crop",
  "See buyer requirements, quantities and offered prices",
  "Compare multiple offers side by side",
  "Contact suitable buyers directly — no middlemen",
];

export const BUYER_BUYER_POINTS = [
  "Post purchase requirements in a few minutes",
  "Specify crop, quantity, quality and delivery location",
  "Get matched with farmers who fit your needs",
  "Track conversations, deals and orders in one place",
];

export interface BuyerRequest {
  name: string;
  location: string;
  crop: string;
  quantity: string;
  quality: string;
  offer: string;
}

/** Illustrative demo buyer requirements. */
export const BUYER_REQUESTS: BuyerRequest[] = [
  {
    name: "Sahyadri Agro Traders",
    location: "Nashik, Maharashtra",
    crop: "Onion (Nashik Red)",
    quantity: "120 quintal",
    quality: "Grade A",
    offer: "₹1,900 / quintal",
  },
  {
    name: "FreshMart Retail Chain",
    location: "Pune, Maharashtra",
    crop: "Tomato (Hybrid)",
    quantity: "80 quintal",
    quality: "Grade A / B",
    offer: "₹1,450 / quintal",
  },
  {
    name: "Annapurna Grains Co.",
    location: "Mumbai, Maharashtra",
    crop: "Wheat (Lokwan)",
    quantity: "200 quintal",
    quality: "FAQ",
    offer: "₹2,350 / quintal",
  },
];

/* -------------------------------- Dashboard ------------------------------- */

export interface DashTile {
  icon: LucideIcon;
  value: string;
  label: string;
}

export const FARMER_DASH_TILES: DashTile[] = [
  { icon: ChartLine, value: "₹1,850/q", label: "Onion · Lasalgaon today" },
  { icon: MapPinned, value: "3 mandis", label: "Recommended markets" },
  { icon: Users, value: "12 buyers", label: "Recommended buyers" },
  { icon: Package, value: "5 lots", label: "Listed produce" },
  { icon: Truck, value: "2 active", label: "Orders in transit" },
  { icon: Wallet, value: "₹46,300", label: "Earnings this season" },
];

export const BUYER_DASH_TILES: DashTile[] = [
  { icon: ClipboardList, value: "4 open", label: "Purchase requirements" },
  { icon: Store, value: "28 lots", label: "Available produce" },
  { icon: Users, value: "16 farmers", label: "Farmer connections" },
  { icon: Truck, value: "3 active", label: "Active orders" },
  { icon: BadgeCheck, value: "21 done", label: "Completed deals" },
  { icon: IndianRupee, value: "₹1.2L", label: "Transactions this month" },
];

/* --------------------------------- Orders --------------------------------- */

export interface StepItem {
  icon: LucideIcon;
  title: string;
  desc: string;
}

export const ORDER_STAGES: StepItem[] = [
  { icon: PackageCheck, title: "Produce Listed", desc: "Farmer lists produce with quantity and quality details." },
  { icon: UserCheck, title: "Buyer Matched", desc: "A suitable buyer sends an offer for the listing." },
  { icon: Handshake, title: "Deal Confirmed", desc: "Both sides agree on the price and terms." },
  { icon: Truck, title: "Pickup / Delivery", desc: "Produce is picked up or delivered as scheduled." },
  { icon: Wallet, title: "Payment", desc: "Payment is made through recorded channels." },
  { icon: CircleCheckBig, title: "Completed", desc: "Order is closed with a clear digital record." },
];

/* ------------------------------- How it works ----------------------------- */

export interface HowStep {
  num: string;
  icon: LucideIcon;
  title: string;
  desc: string;
}

export const HOW_IT_WORKS: HowStep[] = [
  { num: "01", icon: UserPlus, title: "Create Account", desc: "Choose whether you are a Farmer or Buyer and create your account." },
  { num: "02", icon: ClipboardList, title: "Complete Your Profile", desc: "Add your personal, farm or business information and relevant preferences." },
  { num: "03", icon: ChartLine, title: "Get Market & Buyer Insights", desc: "Farmers can explore market prices, trends, predictions and suitable buyers." },
  { num: "04", icon: Store, title: "List Produce / Post Requirements", desc: "Farmers list their produce while buyers can post what they need." },
  { num: "05", icon: Users, title: "Get Matched", desc: "Connect suitable farmers and buyers based on crop, quantity, location and requirements." },
  { num: "06", icon: Handshake, title: "Negotiate & Confirm", desc: "Discuss the deal and confirm the order." },
  { num: "07", icon: Truck, title: "Track Order & Payment", desc: "Track the order, delivery and payment status." },
];

/* ----------------------------- Smart features ----------------------------- */

export const SMART_FEATURES: StepItem[] = [
  {
    icon: ChartLine,
    title: "AI Price Prediction",
    desc: "Estimates future market prices from historical agricultural market data and machine learning. Predictions are estimates, not guarantees.",
  },
  {
    icon: MapPinned,
    title: "Market Recommendation",
    desc: "Highlights potentially better markets by comparing predicted prices, distance and estimated transport costs.",
  },
  {
    icon: Target,
    title: "Buyer-Farmer Matching",
    desc: "Connects suitable farmers and buyers based on crop, quantity, location and price requirements.",
  },
  {
    icon: Bot,
    title: "KisanSetu AI Assistant",
    desc: "Get help understanding market information, KisanSetu features and agricultural marketplace processes through an AI-powered assistant.",
  },
];

/* --------------------------------- Footer --------------------------------- */

export interface FooterLink {
  label: string;
  to: string;
}

export const FOOTER_QUICK_LINKS: FooterLink[] = [
  { label: "Home", to: "/" },
  { label: "Market Prices", to: "/market-prices" },
  { label: "Buyers", to: "/buyers" },
 { label: "Sell Produce", to: "/dashboard/crop-lots" },  
  { label: "Orders", to: "/dashboard/orders" },        
  { label: "About Us", to: "/about" },
];

export const FOOTER_FARMER_LINKS: FooterLink[] = [
  { label: "Farmer Registration", to: "/register" },
    { label: "Sell Produce", to: "/dashboard/crop-lots" },
  { label: "Market Prices", to: "/market-prices" },
  { label: "My Dashboard", to: "/dashboard" },
];

export const FOOTER_BUYER_LINKS: FooterLink[] = [
  { label: "Buyer Registration", to: "/register" },
  { label: "Find Produce", to: "/market-prices" },
  { label: "My Requirements", to: "/buyers" },
   { label: "Orders", to: "/dashboard/orders" }, 
];
