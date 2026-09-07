/**
 * FRONTEND MOCK DATA for the Earnings page.
 * Typed, modular structures ready to be swapped for a real
 * settlements/orders API later — UI components read only from here.
 */

/* -------------------------------- Summary --------------------------------- */

export interface EarningsSummary {
  totalEarnings: number;
  earningsChange: number;
  lotsSold: number;
  lotsChange: number;
  amountReceived: number;
  receivedPercentage: number;
  pendingPayment: number;
  pendingOrders: number;
}

export const EARNINGS_SUMMARY: EarningsSummary = {
  totalEarnings: 52500,
  earningsChange: 12,
  lotsSold: 8,
  lotsChange: 2,
  amountReceived: 48000,
  receivedPercentage: 92,
  pendingPayment: 4500,
  pendingOrders: 1,
};

/* ------------------------------ Monthly trend ------------------------------ */

export interface MonthlyPoint {
  month: string;
  amount: number;
}

export const MONTHLY_EARNINGS: MonthlyPoint[] = [
  { month: "Jun", amount: 8000 },
  { month: "Jul", amount: 10000 },
  { month: "Aug", amount: 14000 },
  { month: "Sep", amount: 18000 },
  { month: "Oct", amount: 19000 },
  { month: "Nov", amount: 20000 },
  { month: "Dec", amount: 22000 },
  { month: "Jan", amount: 20000 },
  { month: "Feb", amount: 30000 },
  { month: "Mar", amount: 40000 },
  { month: "Apr", amount: 40000 },
  { month: "May", amount: 52500 },
];

/* ------------------------------- By crop ----------------------------------- */

export interface CropEarning {
  crop: string;
  percentage: number;
  amount: number;
  color: string;
}

export const EARNINGS_BY_CROP: CropEarning[] = [
  { crop: "Tomato", percentage: 38, amount: 19950, color: "#2E7D32" },
  { crop: "Onion", percentage: 24, amount: 12600, color: "#F2A93B" },
  { crop: "Potato", percentage: 18, amount: 9450, color: "#8BC34A" },
  { crop: "Green Chilli", percentage: 10, amount: 5250, color: "#26A69A" },
  { crop: "Wheat", percentage: 6, amount: 3150, color: "#C0CA33" },
  { crop: "Others", percentage: 4, amount: 2100, color: "#B0BEC5" },
];

/* ------------------------------ Transactions ------------------------------- */

export type PaymentStatus = "received" | "pending" | "failed";

export interface EarningsTransaction {
  id: string;
  date: string;
  isoDate: string;
  orderId: string;
  crop: string;
  quantityKg: number;
  rate: number;
  total: number;
  status: PaymentStatus;
}

export const EARNINGS_TRANSACTIONS: EarningsTransaction[] = [
  { id: "t1", date: "28 May 2025", isoDate: "2025-05-28", orderId: "ORD2505261001", crop: "Tomato", quantityKg: 1500, rate: 22.0, total: 33000, status: "received" },
  { id: "t2", date: "24 May 2025", isoDate: "2025-05-24", orderId: "ORD2505200876", crop: "Onion", quantityKg: 800, rate: 18.0, total: 14400, status: "received" },
  { id: "t3", date: "20 May 2025", isoDate: "2025-05-20", orderId: "ORD2505150043", crop: "Potato", quantityKg: 1000, rate: 16.0, total: 16000, status: "pending" },
  { id: "t4", date: "15 May 2025", isoDate: "2025-05-15", orderId: "ORD2505120098", crop: "Green Chilli", quantityKg: 500, rate: 28.0, total: 14000, status: "received" },
  { id: "t5", date: "10 May 2025", isoDate: "2025-05-10", orderId: "ORD2505090032", crop: "Wheat", quantityKg: 1200, rate: 20.0, total: 24000, status: "received" },
  { id: "t6", date: "05 May 2025", isoDate: "2025-05-05", orderId: "ORD2505050210", crop: "Tomato", quantityKg: 1000, rate: 21.0, total: 21000, status: "received" },
  { id: "t7", date: "01 May 2025", isoDate: "2025-05-01", orderId: "ORD2505010155", crop: "Onion", quantityKg: 600, rate: 17.5, total: 10500, status: "received" },
  { id: "t8", date: "28 Apr 2025", isoDate: "2025-04-28", orderId: "ORD2504280199", crop: "Wheat", quantityKg: 900, rate: 19.5, total: 17550, status: "received" },
  { id: "t9", date: "22 Apr 2025", isoDate: "2025-04-22", orderId: "ORD2504220067", crop: "Green Chilli", quantityKg: 300, rate: 26.0, total: 7800, status: "pending" },
  { id: "t10", date: "18 Apr 2025", isoDate: "2025-04-18", orderId: "ORD2504180041", crop: "Potato", quantityKg: 800, rate: 15.0, total: 12000, status: "received" },
];

/* ------------------------------ Date ranges -------------------------------- */

export interface DateRangeOption {
  label: string;
  from: string;
  to: string;
}

export const DATE_RANGES: DateRangeOption[] = [
  { label: "01 May 2025 – 31 May 2025", from: "2025-05-01", to: "2025-05-31" },
  { label: "01 Apr 2025 – 30 Apr 2025", from: "2025-04-01", to: "2025-04-30" },
  { label: "All Time", from: "0000-01-01", to: "9999-12-31" },
];

/* ---------------------------------- Bank ----------------------------------- */

export interface BankAccount {
  holder: string;
  bank: string;
  number: string;
  ifsc: string;
  verified: boolean;
}

export const BANK_ACCOUNT: BankAccount = {
  holder: "Ramesh Patil",
  bank: "State Bank of India",
  number: "XXXX XXXX 1234",
  ifsc: "SBIN0001234",
  verified: true,
};

/* ------------------------------ CSV statement ------------------------------ */

export function buildStatementCsv(rows: EarningsTransaction[]): string {
  const header = "Date,Order ID,Crop,Quantity (kg),Rate (Rs/kg),Total Amount (Rs),Payment Status";
  const lines = rows.map((r) =>
    [r.date, r.orderId, r.crop, String(r.quantityKg), r.rate.toFixed(2), String(r.total), r.status].join(",")
  );
  return [header, ...lines].join("\n");
}

export function inr(value: number): string {
  return `₹ ${value.toLocaleString("en-IN")}`;
}
