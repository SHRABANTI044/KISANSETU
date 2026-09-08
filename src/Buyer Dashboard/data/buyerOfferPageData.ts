import onionImg from "../../assets/images/lots/onion.jpg";
import potatoImg from "../../assets/images/lots/potato.jpg";

/**
 * FRONTEND MOCK DATA for the Buyer "Offers & Negotiations" page.
 * Working subset of 6 offers; platform-wide headline counters live in
 * OFFER_STATS. Later replace with GET /api/buyer/offers and action APIs.
 */

export type BuyerOfferStatus = "new" | "negotiating" | "accepted" | "declined" | "expired";

export interface BuyerOffer {
  id: string;
  cropKey: "paddy" | "wheat" | "maize" | "moong" | "potato" | "onion" ;
  crop: string;
  variety: string;
  supplierName: string;
  supplierType: "Farmer" | "FPO";
  rating: number;
  deals: number;
  offeredPrice: number;
  quantity: number;
  location: string;
  offerDate: string;
  offerIso: string;
  status: BuyerOfferStatus;
  image?: string;
  initials: string;
  supplierTone: string;
}

export const OFFER_STATUS_META: Record<BuyerOfferStatus, { label: string; badgeClass: string }> = {
  new: { label: "New Offer", badgeClass: "bg-sky-100 text-sky-700" },
  negotiating: { label: "In Negotiation", badgeClass: "bg-amber-100 text-amber-700" },
  accepted: { label: "Accepted", badgeClass: "bg-[#EAF6EA] text-[#2E7D32]" },
  declined: { label: "Declined", badgeClass: "bg-red-50 text-red-600" },
  expired: { label: "Expired", badgeClass: "bg-[#E8EAE8] text-[#666666]" },
};

/** Exactly the six reference offers. */
export const INITIAL_OFFERS_PAGE: BuyerOffer[] = [
  {
    id: "o1",
    cropKey: "paddy",
    crop: "Paddy",
    variety: "Common",
    supplierName: "Ramesh Kumar",
    supplierType: "Farmer",
    rating: 4.8,
    deals: 23,
    offeredPrice: 2150,
    quantity: 100,
    location: "Burdwan, WB",
    offerDate: "25 May 2026",
    offerIso: "2026-05-25",
    status: "negotiating",
    initials: "RK",
    supplierTone: "bg-[#EAF6EA] text-[#2E7D32]",
  },
  {
    id: "o2",
    cropKey: "wheat",
    crop: "Wheat",
    variety: "Lokwan",
    supplierName: "Green Harvest FPO",
    supplierType: "FPO",
    rating: 4.6,
    deals: 18,
    offeredPrice: 1900,
    quantity: 200,
    location: "Nadia, WB",
    offerDate: "24 May 2026",
    offerIso: "2026-05-24",
    status: "new",
    initials: "GH",
    supplierTone: "bg-violet-100 text-violet-700",
  },
  {
    id: "o3",
    cropKey: "maize",
    crop: "Maize",
    variety: "Hybrid",
    supplierName: "Sita Devi",
    supplierType: "Farmer",
    rating: 4.7,
    deals: 15,
    offeredPrice: 1750,
    quantity: 80,
    location: "Hooghly, WB",
    offerDate: "24 May 2026",
    offerIso: "2026-05-24",
    status: "negotiating",
    initials: "SD",
    supplierTone: "bg-emerald-100 text-emerald-700",
  },
  {
    id: "o4",
    cropKey: "moong",
    crop: "Moong Dal",
    variety: "Premium",
    supplierName: "Sundarban FPO",
    supplierType: "FPO",
    rating: 4.5,
    deals: 12,
    offeredPrice: 5100,
    quantity: 50,
    location: "South 24 Parganas, WB",
    offerDate: "22 May 2026",
    offerIso: "2026-05-22",
    status: "accepted",
    initials: "SF",
    supplierTone: "bg-[#DCEAF7] text-[#1D6FB8]",
  },
  {
    id: "o5",
    cropKey: "potato",
    crop: "Potato",
    variety: "Local",
    supplierName: "Arjun Mondal",
    supplierType: "Farmer",
    rating: 4.4,
    deals: 10,
    offeredPrice: 1000,
    quantity: 300,
    location: "Purulia, WB",
    offerDate: "21 May 2026",
    offerIso: "2026-05-21",
    status: "declined",
    image: potatoImg,
    initials: "AM",
    supplierTone: "bg-orange-100 text-orange-600",
  },
  {
    id: "o6",
    cropKey: "onion",
    crop: "Onion",
    variety: "Red",
    supplierName: "Bharat Kisan FPO",
    supplierType: "FPO",
    rating: 4.6,
    deals: 20,
    offeredPrice: 1350,
    quantity: 150,
    location: "Patna, BR",
    offerDate: "20 May 2026",
    offerIso: "2026-05-20",
    status: "new",
    image: onionImg,
    initials: "BK",
    supplierTone: "bg-pink-100 text-pink-700",
  },
];

/* --------------------------- Headline counters ---------------------------- */

export const OFFER_STATS = {
  total: 18,
  negotiating: 5,
  accepted: 7,
  declined: 6,
  expired: 0,
};

/* ------------------------------- Chat seeds -------------------------------- */

export interface ChatMsg {
  id: string;
  from: "supplier" | "buyer";
  text: string;
  time: string;
}

export function chatSeedFor(offer: BuyerOffer): ChatMsg[] {
  return [
    {
      id: `${offer.id}-s1`,
      from: "supplier",
      text: `I can offer ₹${offer.offeredPrice.toLocaleString("en-IN")} for ${offer.quantity} quintal. Quality is ${offer.variety === "Premium" ? "premium" : "A"} grade.`,
      time: `${offer.offerDate.split(" ").slice(0, 2).join(" ")}, 10:30 AM`,
    },
    {
      id: `${offer.id}-b1`,
      from: "buyer",
      text: `You can do ₹${(offer.offeredPrice - 100).toLocaleString("en-IN")}? Also, confirm delivery within 7 days.`,
      time: `${offer.offerDate.split(" ").slice(0, 2).join(" ")}, 11:05 AM`,
    },
  ];
}

export function nowTimeLabel(): string {
  return new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
}
