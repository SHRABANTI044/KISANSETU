/**
 * FRONTEND MOCK DATA for the Buyer "Farmers and FPOs" page.
 * ONE supplier array derives the list, tabs, search and filters.
 * Later swapped for: GET /api/buyer/farmers + GET /api/buyer/fpos.
 */

export type SupplierType = "farmer" | "fpo";

export interface BuyerSupplier {
  id: string;
  name: string;
  type: SupplierType;
  location: string;
  state: string;
  rating: number;
  deals: number;
  mainCrops: string[];
  annualProduction: string;
  /** Numeric production floor used for sorting / min-production filters. */
  productionMin: number;
  initials: string;
  tone: string;
  members?: string;
  about: string;
  saved?: boolean;
}

/** Exactly the reference supplier list, in order. */
export const INITIAL_SUPPLIERS: BuyerSupplier[] = [
  {
    id: "s1",
    name: "Ramesh Kumar",
    type: "farmer",
    location: "Burdwan, West Bengal",
    state: "West Bengal",
    rating: 4.8,
    deals: 23,
    mainCrops: ["Paddy", "Wheat", "Maize"],
    annualProduction: "200 – 500 Quintal",
    productionMin: 200,
    initials: "RK",
    tone: "bg-[#EAF6EA] text-[#2E7D32]",
    about: "Third-generation paddy and wheat grower using low-chemical cultivation. Supplies clean, machine-dried produce across West Bengal.",
  },
  {
    id: "s2",
    name: "Green Harvest FPO",
    type: "fpo",
    location: "Nadia, West Bengal",
    state: "West Bengal",
    rating: 4.6,
    deals: 18,
    mainCrops: ["Paddy", "Potato", "Vegetables"],
    annualProduction: "5,000+ Quintal",
    productionMin: 5000,
    initials: "GH",
    tone: "bg-violet-100 text-violet-700",
    members: "850+ farmers",
    about: "FPO of 850+ smallholders pooling paddy, potato and vegetables with unified grading, packing and transport across eastern India.",
  },
  {
    id: "s3",
    name: "Sita Devi",
    type: "farmer",
    location: "Hooghly, West Bengal",
    state: "West Bengal",
    rating: 4.7,
    deals: 15,
    mainCrops: ["Wheat", "Mustard", "Pulses"],
    annualProduction: "100 – 300 Quintal",
    productionMin: 100,
    initials: "SD",
    tone: "bg-emerald-100 text-emerald-700",
    about: "Precision-sown wheat and mustard with careful post-harvest drying. Consistent grain quality valued by repeat buyers.",
  },
  {
    id: "s4",
    name: "Sundarban FPO",
    type: "fpo",
    location: "South 24 Parganas, West Bengal",
    state: "West Bengal",
    rating: 4.5,
    deals: 12,
    mainCrops: ["Rice", "Vegetables", "Spices"],
    annualProduction: "3,000+ Quintal",
    productionMin: 3000,
    initials: "SF",
    tone: "bg-[#DCEAF7] text-[#1D6FB8]",
    about: "Delta-region cooperative known for aromatic rice varieties and coastal vegetable produce, organized aggregation and logistics.",
  },
  {
    id: "s5",
    name: "Arjun Mondal",
    type: "farmer",
    location: "Hooghly, West Bengal",
    state: "West Bengal",
    rating: 4.4,
    deals: 10,
    mainCrops: ["Maize", "Potato", "Onion"],
    annualProduction: "150 – 400 Quintal",
    productionMin: 150,
    initials: "AM",
    tone: "bg-amber-100 text-amber-700",
    about: "Hybrid maize and potato specialist with steady winter crops and flexible lot sizes for processors and retailers.",
  },
  {
    id: "s6",
    name: "Bharat Kisan FPO",
    type: "fpo",
    location: "Patna, Bihar",
    state: "Bihar",
    rating: 4.6,
    deals: 20,
    mainCrops: ["Maize", "Pulses", "Oilseeds"],
    annualProduction: "10,000+ Quintal",
    productionMin: 10000,
    initials: "BK",
    tone: "bg-pink-100 text-pink-700",
    about: "Large Bihar-based FPO handling high-volume maize, pulses and oilseeds with depot storage and railway-linked dispatch.",
  },
  {
    id: "s7",
    name: "Rahul Yadav",
    type: "farmer",
    location: "Purulia, West Bengal",
    state: "West Bengal",
    rating: 4.3,
    deals: 8,
    mainCrops: ["Paddy", "Vegetables", "Fruits"],
    annualProduction: "100 – 250 Quintal",
    productionMin: 100,
    initials: "RY",
    tone: "bg-sky-100 text-sky-700",
    about: "Rain-fed paddy and seasonal vegetable grower, known for fresh fruit-lot deliveries in harvest months.",
  },
];

/* ----------------------------- Filter options ------------------------------ */

export const TYPE_OPTIONS = ["All Types", "Farmers", "FPOs"];

export const STATE_OPTIONS = [
  "All States",
  "West Bengal",
  "Bihar",
  "Odisha",
  "Jharkhand",
  "Uttar Pradesh",
  "Punjab",
  "Haryana",
  "Maharashtra",
];

export const CROP_OPTIONS = [
  "All Crops",
  "Paddy",
  "Wheat",
  "Maize",
  "Potato",
  "Onion",
  "Vegetables",
  "Pulses",
  "Mustard",
  "Fruits",
  "Spices",
];

export const SORT_OPTIONS = [
  "Relevance",
  "Rating: High to Low",
  "Rating: Low to High",
  "Most Deals",
  "Nearest First",
  "Annual Production: High to Low",
];

export const MIN_RATING_OPTIONS = ["Any Rating", "4.3 & above", "4.5 & above", "4.6 & above", "4.7 & above", "4.8 & above"];

export const MIN_PRODUCTION_OPTIONS = ["Any Volume", "100+ Quintal", "500+ Quintal", "3,000+ Quintal", "10,000+ Quintal"];

export function ratingThreshold(option: string): number {
  if (option.startsWith("4.")) return Number(option.split(" ")[0]);
  return 0;
}

export function productionThreshold(option: string): number {
  if (option.startsWith("Any")) return 0;
  return Number(option.replace(/[+,\sQuintal]/g, ""));
}

/** Type badge styles */
export const TYPE_META: Record<SupplierType, { label: string; badgeClass: string }> = {
  farmer: { label: "Farmer", badgeClass: "bg-[#EAF6EA] text-[#2E7D32]" },
  fpo: { label: "FPO", badgeClass: "bg-violet-100 text-violet-700" },
};
