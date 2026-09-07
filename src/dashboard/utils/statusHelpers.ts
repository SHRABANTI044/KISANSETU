import type { OrderStatusValue } from "../types/dashboard.types";

/** Human labels for order lifecycle statuses. */
export const ORDER_STATUS_LABELS: Record<OrderStatusValue, string> = {
  in_transit: "In Transit",
  delivered: "Delivered",
  payment_completed: "Payment Completed",
  cancelled: "Cancelled",
};

/** Tailwind badge classes per lot/offer/order status, matching the KrishiLink palette. */
export function statusBadgeClass(status: string): string {
  switch (status.toLowerCase()) {
    case "live":
    case "active":
    case "delivered":
    case "accepted":
    case "received":
      return "bg-emerald-100 text-emerald-700";
    case "in transit":
    case "negotiation":
    case "pending":
    case "in_progress":
      return "bg-amber-100 text-amber-700";
    case "cancelled":
    case "rejected":
    case "failed":
      return "bg-red-100 text-red-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}
