/**
 * FRONTEND MOCK DATA for the Buyer "Payments" page.
 * Transaction demo subset + platform headline stats. Later replaced by a
 * real settlement/payment-service — NO live gateway exists for now.
 */

import potatoImg from "../../assets/images/lots/potato.jpg";
import onionImg from "../../assets/images/lots/onion.jpg";

export type PaymentStatus = "pending" | "completed" | "failed";

export interface BuyerTransaction {
  id: string;
  orderId: string;
  cropKey: "paddy" | "wheat" | "maize" | "moong" | "potato" | "onion";
  crop: string;
  variety: string;
  supplierName: string;
  supplierType: "Farmer" | "FPO";
  location: string;
  amount: number;
  paymentDate: string;
  paymentDateIso: string;
  status: PaymentStatus;
  image?: string;
  method: string;
  orderValueNote?: string;
}

export const PAYMENT_STATUS_META: Record<PaymentStatus, { label: string; badgeClass: string }> = {
  pending: { label: "Pending", badgeClass: "bg-amber-100 text-amber-700" },
  completed: { label: "Completed", badgeClass: "bg-[#EAF6EA] text-[#2E7D32]" },
  failed: { label: "Failed", badgeClass: "bg-red-50 text-red-600" },
};

/** Exactly the six reference transactions, in order. */
export const INITIAL_BUYER_TRANSACTIONS: BuyerTransaction[] = [
  {
    id: "PAY78291",
    orderId: "#KL2587",
    cropKey: "paddy",
    crop: "Paddy",
    variety: "Common",
    supplierName: "Ramesh Kumar",
    supplierType: "Farmer",
    location: "Burdwan, WB",
    amount: 215000,
    paymentDate: "25 May 2026",
    paymentDateIso: "2026-05-25",
    status: "completed",
    method: "UPI (SBI ••1234)",
  },
  {
    id: "PAY78265",
    orderId: "#KL2586",
    cropKey: "wheat",
    crop: "Wheat",
    variety: "Lokwan",
    supplierName: "Green Harvest FPO",
    supplierType: "FPO",
    location: "Nadia, WB",
    amount: 190000,
    paymentDate: "22 May 2026",
    paymentDateIso: "2026-05-22",
    status: "completed",
    method: "Bank Transfer",
  },
  {
    id: "PAY78123",
    orderId: "#KL2585",
    cropKey: "maize",
    crop: "Maize",
    variety: "Hybrid",
    supplierName: "Sita Devi",
    supplierType: "Farmer",
    location: "Hooghly, WB",
    amount: 140000,
    paymentDate: "18 May 2026",
    paymentDateIso: "2026-05-18",
    status: "pending",
    method: "UPI (GPay)",
  },
  {
    id: "PAY78011",
    orderId: "#KL2584",
    cropKey: "moong",
    crop: "Moong Dal",
    variety: "Premium",
    supplierName: "Sundarban FPO",
    supplierType: "FPO",
    location: "South 24 Parganas, WB",
    amount: 255000,
    paymentDate: "12 May 2026",
    paymentDateIso: "2026-05-12",
    status: "completed",
    method: "Bank Transfer",
  },
  {
    id: "PAY77902",
    orderId: "#KL2583",
    cropKey: "potato",
    crop: "Potato",
    variety: "Local",
    supplierName: "Arjun Mondal",
    supplierType: "Farmer",
    location: "Purulia, WB",
    amount: 90000,
    paymentDate: "10 May 2026",
    paymentDateIso: "2026-05-10",
    status: "pending",
    image: potatoImg,
    method: "UPI (SBI ••1234)",
  },
  {
    id: "PAY77890",
    orderId: "#KL2580",
    cropKey: "onion",
    crop: "Onion",
    variety: "Red",
    supplierName: "Bharat Kisan Bazar",
    supplierType: "FPO",
    location: "Patna, BR",
    amount: 135000,
    paymentDate: "05 May 2026",
    paymentDateIso: "2026-05-05",
    status: "completed",
    image: onionImg,
    method: "UPI (GPay)",
  },
];

/** Platform-wide headline counters for the summary cards. */
export const PAYMENT_STATS = {
  totalSpent: 485000,
  completedAmount: 395000,
  failedAmount: 0,
};

/** Saved payment methods (demo) shown inside the Payment Methods modal. */
export interface PaymentMethod {
  id: string;
  kind: "upi" | "bank";
  label: string;
  detail: string;
  tone: string;
}

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "m1",
    kind: "upi",
    label: "UPI (SBI Bank ••1234)",
    detail: "Linked from your profile · Primary",
    tone: "bg-[#EAF6EA] text-[#2E7D32]",
  },
  {
    id: "m2",
    kind: "bank",
    label: "Bank Account (SBIN0001234)",
    detail: "Food Processing Co. · Verified",
    tone: "bg-[#DCEAF7] text-[#1D6FB8]",
  },
];

/* ------------------------------ Receipt builder ---------------------------- */

export function buildPaymentReceipt(transaction: BuyerTransaction): string {
  const statusLabel = PAYMENT_STATUS_META[transaction.status].label;
  const lines = [
    "==========================================",
    "        KISANSETU PAYMENT RECEIPT         ",
    "==========================================",
    `Payment ID      : ${transaction.id}`,
    `Order ID        : ${transaction.orderId}`,
    `Crop            : ${transaction.crop} (${transaction.variety})`,
    `Supplier        : ${transaction.supplierName} (${transaction.supplierType})`,
    `Amount          : ₹ ${transaction.amount.toLocaleString("en-IN")}`,
    `Payment Method  : ${transaction.method}`,
    `Payment Date    : ${transaction.paymentDate}`,
    `Status          : ${statusLabel}`,
    "------------------------------------------",
    "Thank you for trading on KisanSetu —       ",
    "Connecting Farmers to Better Markets.      ",
    "==========================================",
  ];
  return lines.join("\n");
}
