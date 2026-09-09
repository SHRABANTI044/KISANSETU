import {
  CheckCircle2,
  Clock3,
  IndianRupee,
  Leaf,
  Route,
  Truck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * FRONTEND MOCK DATA — Buyer "Transport & Logistics" page.
 * Purely frontend; later swap for Supabase tables (shipments, transport_partners).
 */

export type ShipmentStatus = "In Transit" | "Pending Pickup" | "Delivered" | "Cancelled";

export interface Shipment {
  id: string;
  orderId: string;
  crop: string;
  quantity: string;
  from: string;
  to: string;
  partner: string;
  status: ShipmentStatus;
  expectedDelivery: string;
  action: "Track" | "View" | "Details";
}

export const SHIPMENTS: Shipment[] = [
  { id: "TRP12568", orderId: "#KL2587", crop: "Paddy", quantity: "100 Quintal", from: "Burdwan, WB", to: "Kolkata, WB", partner: "SafeLogistics", status: "In Transit", expectedDelivery: "27 May 2026", action: "Track" },
  { id: "TRP12567", orderId: "#KL2586", crop: "Wheat", quantity: "200 Quintal", from: "Nadia, WB", to: "Kolkata, WB", partner: "AgriMove", status: "Pending Pickup", expectedDelivery: "24 May 2026", action: "View" },
  { id: "TRP12564", orderId: "#KL2584", crop: "Maize", quantity: "80 Quintal", from: "Hooghly, WB", to: "Howrah, WB", partner: "Bharat Trans", status: "Delivered", expectedDelivery: "20 May 2026", action: "Details" },
  { id: "TRP12560", orderId: "#KL2581", crop: "Potato", quantity: "300 Quintal", from: "Purulia, WB", to: "Kolkata, WB", partner: "EcoFreight", status: "In Transit", expectedDelivery: "25 May 2026", action: "Track" },
  { id: "TRP12558", orderId: "#KL2578", crop: "Onion", quantity: "150 Quintal", from: "Patna, BR", to: "Kolkata, WB", partner: "SafeLogistics", status: "Delivered", expectedDelivery: "18 May 2026", action: "Details" },
];

export const SHIPMENT_TABS: { key: string; label: string; count: number }[] = [
  { key: "all", label: "All", count: 18 },
  { key: "Pending Pickup", label: "Pending Pickup", count: 2 },
  { key: "In Transit", label: "In Transit", count: 4 },
  { key: "Delivered", label: "Delivered", count: 12 },
  { key: "Cancelled", label: "Cancelled", count: 0 },
];

export const STATUS_BADGE: Record<ShipmentStatus, string> = {
  "In Transit": "bg-sky-100 text-sky-700",
  "Pending Pickup": "bg-orange-100 text-orange-700",
  "Delivered": "bg-[#EAF6EA] text-[#2E7D32]",
  "Cancelled": "bg-red-100 text-red-600",
};

/** Crop tone chips (thumbnail-style icon block in the table). */
export const CROP_TONE: Record<string, string> = {
  Paddy: "bg-[#EAF6EA] text-[#2E7D32]",
  Wheat: "bg-amber-100 text-amber-700",
  Maize: "bg-yellow-100 text-yellow-700",
  Potato: "bg-orange-100 text-orange-700",
  Onion: "bg-rose-100 text-rose-600",
};

/** Transport partner icon tone — matches the reference screenshot. */
export const PARTNER_TONE: Record<string, { cls: string; icon: LucideIcon }> = {
  SafeLogistics: { cls: "bg-sky-100 text-sky-700", icon: Truck },
  AgriMove: { cls: "bg-[#EAF6EA] text-[#2E7D32]", icon: Leaf },
  "Bharat Trans": { cls: "bg-sky-100 text-sky-700", icon: Route },
  EcoFreight: { cls: "bg-[#EAF6EA] text-[#2E7D32]", icon: Leaf },
};

export const PARTNER_TONE_DEFAULT = { cls: "bg-slate-100 text-slate-600", icon: Truck };

export interface TransportPartner {
  name: string;
  rating: number;
  trips: number;
  details: string;
}

export const LOGISTICS_PARTNERS: TransportPartner[] = [
  { name: "SafeLogistics", rating: 4.8, trips: 320, details: "PAN India | FSSAI Certified" },
  { name: "AgriMove", rating: 4.6, trips: 210, details: "East India | Cold Chain Available" },
  { name: "Bharat Trans", rating: 4.5, trips: 180, details: "All India | Bulk Transport" },
  { name: "EcoFreight", rating: 4.4, trips: 120, details: "Sustainable & Green Logistics" },
];

export interface TrackingStage {
  title: string;
  date: string;
  time: string;
  state: "done" | "current" | "upcoming";
}

export const TRACKING_STAGES: TrackingStage[] = [
  { title: "Order Confirmed", date: "20 May", time: "10:30 AM", state: "done" },
  { title: "Pickup", date: "21 May", time: "09:00 AM", state: "done" },
  { title: "In Transit", date: "23 May", time: "02:15 PM", state: "current" },
  { title: "Out for Delivery", date: "26 May", time: "--", state: "upcoming" },
  { title: "Delivered", date: "27 May", time: "(Expected)", state: "upcoming" },
];

export const TRACKED_SHIPMENT = SHIPMENTS[0];

export const TRANSPORT_SUMMARY = [
  { id: "active", label: "Active Shipments", value: "4", supporting: "↑ 2 in transit", tone: "bg-[#EAF6EA] text-[#2E7D32]", icon: Truck },
  { id: "delivered", label: "Delivered", value: "12", supporting: "This month", tone: "bg-[#EAF6EA] text-[#2E7D32]", icon: CheckCircle2 },
  { id: "pending", label: "Pending Pickup", value: "2", supporting: "Awaiting pickup", tone: "bg-amber-100 text-amber-600", icon: Clock3 },
  { id: "cost", label: "Avg. Transport Cost", value: "₹ 3.2", unit: "/quintal", supporting: "↓ 8% vs last month", tone: "bg-sky-100 text-sky-700", icon: IndianRupee },
] as const;

export const CROP_OPTIONS = ["Paddy", "Wheat", "Maize", "Potato", "Onion", "Moong Dal"];
