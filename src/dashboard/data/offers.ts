/**
 * FRONTEND MOCK DATA for the Offers page.
 * Typed Offer/Buyer models mirror the future backend schema —
 * swap these for `/api/offers` responses later without touching the UI.
 */

export type OfferStatus = "pending" | "accepted" | "rejected" | "countered";

export interface Buyer {
  id: string;
  name: string;
  initials: string;
  verified: boolean;
  rating: number;
  reviews: number;
  location: string;
  description: string;
  since: string;
  businessType: string;
  gst: string;
  totalTransactions: number;
  onTimeRate: number;
}

export interface Offer {
  id: string;
  buyerId: string;
  lotId: string;
  crop: string;
  lotLabel: string;
  pricePerKg: number;
  quantityKg: number;
  totalAmount: number;
  message: string;
  timeReceived: string;
  receivedIso: string;
  pickupDate: string;
  paymentTerms: string;
  status: OfferStatus;
  counterPrice?: number;
  counterNote?: string;
}

/* --------------------------------- Buyers ---------------------------------- */

export const BUYERS: Record<string, Buyer> = {
  b1: {
    id: "b1",
    name: "Pune Fresh Mart Pvt. Ltd.",
    initials: "PF",
    verified: true,
    rating: 4.8,
    reviews: 126,
    location: "Pune, Maharashtra",
    description: "Deals in fruits & vegetables",
    since: "2018",
    businessType: "Wholesaler",
    gst: "27ABCDE1234F1Z5",
    totalTransactions: 248,
    onTimeRate: 96,
  },
  b2: {
    id: "b2",
    name: "Green Valley Traders",
    initials: "GV",
    verified: true,
    rating: 4.5,
    reviews: 89,
    location: "Nashik, Maharashtra",
    description: "Wholesale supplier",
    since: "2020",
    businessType: "Wholesaler",
    gst: "27FGHIJ6789K2Z8",
    totalTransactions: 184,
    onTimeRate: 92,
  },
  b3: {
    id: "b3",
    name: "Sai Produce Imports",
    initials: "SP",
    verified: true,
    rating: 4.2,
    reviews: 54,
    location: "Mumbai, Maharashtra",
    description: "Exporter",
    since: "2019",
    businessType: "Exporter",
    gst: "27LMNOP3456Q1Z3",
    totalTransactions: 141,
    onTimeRate: 89,
  },
  b4: {
    id: "b4",
    name: "Nashik Kisan Bazar",
    initials: "NK",
    verified: true,
    rating: 4.0,
    reviews: 37,
    location: "Nashik, Maharashtra",
    description: "Local retailer",
    since: "2017",
    businessType: "Retailer",
    gst: "27RSTUV7890W4Z6",
    totalTransactions: 96,
    onTimeRate: 87,
  },
  b5: {
    id: "b5",
    name: "Fresh Retail Chain",
    initials: "FR",
    verified: true,
    rating: 4.6,
    reviews: 92,
    location: "Ahmednagar, Maharashtra",
    description: "Retail chain",
    since: "2021",
    businessType: "Retailer",
    gst: "27XYZAB2345C7Z9",
    totalTransactions: 167,
    onTimeRate: 94,
  },
  b6: {
    id: "b6",
    name: "AgroMart Exports",
    initials: "AG",
    verified: true,
    rating: 4.1,
    reviews: 61,
    location: "Mumbai, Maharashtra",
    description: "Exporter",
    since: "2016",
    businessType: "Exporter",
    gst: "27CDEFG9012H0Z2",
    totalTransactions: 132,
    onTimeRate: 91,
  },
};

/* --------------------------------- Offers ---------------------------------- */

const TOMATO_LOT = { lotId: "LOT250525001", crop: "Tomato", lotLabel: "Tomato (Hybrid)" };

export const INITIAL_OFFERS: Offer[] = [
  {
    id: "o1",
    buyerId: "b1",
    ...TOMATO_LOT,
    pricePerKg: 22.0,
    quantityKg: 500,
    totalAmount: 11000,
    message: "Interested in your tomato lot. Can arrange pickup by 28 May.",
    timeReceived: "2 days ago",
    receivedIso: "2025-05-26T09:30:00",
    pickupDate: "28 May 2025",
    paymentTerms: "Within 1 day (UPI/Bank Transfer)",
    status: "pending",
  },
  {
    id: "o2",
    buyerId: "b2",
    ...TOMATO_LOT,
    pricePerKg: 21.5,
    quantityKg: 500,
    totalAmount: 10750,
    message: "We need good quality tomatoes. Can you confirm availability?",
    timeReceived: "4 hours ago",
    receivedIso: "2025-05-28T06:10:00",
    pickupDate: "30 May 2025",
    paymentTerms: "Within 2 days (Bank Transfer)",
    status: "pending",
  },
  {
    id: "o3",
    buyerId: "b3",
    ...TOMATO_LOT,
    pricePerKg: 23.0,
    quantityKg: 500,
    totalAmount: 11500,
    message: "Good quality and packing required. Can you share more photos?",
    timeReceived: "5 hours ago",
    receivedIso: "2025-05-28T05:20:00",
    pickupDate: "31 May 2025",
    paymentTerms: "Within 1 day (UPI)",
    status: "pending",
  },
  {
    id: "o4",
    buyerId: "b4",
    ...TOMATO_LOT,
    pricePerKg: 20.0,
    quantityKg: 500,
    totalAmount: 10000,
    message: "Can pickup within 2 days.",
    timeReceived: "1 day ago",
    receivedIso: "2025-05-27T12:00:00",
    pickupDate: "29 May 2025",
    paymentTerms: "Cash on pickup",
    status: "rejected",
  },
  {
    id: "o5",
    buyerId: "b5",
    ...TOMATO_LOT,
    pricePerKg: 22.5,
    quantityKg: 500,
    totalAmount: 11250,
    message: "Interested. Please confirm grade and packing details.",
    timeReceived: "1 day ago",
    receivedIso: "2025-05-27T10:45:00",
    pickupDate: "30 May 2025",
    paymentTerms: "Within 1 day (UPI/Bank Transfer)",
    status: "accepted",
  },
  {
    id: "o6",
    buyerId: "b6",
    ...TOMATO_LOT,
    pricePerKg: 21.0,
    quantityKg: 500,
    totalAmount: 10500,
    message: "We can offer long-term partnership for regular supply.",
    timeReceived: "2 days ago",
    receivedIso: "2025-05-26T15:40:00",
    pickupDate: "1 Jun 2025",
    paymentTerms: "Within 2 days (Bank Transfer)",
    status: "countered",
    counterPrice: 22.5,
    counterNote: "Best rate considering Grade A quality.",
  },
];

/* ------------------------------ Negotiation tips ---------------------------- */

export const NEGOTIATION_TIPS = [
  "Compare multiple buyers before accepting — the highest price isn't always the best deal.",
  "Check buyer ratings, reviews and transaction history before committing.",
  "Factor pickup and transportation costs into the final price you accept.",
  "Negotiate based on crop quality, grade and the current mandi price.",
  "Always confirm payment terms and pickup dates before accepting an offer.",
];

/* --------------------------------- Helpers --------------------------------- */

export const STATUS_META: Record<OfferStatus, { label: string; badgeClass: string }> = {
  pending: { label: "Pending Response", badgeClass: "bg-amber-100 text-amber-700" },
  accepted: { label: "Accepted", badgeClass: "bg-[#EAF6EA] text-[#2E7D32]" },
  rejected: { label: "Rejected", badgeClass: "bg-red-50 text-red-600" },
  countered: { label: "Countered", badgeClass: "bg-[#DCEAF7] text-[#1D6FB8]" },
};

export function inr(value: number): string {
  return `₹ ${value.toLocaleString("en-IN")}`;
}
