import tomatoImg from "../../assets/images/lots/tomato.jpg";
import onionImg from "../../assets/images/lots/onion.jpg";
import potatoImg from "../../assets/images/lots/potato.jpg";
import chilliImg from "../../assets/images/lots/green-chilli.jpg";
import cauliflowerImg from "../../assets/images/lots/cauliflower.jpg";

/**
 * FRONTEND MOCK DATA for the Orders & Tracking page.
 * Typed order model mirrors the future backend schema — swap this file for
 * `/api/orders` responses later without touching the UI components.
 */

export type OrderStatus = "in_transit" | "delivered" | "payment_completed" | "cancelled";

export interface TrackingStage {
  label: string;
  when: string;
  state: "done" | "current" | "pending";
}

export interface OrderPayment {
  status: string;
  method: string;
  expectedDate: string;
  transactionId: string;
}

export interface OrderLiveLocation {
  from: string;
  to: string;
  near: string;
  eta: string;
}

export interface Order {
  id: string;
  status: OrderStatus;
  crop: string;
  cropKey: string;
  image: string;
  quantityKg: number;
  grade: string;
  buyerName: string;
  orderDate: string;
  orderIso: string;
  expectedDelivery?: string;
  deliveredOn?: string;
  pricePerKg: number;
  total: number;
  stages: TrackingStage[];
  liveLocation?: OrderLiveLocation;
  payment: OrderPayment;
}

/* ------------------------------- Status meta -------------------------------- */

export const ORDER_STATUS_META: Record<OrderStatus, { label: string; badgeClass: string }> = {
  in_transit: { label: "In Transit", badgeClass: "bg-sky-100 text-sky-700" },
  delivered: { label: "Delivered", badgeClass: "bg-[#EAF6EA] text-[#2E7D32]" },
  payment_completed: { label: "Payment Completed", badgeClass: "bg-[#EAF6EA] text-[#2E7D32]" },
  cancelled: { label: "Cancelled", badgeClass: "bg-red-50 text-red-600" },
};

/** Delivered-tab buckets: delivered + payment completed. */
export const isDeliveredLike = (s: OrderStatus) => s === "delivered" || s === "payment_completed";

/* --------------------------------- Orders ---------------------------------- */

export const INITIAL_ORDERS: Order[] = [
  {
    id: "ORD2505261001",
    status: "in_transit",
    crop: "Tomato (Hybrid)",
    cropKey: "Tomato",
    image: tomatoImg,
    quantityKg: 500,
    grade: "Grade A",
    buyerName: "Pune Fresh Mart Pvt. Ltd.",
    orderDate: "22 May 2025",
    orderIso: "2025-05-22",
    expectedDelivery: "28 May 2025",
    pricePerKg: 22.0,
    total: 11000,
    stages: [
      { label: "Order Confirmed", when: "22 May 2025, 10:30 AM", state: "done" },
      { label: "Pickup Scheduled", when: "23 May 2025, 02:00 PM", state: "done" },
      { label: "Picked Up", when: "24 May 2025, 09:15 AM", state: "done" },
      { label: "In Transit", when: "25 May 2025, 01:20 PM", state: "current" },
      { label: "Delivered", when: "Expected: 28 May 2025", state: "pending" },
    ],
    liveLocation: { from: "Ahmednagar", to: "Pune", near: "Near Khed, Pune", eta: "28 May, 11:00 AM" },
    payment: {
      status: "Processing",
      method: "UPI (Buyer)",
      expectedDate: "29 May 2025 (After Delivery)",
      transactionId: "-",
    },
  },
  {
    id: "ORD2505200876",
    status: "delivered",
    crop: "Onion",
    cropKey: "Onion",
    image: onionImg,
    quantityKg: 300,
    grade: "Grade B",
    buyerName: "Green Valley Traders",
    orderDate: "18 May 2025",
    orderIso: "2025-05-18",
    deliveredOn: "21 May 2025",
    pricePerKg: 18.0,
    total: 5400,
    stages: [
      { label: "Order Confirmed", when: "18 May 2025, 11:00 AM", state: "done" },
      { label: "Pickup Scheduled", when: "19 May 2025, 09:00 AM", state: "done" },
      { label: "Picked Up", when: "20 May 2025, 08:30 AM", state: "done" },
      { label: "In Transit", when: "20 May 2025, 02:45 PM", state: "done" },
      { label: "Delivered", when: "21 May 2025, 10:15 AM", state: "done" },
    ],
    payment: {
      status: "Received",
      method: "Bank Transfer (Buyer)",
      expectedDate: "Settled on 22 May 2025",
      transactionId: "UTR2505220441",
    },
  },
  {
    id: "ORD2505150423",
    status: "payment_completed",
    crop: "Potato",
    cropKey: "Potato",
    image: potatoImg,
    quantityKg: 1000,
    grade: "Grade A",
    buyerName: "Sai Produce Imports",
    orderDate: "15 May 2025",
    orderIso: "2025-05-15",
    deliveredOn: "18 May 2025",
    pricePerKg: 16.0,
    total: 16000,
    stages: [
      { label: "Order Confirmed", when: "15 May 2025, 04:20 PM", state: "done" },
      { label: "Pickup Scheduled", when: "16 May 2025, 10:00 AM", state: "done" },
      { label: "Picked Up", when: "17 May 2025, 07:50 AM", state: "done" },
      { label: "In Transit", when: "17 May 2025, 12:30 PM", state: "done" },
      { label: "Delivered", when: "18 May 2025, 09:40 AM", state: "done" },
    ],
    payment: {
      status: "Completed",
      method: "UPI (Buyer)",
      expectedDate: "Settled on 19 May 2025",
      transactionId: "UPI2505197710",
    },
  },
  {
    id: "ORD2505100331",
    status: "cancelled",
    crop: "Green Chilli",
    cropKey: "Green Chilli",
    image: chilliImg,
    quantityKg: 200,
    grade: "Grade A",
    buyerName: "Nashik Kisan Bazar",
    orderDate: "10 May 2025",
    orderIso: "2025-05-10",
    pricePerKg: 28.0,
    total: 5600,
    stages: [
      { label: "Order Confirmed", when: "10 May 2025, 01:15 PM", state: "done" },
      { label: "Cancelled", when: "11 May 2025, 09:25 AM", state: "current" },
    ],
    payment: {
      status: "Not Applicable",
      method: "-",
      expectedDate: "-",
      transactionId: "-",
    },
  },
  {
    id: "ORD2505050210",
    status: "delivered",
    crop: "Cauliflower",
    cropKey: "Cauliflower",
    image: cauliflowerImg,
    quantityKg: 400,
    grade: "Grade A",
    buyerName: "Fresh Retail Chain",
    orderDate: "05 May 2025",
    orderIso: "2025-05-05",
    deliveredOn: "08 May 2025",
    pricePerKg: 25.0,
    total: 10000,
    stages: [
      { label: "Order Confirmed", when: "05 May 2025, 09:45 AM", state: "done" },
      { label: "Pickup Scheduled", when: "06 May 2025, 08:00 AM", state: "done" },
      { label: "Picked Up", when: "07 May 2025, 07:30 AM", state: "done" },
      { label: "In Transit", when: "07 May 2025, 01:10 PM", state: "done" },
      { label: "Delivered", when: "08 May 2025, 10:05 AM", state: "done" },
    ],
    payment: {
      status: "Received",
      method: "UPI (Buyer)",
      expectedDate: "Settled on 09 May 2025",
      transactionId: "UPI2505093320",
    },
  },
  {
    id: "ORD2505281102",
    status: "in_transit",
    crop: "Onion",
    cropKey: "Onion",
    image: onionImg,
    quantityKg: 250,
    grade: "Grade B",
    buyerName: "AgroMart Exports",
    orderDate: "26 May 2025",
    orderIso: "2025-05-26",
    expectedDelivery: "1 Jun 2025",
    pricePerKg: 18.0,
    total: 4500,
    stages: [
      { label: "Order Confirmed", when: "26 May 2025, 03:40 PM", state: "done" },
      { label: "Pickup Scheduled", when: "27 May 2025, 10:00 AM", state: "done" },
      { label: "Picked Up", when: "28 May 2025, 08:15 AM", state: "done" },
      { label: "In Transit", when: "28 May 2025, 11:30 AM", state: "current" },
      { label: "Delivered", when: "Expected: 1 Jun 2025", state: "pending" },
    ],
    liveLocation: { from: "Ahmednagar", to: "Mumbai", near: "Near Sinnar, Nashik", eta: "1 Jun, 10:30 AM" },
    payment: {
      status: "Processing",
      method: "Bank Transfer (Buyer)",
      expectedDate: "2 Jun 2025 (After Delivery)",
      transactionId: "-",
    },
  },
];

/* ------------------------------ Receipt builder ----------------------------- */

export function buildReceiptText(order: Order): string {
  const statusLabel = ORDER_STATUS_META[order.status].label;
  const lines = [
    "==========================================",
    "           KISANSETU ORDER RECEIPT        ",
    "==========================================",
    `Order ID        : ${order.id}`,
    `Status          : ${statusLabel}`,
    `Crop            : ${order.crop} (${order.grade})`,
    `Quantity        : ${order.quantityKg.toLocaleString("en-IN")} kg`,
    `Rate            : ₹ ${order.pricePerKg.toFixed(2)} /kg`,
    `Total Amount    : ₹ ${order.total.toLocaleString("en-IN")}`,
    `Buyer           : ${order.buyerName}`,
    `Order Date      : ${order.orderDate}`,
    order.deliveredOn
      ? `Delivered On    : ${order.deliveredOn}`
      : `Expected Deliv. : ${order.expectedDelivery ?? "-"}`,
    `Payment Status  : ${order.payment.status}`,
    `Payment Method  : ${order.payment.method}`,
    `Transaction ID  : ${order.payment.transactionId}`,
    "------------------------------------------",
    "Thank you for selling with KisanSetu —     ",
    "Connecting Farmers to Better Markets.      ",
    "==========================================",
  ];
  return lines.join("\n");
}
