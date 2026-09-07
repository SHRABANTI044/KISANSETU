import tomatoImg from "../../assets/images/lots/tomato.jpg";
import tomatoPlantsImg from "../../assets/images/lots/tomato-plants.jpg";
import onionImg from "../../assets/images/lots/onion.jpg";
import potatoImg from "../../assets/images/lots/potato.jpg";
import crateImg from "../../assets/images/mandi-market.jpg";

/**
 * FRONTEND MOCK DATA for the My Lots page.
 * Typed structures kept API-ready — swap these for server data later
 * without touching the UI.
 */

export type LotStatus = "active" | "sold";

export interface CropLot {
  id: string;
  crop: string;
  cropKey: string;
  variety: string;
  quantity: number;
  unit: "kg" | "quintal" | "tonne" | "ton" | "bag" | "crate";
  grade: string;
  organic: boolean;
  status: LotStatus;
  location: string;
  /** Availability window — `availableUntil` drives automatic EXPIRED display. */
  harvestDate: string;
  harvestDateIso: string;
  availableUntil: string;
  availableUntilIso: string;
  expectedPrice?: number;
  priceUnit: CropLot["unit"];
  soldPrice?: number;
  buyer?: string;
  transactionCompleted?: string;
  offers: number;
  views: number;
  postedOn: string;
  postedOnIso: string;
  lastSaved?: string;
  lastUpdated: string;
  description: string;
  image: string;
  images: string[];
}

export interface LotOffer {
  id: string;
  lotId: string;
  buyer: string;
  location: string;
  price: number;
  quantity: number;
  unit: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
}

export interface LotViewer {
  id: string;
  name: string;
  business: string;
  location: string;
  lastViewed: string;
  initials: string;
}

const DEFAULT_LOCATION = "Kothur, Ahmednagar";

export const INITIAL_LOTS: CropLot[] = [
  {
    id: "LOT250525001",
    crop: "Tomato",
    cropKey: "Tomato",
    variety: "Hybrid",
    quantity: 500,
    unit: "kg",
    grade: "Grade A",
    organic: false,
    status: "active",
    location: DEFAULT_LOCATION,
    harvestDate: "25 May 2026",
    harvestDateIso: "2026-05-25",
    availableUntil: "30 Sep 2026",
    availableUntilIso: "2026-09-30",
    expectedPrice: 23,
    priceUnit: "kg",
    offers: 3,
    views: 245,
    postedOn: "25 May 2026",
    postedOnIso: "2026-05-25",
    lastUpdated: "26 May 2026, 09:15 AM",
    description: "Freshly harvested, good quality tomatoes. Ready for immediate delivery.",
    image: tomatoImg,
    images: [tomatoImg, crateImg, tomatoPlantsImg],
  },
  {
    id: "LOT250520002",
    crop: "Onion",
    cropKey: "Onion",
    variety: "Nashik Red",
    quantity: 300,
    unit: "kg",
    grade: "Good",
    organic: false,
    status: "active",
    location: DEFAULT_LOCATION,
    harvestDate: "20 May 2026",
    harvestDateIso: "2026-05-20",
    availableUntil: "25 Sep 2026",
    availableUntilIso: "2026-09-25",
    expectedPrice: 18,
    priceUnit: "kg",
    offers: 1,
    views: 120,
    postedOn: "20 May 2026",
    postedOnIso: "2026-05-20",
    lastUpdated: "21 May 2026, 11:40 AM",
    description: "Well-cured Nashik red onions, medium size. Suitable for long storage.",
    image: onionImg,
    images: [onionImg, crateImg],
  },
  {
    id: "LOT250515003",
    crop: "Potato",
    cropKey: "Potato",
    variety: "Kufri Jyoti",
    quantity: 1000,
    unit: "kg",
    grade: "Grade A",
    organic: false,
    status: "sold",
    location: DEFAULT_LOCATION,
    harvestDate: "15 May 2026",
    harvestDateIso: "2026-05-15",
    availableUntil: "30 Jun 2026",
    availableUntilIso: "2026-06-30",
    soldPrice: 16,
    priceUnit: "kg",
    buyer: "Pune Fresh Mart",
    transactionCompleted: "18 May 2026",
    offers: 4,
    views: 310,
    postedOn: "15 May 2026",
    postedOnIso: "2026-05-15",
    lastUpdated: "18 May 2026, 06:20 PM",
    description: "Clean, medium-size potatoes ideal for retail and processing.",
    image: potatoImg,
    images: [potatoImg, crateImg],
  },
  {
    id: "LOT250528004",
    crop: "Cabbage",
    cropKey: "Cabbage",
    variety: "Golden Acre",
    quantity: 350,
    unit: "kg",
    grade: "Grade A",
    organic: false,
    status: "active",
    location: DEFAULT_LOCATION,
    harvestDate: "28 May 2026",
    harvestDateIso: "2026-05-28",
    availableUntil: "30 Sep 2026",
    availableUntilIso: "2026-09-30",
    expectedPrice: 15,
    priceUnit: "kg",
    offers: 2,
    views: 98,
    postedOn: "28 May 2026",
    postedOnIso: "2026-05-28",
    lastUpdated: "29 May 2026, 08:10 AM",
    description: "Fresh, compact green cabbage heads.",
    image: crateImg,
    images: [crateImg],
  },
  {
    id: "LOT250529005",
    crop: "Pumpkin",
    cropKey: "Pumpkin",
    variety: "Desi",
    quantity: 400,
    unit: "kg",
    grade: "Good",
    organic: false,
    status: "active",
    location: DEFAULT_LOCATION,
    harvestDate: "29 May 2026",
    harvestDateIso: "2026-05-29",
    availableUntil: "30 Sep 2026",
    availableUntilIso: "2026-09-30",
    expectedPrice: 20,
    priceUnit: "kg",
    offers: 1,
    views: 64,
    postedOn: "29 May 2026",
    postedOnIso: "2026-05-29",
    lastUpdated: "29 May 2026, 07:55 PM",
    description: "Ripe, well-cured pumpkins ready for wholesale.",
    image: crateImg,
    images: [crateImg],
  },
];

export const INITIAL_OFFERS: Record<string, LotOffer[]> = {
  LOT250525001: [
    { id: "of1", lotId: "LOT250525001", buyer: "FreshMart", location: "Pune", price: 24, quantity: 500, unit: "kg", status: "pending", createdAt: "2026-05-26" },
    { id: "of2", lotId: "LOT250525001", buyer: "Pune Fresh Mart", location: "Pune", price: 23.5, quantity: 300, unit: "kg", status: "pending", createdAt: "2026-05-27" },
    { id: "of3", lotId: "LOT250525001", buyer: "Agro Traders", location: "Nashik", price: 22.75, quantity: 500, unit: "kg", status: "pending", createdAt: "2026-05-27" },
  ],
  LOT250520002: [
    { id: "of4", lotId: "LOT250520002", buyer: "Lasalgaon Traders", location: "Lasalgaon", price: 17.5, quantity: 300, unit: "kg", status: "pending", createdAt: "2026-05-22" },
  ],
  LOT250528004: [
    { id: "of5", lotId: "LOT250528004", buyer: "FreshMart", location: "Pune", price: 38, quantity: 100, unit: "kg", status: "pending", createdAt: "2026-05-29" },
    { id: "of6", lotId: "LOT250528004", buyer: "Green Basket", location: "Ahmednagar", price: 39.25, quantity: 200, unit: "kg", status: "pending", createdAt: "2026-05-29" },
  ],
  LOT250515003: [
    { id: "of7", lotId: "LOT250515003", buyer: "Pune Fresh Mart", location: "Pune", price: 16, quantity: 1000, unit: "kg", status: "accepted", createdAt: "2026-05-16" },
  ],
};

export const LOT_VIEWERS: Record<string, LotViewer[]> = {
  LOT250525001: [
    { id: "v1", name: "Suresh Kale", business: "FreshMart Retail", location: "Pune", lastViewed: "10 min ago", initials: "SK" },
    { id: "v2", name: "Anita Deshmukh", business: "Pune Fresh Mart", location: "Pune", lastViewed: "32 min ago", initials: "AD" },
    { id: "v3", name: "Vikram Shinde", business: "Agro Traders", location: "Nashik", lastViewed: "1 hr ago", initials: "VS" },
    { id: "v4", name: "Meera Joshi", business: "Green Basket", location: "Ahmednagar", lastViewed: "2 hrs ago", initials: "MJ" },
    { id: "v5", name: "Rohit Pawar", business: "Pawar Wholesale", location: "Sangamner", lastViewed: "5 hrs ago", initials: "RP" },
  ],
  LOT250520002: [
    { id: "v6", name: "Nitin Gadakh", business: "Lasalgaon Traders", location: "Lasalgaon", lastViewed: "26 min ago", initials: "NG" },
    { id: "v7", name: "Anita Deshmukh", business: "Pune Fresh Mart", location: "Pune", lastViewed: "3 hrs ago", initials: "AD" },
  ],
  LOT250528004: [
    { id: "v8", name: "Suresh Kale", business: "FreshMart Retail", location: "Pune", lastViewed: "48 min ago", initials: "SK" },
    { id: "v9", name: "Meera Joshi", business: "Green Basket", location: "Ahmednagar", lastViewed: "1 hr ago", initials: "MJ" },
  ],
  LOT250515003: [
    { id: "v10", name: "Vikram Shinde", business: "Agro Traders", location: "Nashik", lastViewed: "2 days ago", initials: "VS" },
  ],
};

export const GRADE_OPTIONS = ["Premium", "Grade A", "Good", "Average", "Grade B"];
export const UNIT_OPTIONS = ["kg", "quintal", "ton", "bag", "crate", "tonne"] as const;
export const CROP_NAME_OPTIONS = ["Tomato", "Onion", "Potato", "Green Chilli", "Cauliflower", "Paddy", "Wheat", "Maize"];

/** Mock farmer profile — replace with the logged-in farmer's saved profile later. */
export const FARMER_PROFILE = {
  id: "F001",
  name: "Rahul Patil",
  location: DEFAULT_LOCATION,
};

/* --------------------------- Status / expiry logic ------------------------- */
/**
 * Frontend stand-in for the backend expiration job:
 * an ACTIVE lot whose "Available Until" date has passed is displayed as EXPIRED.
 * When the API exists, this derives from `farmer_lots.available_until`.
 */
export function isLotExpired(_lot: Pick<CropLot, "status" | "availableUntilIso">): boolean {
  return false;
}

/** Status used for badges, tabs and counters (Active or Sold). */
export function effectiveStatus(lot: CropLot): LotStatus {
  return lot.status;
}

/* ------------------------------ Formatting ------------------------------- */

export function formatPrice(value?: number): string {
  if (value === undefined) return "—";
  return `₹${value.toFixed(2)}`;
}

export function todayLabel(): string {
  return new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function nowTimestamp(): string {
  const d = new Date();
  const date = d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  const time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  return `${date}, ${time}`;
}
