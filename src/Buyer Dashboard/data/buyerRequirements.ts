import onionImg from "../../assets/images/lots/onion.jpg";
import potatoImg from "../../assets/images/lots/potato.jpg";

/**
 * FRONTEND MOCK DATA for the Buyer "My Requirements" page.
 * ONE requirements array derives everything (summary cards, tab counts,
 * table, search, filters). Later swapped for `buyer_requirements` rows via
 * GET /api/buyer/requirements — the UI reads only this module.
 */

export type RequirementStatus = "open" | "negotiation" | "fulfilled" | "closed";

export type CropKey = "paddy" | "wheat" | "maize" | "moong" | "potato" | "onion";

export interface BuyerRequirement {
  id: string;
  requirementId: string;
  cropKey: CropKey;
  cropName: string;
  variety: string;
  grade: string;
  quantity: number;
  unit: "Quintal" | "kg" | "tonne";
  minPrice: number;
  maxPrice: number;
  location: string;
  timeline: string;
  dueDateLabel: string;
  dueDateIso: string;
  offersCount: number;
  status: RequirementStatus;
  createdLabel: string;
  createdIso: string;
  description: string;
  image?: string;
}

export const REQUIREMENT_STATUS_META: Record<
  RequirementStatus,
  { label: string; badgeClass: string }
> = {
  open: { label: "Open", badgeClass: "bg-[#EAF6EA] text-[#2E7D32]" },
  negotiation: { label: "In Negotiation", badgeClass: "bg-amber-100 text-amber-700" },
  fulfilled: { label: "Fulfilled", badgeClass: "bg-sky-100 text-sky-700" },
  closed: { label: "Closed", badgeClass: "bg-[#E8EAE8] text-[#666666]" },
};

export const CROP_THUMB_STYLES: Record<CropKey, { tile: string; label: string }> = {
  paddy: { tile: "bg-amber-100 text-amber-700", label: "Paddy" },
  wheat: { tile: "bg-[#F0E2B8] text-[#C08A18]", label: "Wheat" },
  maize: { tile: "bg-[#DCEAF7] text-[#1D6FB8]", label: "Maize" },
  moong: { tile: "bg-emerald-100 text-emerald-700", label: "Moong" },
  potato: { tile: "bg-orange-100 text-orange-600", label: "Potato" },
  onion: { tile: "bg-violet-100 text-violet-700", label: "Onion" },
};

/** Initial requirements — exactly the reference dataset. */
export const INITIAL_REQUIREMENTS: BuyerRequirement[] = [
  {
    id: "r1",
    requirementId: "REQ001",
    cropKey: "paddy",
    cropName: "Paddy",
    variety: "Common",
    grade: "A",
    quantity: 100,
    unit: "Quintal",
    minPrice: 2000,
    maxPrice: 2200,
    location: "Kolkata, WB",
    timeline: "Within 15 days",
    dueDateLabel: "10 Jun 2026",
    dueDateIso: "2026-06-10",
    offersCount: 5,
    status: "open",
    createdLabel: "25 May 2026",
    createdIso: "2026-05-25",
    description: "Long-grain paddy, machine-dried, uniform moisture for wholesale supply.",
  },
  {
    id: "r2",
    requirementId: "REQ002",
    cropKey: "wheat",
    cropName: "Wheat",
    variety: "Lokwan",
    grade: "A",
    quantity: 200,
    unit: "Quintal",
    minPrice: 1800,
    maxPrice: 2000,
    location: "Nadia, WB",
    timeline: "Within 30 days",
    dueDateLabel: "24 Jun 2026",
    dueDateIso: "2026-06-24",
    offersCount: 3,
    status: "negotiation",
    createdLabel: "24 May 2026",
    createdIso: "2026-05-24",
    description: "Lokwan wheat for flour milling. Prefer low-admixture, clean lots.",
  },
  {
    id: "r3",
    requirementId: "REQ003",
    cropKey: "maize",
    cropName: "Maize",
    variety: "Hybrid",
    grade: "A",
    quantity: 150,
    unit: "Quintal",
    minPrice: 1600,
    maxPrice: 1800,
    location: "Hooghly, WB",
    timeline: "Within 20 days",
    dueDateLabel: "10 Jun 2026",
    dueDateIso: "2026-06-10",
    offersCount: 4,
    status: "open",
    createdLabel: "20 May 2026",
    createdIso: "2026-05-20",
    description: "Hybrid maize required with moisture below 12% for feed processing.",
  },
  {
    id: "r4",
    requirementId: "REQ004",
    cropKey: "moong",
    cropName: "Moong Dal",
    variety: "Premium",
    grade: "A",
    quantity: 50,
    unit: "Quintal",
    minPrice: 5000,
    maxPrice: 5500,
    location: "Patna, BR",
    timeline: "Within 25 days",
    dueDateLabel: "12 Jun 2026",
    dueDateIso: "2026-06-12",
    offersCount: 2,
    status: "negotiation",
    createdLabel: "18 May 2026",
    createdIso: "2026-05-18",
    description: "Premium moong dal with clean sorting — organic preferred.",
  },
  {
    id: "r5",
    requirementId: "REQ005",
    cropKey: "potato",
    cropName: "Potato",
    variety: "Local",
    grade: "A",
    quantity: 300,
    unit: "Quintal",
    minPrice: 900,
    maxPrice: 1100,
    location: "Purulia, WB",
    timeline: "Within 10 days",
    dueDateLabel: "25 May 2026",
    dueDateIso: "2026-05-25",
    offersCount: 6,
    status: "fulfilled",
    createdLabel: "15 May 2026",
    createdIso: "2026-05-15",
    description: "Cold-stored potato, uniform medium size for retail packs.",
    image: potatoImg,
  },
  {
    id: "r6",
    requirementId: "REQ006",
    cropKey: "onion",
    cropName: "Onion",
    variety: "Red",
    grade: "A",
    quantity: 100,
    unit: "Quintal",
    minPrice: 1200,
    maxPrice: 1400,
    location: "Burdwan, WB",
    timeline: "Within 20 days",
    dueDateLabel: "30 May 2026",
    dueDateIso: "2026-05-30",
    offersCount: 0,
    status: "open",
    createdLabel: "10 May 2026",
    createdIso: "2026-05-10",
    description: "Well-cured Nashik red onions, mesh-bag packing preferred.",
    image: onionImg,
  },
];

/* ------------------------- Requirement offers (mock) ----------------------- */

export interface RequirementOffer {
  id: string;
  farmer: string;
  rating: number;
  price: number;
  quantity: number;
  location: string;
  date: string;
  status: "pending" | "negotiating" | "accepted";
}

export const REQUIREMENT_OFFERS: Record<string, RequirementOffer[]> = {
  REQ001: [
    { id: "o1", farmer: "Ramesh Kumar", rating: 4.8, price: 2100, quantity: 100, location: "Burdwan, WB", date: "26 May 2026", status: "pending" },
    { id: "o2", farmer: "Sita Devi", rating: 4.7, price: 2050, quantity: 80, location: "Nadia, WB", date: "26 May 2026", status: "pending" },
    { id: "o3", farmer: "AgriFoods Ltd.", rating: 4.5, price: 2120, quantity: 100, location: "Kolkata, WB", date: "27 May 2026", status: "negotiating" },
    { id: "o4", farmer: "Green Harvest Pvt. Ltd.", rating: 4.6, price: 1980, quantity: 60, location: "Burdwan, WB", date: "27 May 2026", status: "pending" },
    { id: "o5", farmer: "Eastern Grains Co.", rating: 4.3, price: 2150, quantity: 50, location: "Patna, BR", date: "28 May 2026", status: "pending" },
  ],
  REQ002: [
    { id: "o6", farmer: "AgriFoods Ltd.", rating: 4.5, price: 1900, quantity: 200, location: "Kolkata, WB", date: "25 May 2026", status: "negotiating" },
    { id: "o7", farmer: "Nexus Agri Imports", rating: 4.2, price: 1880, quantity: 120, location: "Guwahati, AS", date: "26 May 2026", status: "pending" },
    { id: "o8", farmer: "Eastern Grains Co.", rating: 4.3, price: 1950, quantity: 150, location: "Patna, BR", date: "27 May 2026", status: "negotiating" },
  ],
  REQ003: [
    { id: "o9", farmer: "Arjun Mondal", rating: 4.5, price: 1700, quantity: 150, location: "Hooghly, WB", date: "21 May 2026", status: "pending" },
    { id: "o10", farmer: "Suresh Mandal", rating: 4.6, price: 1750, quantity: 80, location: "Murshidabad, WB", date: "22 May 2026", status: "pending" },
    { id: "o11", farmer: "Bharat Foods", rating: 4.1, price: 1680, quantity: 100, location: "Ranchi, JH", date: "23 May 2026", status: "pending" },
    { id: "o12", farmer: "Fresh Retail Chain", rating: 4.4, price: 1720, quantity: 120, location: "Howrah, WB", date: "24 May 2026", status: "pending" },
  ],
  REQ004: [
    { id: "o13", farmer: "Rahul Yadav", rating: 4.4, price: 5150, quantity: 40, location: "Patna, BR", date: "19 May 2026", status: "pending" },
    { id: "o14", farmer: "Eastern Grains Co.", rating: 4.3, price: 5200, quantity: 50, location: "Patna, BR", date: "20 May 2026", status: "negotiating" },
  ],
  REQ005: [
    { id: "o15", farmer: "Pune Fresh Mart", rating: 4.8, price: 980, quantity: 300, location: "Pune, MH", date: "18 May 2026", status: "accepted" },
    { id: "o16", farmer: "AgroMart Exports", rating: 4.2, price: 1020, quantity: 200, location: "Mumbai, MH", date: "19 May 2026", status: "pending" },
    { id: "o17", farmer: "FreshMart Retail", rating: 4.5, price: 950, quantity: 150, location: "Howrah, WB", date: "19 May 2026", status: "pending" },
    { id: "o18", farmer: "Green Basket", rating: 4.4, price: 1050, quantity: 250, location: "Ahmednagar, MH", date: "20 May 2026", status: "pending" },
    { id: "o19", farmer: "Sita Devi", rating: 4.7, price: 930, quantity: 200, location: "Nadia, WB", date: "21 May 2026", status: "pending" },
    { id: "o20", farmer: "Green Harvest Pvt. Ltd.", rating: 4.6, price: 990, quantity: 300, location: "Burdwan, WB", date: "22 May 2026", status: "pending" },
  ],
  REQ006: [],
};

/* -------------------------------- Helpers ---------------------------------- */

export function priceRange(min: number, max: number): string {
  return `₹${min.toLocaleString("en-IN")} – ₹${max.toLocaleString("en-IN")}`;
}

export function todayLabel(): string {
  return new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}
