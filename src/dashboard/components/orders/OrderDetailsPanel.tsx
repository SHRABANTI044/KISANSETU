import { Link } from "react-router-dom";
import {
  Calendar,
  CircleAlert,
  IndianRupee,
  MapPin,
  Package,
  PackageCheck,
  User,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Order } from "../../data/orders";
import { ORDER_STATUS_META } from "../../data/orders";
import { cn } from "../../../utils/cn";
import LiveLocationMap from "./LiveLocationMap";
import TrackingTimeline from "./TrackingTimeline";

function Row({ icon: Icon, label, value, strong = false }: { icon: LucideIcon; label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="mt-[3px] h-4 w-4 shrink-0 text-[#2E7D32]" strokeWidth={2.1} />
      <div className="grid flex-1 grid-cols-[118px_1fr] items-baseline gap-2">
        <span className="text-[11.5px] font-medium text-[#888888]">{label}</span>
        <span className={cn("text-[12.5px] text-[#111111]", strong && "font-bold")}>{value}</span>
      </div>
    </div>
  );
}

export default function OrderDetailsPanel({ order }: { order: Order }) {
  const meta = ORDER_STATUS_META[order.status];
  const live = order.liveLocation && order.status === "in_transit" ? order.liveLocation : null;

  return (
    <aside
      aria-label={`Tracking details for ${order.id}`}
      className="flex flex-col gap-6 rounded-2xl border border-[#E1E5E1] bg-white p-5 shadow-[0_12px_34px_-20px_rgba(17,17,17,0.14)] sm:p-6 xl:sticky xl:top-[92px] xl:max-h-[calc(100dvh-108px)] xl:overflow-y-auto"
    >
      {/* Header */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-[17px] font-bold text-[#111111]">{order.id}</h2>
          <span className={cn("inline-flex rounded-full px-3 py-1 text-[10.5px] font-bold", meta.badgeClass)}>
            {meta.label}
          </span>
        </div>
        <div className="mt-4 flex flex-col gap-3">
          <Row icon={Package} label="Crop" value={order.crop} strong />
          <Row icon={PackageCheck} label="Quantity" value={`${order.quantityKg.toLocaleString("en-IN")} kg • ${order.grade}`} strong />
          <Row icon={IndianRupee} label="Price" value={`₹ ${order.pricePerKg.toFixed(2)} /kg`} strong />
          <Row icon={IndianRupee} label="Total" value={`₹ ${order.total.toLocaleString("en-IN")}`} strong />
          <Row icon={User} label="Buyer" value={order.buyerName} />
          <Row icon={Calendar} label="Order Date" value={order.orderDate} />
          {order.deliveredOn ? (
            <Row icon={Calendar} label="Delivered On" value={order.deliveredOn} strong />
          ) : order.expectedDelivery ? (
            <Row icon={Calendar} label="Expected Delivery" value={order.expectedDelivery} />
          ) : null}
        </div>
        <Link
          to="/dashboard/buyers"
          className="mt-3.5 inline-flex items-center gap-1 text-[12.5px] font-semibold text-[#2E7D32] transition-colors hover:text-[#155B32]"
        >
          View Profile <MapPin className="hidden h-3.5 w-3.5" /> →
        </Link>
      </div>

      {/* Timeline */}
      <div className="border-t border-[#F0F3F0] pt-5">
        <TrackingTimeline stages={order.stages} />
      </div>

      {/* Live location */}
      {live && (
        <div className="border-t border-[#F0F3F0] pt-5">
          <LiveLocationMap location={live} statusLabel={meta.label} />
        </div>
      )}

      {/* Payment */}
      <div className="border-t border-[#F0F3F0] pt-5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-display text-[15px] font-semibold text-[#111111]">Payment Status</h3>
          <span
            className={cn(
              "inline-flex rounded-full px-3 py-1 text-[10.5px] font-bold",
              order.payment.status === "Processing"
                ? "bg-amber-100 text-amber-700"
                : order.payment.status === "Not Applicable"
                  ? "bg-[#E8EAE8] text-[#666666]"
                  : "bg-[#EAF6EA] text-[#2E7D32]"
            )}
          >
            {order.payment.status}
          </span>
        </div>
        <div className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2 xl:grid-cols-1">
          <div>
            <p className="text-[11px] font-medium text-[#888888]">Payment Method</p>
            <p className="mt-0.5 text-[12.5px] font-semibold text-[#111111]">{order.payment.method}</p>
          </div>
          <div>
            <p className="text-[11px] font-medium text-[#888888]">Expected Payment Date</p>
            <p className="mt-0.5 text-[12.5px] font-semibold text-[#111111]">{order.payment.expectedDate}</p>
          </div>
          <div>
            <p className="text-[11px] font-medium text-[#888888]">Transaction ID</p>
            <p className="mt-0.5 text-[12.5px] font-semibold text-[#111111]">{order.payment.transactionId}</p>
          </div>
        </div>
        {order.payment.status === "Processing" && (
          <p className="mt-4 flex items-start gap-2.5 rounded-xl border border-[#BFE3C5]/70 bg-[#F0FAF1] px-4 py-3 text-[11.5px] leading-relaxed font-medium text-[#155B32]">
            <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-[#2E7D32]" />
            Payment will be released after successful delivery and quality confirmation.
          </p>
        )}
      </div>
    </aside>
  );
}
