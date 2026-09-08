import onionImg from "../../assets/images/lots/onion.jpg";
import potatoImg from "../../assets/images/lots/potato.jpg";

/**
 * FRONTEND MOCK DATA for the Buyer "Orders & Tracking" page.
 * Working subset of orders; platform totals live in ORDER_STATS.
 * Later replace with GET /api/buyer/orders and tracking/shipment endpoints.
 */

export type BuyerOrderStatus = "pending" | "in_transit" | "delivered" | "cancelled";

export interface BuyerOrder {
  id: string;
  cropKey: "paddy" | "wheat" | "maize" | "moong" | "potato" | "onion";
  crop: string;
  variety: string;
  supplierName: string;
  supplierType: "Farmer" | "FPO";
  rating: number;
  deals: number;
  quantityQuintal: number;
  orderValue: number;
  orderDate: string;
  orderDateIso: string;
  expectedDelivery: string;
  status: BuyerOrderStatus;
  initials: string;
  supplierTone: string;
  image?: string;
}

export const ORDER_STATUS_META: Record<BuyerOrderStatus, { label: string; badgeClass: string }> = {
  pending: { label: "Pending", badgeClass: "bg-amber-100 text-amber-700" },
  in_transit: { label: "In Transit", badgeClass: "bg-sky-100 text-sky-700" },
  delivered: { label: "Delivered", badgeClass: "bg-[#EAF6EA] text-[#2E7D32]" },
  cancelled: { label: "Cancelled", badgeClass: "bg-red-50 text-red-600" },
};

/** Platform-wide headline counters shown on the summary cards. */
export const ORDER_STATS = {
  total: 12,
  inTransit: 4,
  delivered: 6,
  pending: 2,
  cancelled: 0,
};

/** Exactly the six reference orders. */
export const INITIAL_BUYER_ORDERS: BuyerOrder[] = [
  {
    id: "#KL2587",
    cropKey: "paddy",
    crop: "Paddy",
    variety: "Common",
    supplierName: "Ramesh Kumar",
    supplierType: "Farmer",
    rating: 4.8,
    deals: 23,
    quantityQuintal: 100,
    orderValue: 215000,
    orderDate: "20 May 2026",
    orderDateIso: "2026-05-20",
    expectedDelivery: "27 May 2026",
    status: "in_transit",
    initials: "RK",
    supplierTone: "bg-[#EAF6EA] text-[#2E7D32]",
  },
  {
    id: "#KL2586",
    cropKey: "wheat",
    crop: "Wheat",
    variety: "Lokwan",
    supplierName: "Green Harvest FPO",
    supplierType: "FPO",
    rating: 4.6,
    deals: 18,
    quantityQuintal: 200,
    orderValue: 390000,
    orderDate: "18 May 2026",
    orderDateIso: "2026-05-18",
    expectedDelivery: "24 May 2026",
    status: "delivered",
    initials: "GH",
    supplierTone: "bg-violet-100 text-violet-700",
  },
  {
    id: "#KL2585",
    cropKey: "maize",
    crop: "Maize",
    variety: "Hybrid",
    supplierName: "Sita Devi",
    supplierType: "Farmer",
    rating: 4.7,
    deals: 15,
    quantityQuintal: 80,
    orderValue: 140000,
    orderDate: "15 May 2026",
    orderDateIso: "2026-05-15",
    expectedDelivery: "22 May 2026",
    status: "in_transit",
    initials: "SD",
    supplierTone: "bg-emerald-100 text-emerald-700",
  },
  {
    id: "#KL2584",
    cropKey: "moong",
    crop: "Moong Dal",
    variety: "Premium",
    supplierName: "Sundarban FPO",
    supplierType: "FPO",
    rating: 4.5,
    deals: 12,
    quantityQuintal: 50,
    orderValue: 255000,
    orderDate: "12 May 2026",
    orderDateIso: "2026-05-12",
    expectedDelivery: "18 May 2026",
    status: "delivered",
    initials: "SF",
    supplierTone: "bg-[#DCEAF7] text-[#1D6FB8]",
  },
  {
    id: "#KL2583",
    cropKey: "potato",
    crop: "Potato",
    variety: "Local",
    supplierName: "Arjun Mondal",
    supplierType: "Farmer",
    rating: 4.4,
    deals: 10,
    quantityQuintal: 300,
    orderValue: 300000,
    orderDate: "10 May 2026",
    orderDateIso: "2026-05-10",
    expectedDelivery: "—",
    status: "pending",
    initials: "AM",
    supplierTone: "bg-orange-100 text-orange-600",
    image: potatoImg,
  },
  {
    id: "#KL2582",
    cropKey: "onion",
    crop: "Onion",
    variety: "Red",
    supplierName: "Bharat Kisan FPO",
    supplierType: "FPO",
    rating: 4.6,
    deals: 20,
    quantityQuintal: 150,
    orderValue: 202500,
    orderDate: "08 May 2026",
    orderDateIso: "2026-05-08",
    expectedDelivery: "16 May 2026",
    status: "in_transit",
    initials: "BK",
    supplierTone: "bg-pink-100 text-pink-700",
    image: onionImg,
  },
];

/* ------------------------------ Tracking data ------------------------------ */

export interface TrackingStage {
  label: string;
  date: string;
  time: string;
  state: "done" | "current" | "future";
}

export interface OrderTracking {
  stages: TrackingStage[];
  etaLabel: string;
  messageTitle: string;
  messageText: string;
  shipment: {
    partner: string;
    vehicleNo: string;
    driver: string;
    phone: string;
    currentLocation: string;
    updatedAt: string;
  };
  route: {
    origin: string;
    via: string;
    destination: string;
  };
}

/** Per-order tracking info — the default panel order is #KL2587 (reference). */
export const ORDER_TRACKING: Record<string, OrderTracking> = {
  "#KL2587": {
    stages: [
      { label: "Order Placed", date: "20 May", time: "10:30 AM", state: "done" },
      { label: "Confirmed", date: "20 May", time: "01:15 PM", state: "done" },
      { label: "Packed", date: "22 May", time: "11:00 AM", state: "done" },
      { label: "Dispatched", date: "23 May", time: "09:20 AM", state: "done" },
      { label: "In Transit", date: "25 May", time: "On the way", state: "current" },
      { label: "Delivered", date: "Expected", time: "27 May", state: "future" },
    ],
    etaLabel: "27 May 2026",
    messageTitle: "Your order is on the way!",
    messageText: "The shipment is currently in transit and will reach your location by 27 May 2026.",
    shipment: {
      partner: "SafeLogistics",
      vehicleNo: "WB 19 AB 4587",
      driver: "Suman Das",
      phone: "+91 98765 43210",
      currentLocation: "Durgapur, WB",
      updatedAt: "25 May, 02:30 PM",
    },
    route: { origin: "Burdwan", via: "Durgapur", destination: "Kolkata" },
  },
  "#KL2585": {
    stages: [
      { label: "Order Placed", date: "15 May", time: "09:10 AM", state: "done" },
      { label: "Confirmed", date: "15 May", time: "12:40 PM", state: "done" },
      { label: "Packed", date: "17 May", time: "10:15 AM", state: "done" },
      { label: "Dispatched", date: "18 May", time: "08:50 AM", state: "done" },
      { label: "In Transit", date: "19 May", time: "On the way", state: "current" },
      { label: "Delivered", date: "Expected", time: "22 May", state: "future" },
    ],
    etaLabel: "22 May 2026",
    messageTitle: "Your order is on the way!",
    messageText: "The shipment is currently in transit and will reach your location by 22 May 2026.",
    shipment: {
      partner: "AgriMove Logistics",
      vehicleNo: "WB 23 CD 9021",
      driver: "Rafi Sheikh",
      phone: "+91 98123 45678",
      currentLocation: "Asansol, WB",
      updatedAt: "19 May, 04:10 PM",
    },
    route: { origin: "Hooghly", via: "Asansol", destination: "Kolkata" },
  },
  "#KL2582": {
    stages: [
      { label: "Order Placed", date: "08 May", time: "11:25 AM", state: "done" },
      { label: "Confirmed", date: "08 May", time: "03:05 PM", state: "done" },
      { label: "Packed", date: "10 May", time: "09:40 AM", state: "done" },
      { label: "Dispatched", date: "11 May", time: "08:20 AM", state: "done" },
      { label: "In Transit", date: "12 May", time: "On the way", state: "current" },
      { label: "Delivered", date: "Expected", time: "16 May", state: "future" },
    ],
    etaLabel: "16 May 2026",
    messageTitle: "Your order is on the way!",
    messageText: "The shipment is currently in transit and will reach your location by 16 May 2026.",
    shipment: {
      partner: "Rail-Linked Cargo",
      vehicleNo: "BR 05 EF 2211",
      driver: "Manoj Verma",
      phone: "+91 98234 56781",
      currentLocation: "Dhanbad, JH",
      updatedAt: "12 May, 01:45 PM",
    },
    route: { origin: "Patna", via: "Dhanbad", destination: "Kolkata" },
  },
  "#KL2586": {
    stages: [
      { label: "Order Placed", date: "18 May", time: "10:05 AM", state: "done" },
      { label: "Confirmed", date: "18 May", time: "01:50 PM", state: "done" },
      { label: "Packed", date: "20 May", time: "11:30 AM", state: "done" },
      { label: "Dispatched", date: "21 May", time: "09:10 AM", state: "done" },
      { label: "In Transit", date: "22 May", time: "On the way", state: "done" },
      { label: "Delivered", date: "24 May", time: "11:00 AM", state: "done" },
    ],
    etaLabel: "24 May 2026",
    messageTitle: "Your order has been delivered.",
    messageText: "The shipment was delivered successfully on 24 May 2026. Share a rating for your supplier experience.",
    shipment: {
      partner: "SafeLogistics",
      vehicleNo: "WB 19 AB 4587",
      driver: "Suman Das",
      phone: "+91 98765 43210",
      currentLocation: "Kolkata, WB",
      updatedAt: "24 May, 11:00 AM",
    },
    route: { origin: "Nadia", via: "Kalyani", destination: "Kolkata" },
  },
  "#KL2584": {
    stages: [
      { label: "Order Placed", date: "12 May", time: "09:50 AM", state: "done" },
      { label: "Confirmed", date: "12 May", time: "02:10 PM", state: "done" },
      { label: "Packed", date: "14 May", time: "10:45 AM", state: "done" },
      { label: "Dispatched", date: "15 May", time: "09:30 AM", state: "done" },
      { label: "In Transit", date: "16 May", time: "On the way", state: "done" },
      { label: "Delivered", date: "18 May", time: "10:30 AM", state: "done" },
    ],
    etaLabel: "18 May 2026",
    messageTitle: "Your order has been delivered.",
    messageText: "The shipment was delivered successfully on 18 May 2026. Premium moong dal quality confirmed on arrival.",
    shipment: {
      partner: "DeltaCarriers",
      vehicleNo: "WB 11 ZX 5544",
      driver: "Pinku Ray",
      phone: "+91 98456 12345",
      currentLocation: "Kolkata, WB",
      updatedAt: "18 May, 10:30 AM",
    },
    route: { origin: "South 24 Parganas", via: "Kolkata South", destination: "Kolkata" },
  },
  "#KL2583": {
    stages: [
      { label: "Order Placed", date: "10 May", time: "10:40 AM", state: "done" },
      { label: "Confirmed", date: "11 May", time: "01:25 PM", state: "done" },
      { label: "Packed", date: "Awaiting", time: "dispatch", state: "current" },
      { label: "Dispatched", date: "—", time: "—", state: "future" },
      { label: "In Transit", date: "—", time: "—", state: "future" },
      { label: "Delivered", date: "—", time: "—", state: "future" },
    ],
    etaLabel: "To be scheduled",
    messageTitle: "Preparing for dispatch",
    messageText: "The supplier is packing your order. Dispatch date will be notified once scheduled.",
    shipment: {
      partner: "Awaiting assignment",
      vehicleNo: "—",
      driver: "—",
      phone: "—",
      currentLocation: "Purulia, WB",
      updatedAt: "11 May, 01:25 PM",
    },
    route: { origin: "Purulia", via: "—", destination: "Kolkata" },
  },
};
