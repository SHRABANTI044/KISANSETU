import { Download, Truck } from "lucide-react";
import type { Order } from "../../data/orders";
import { ORDER_STATUS_META } from "../../data/orders";
import { cn } from "../../../utils/cn";

export type OrderCardAction = "track" | "details" | "receipt";

const BTN = "inline-flex h-9 items-center justify-center gap-1.5 rounded-lg px-3.5 text-[12px] font-semibold whitespace-nowrap transition-all duration-150";

export default function OrderCard({
  order,
  selected,
  onAction,
}: {
  order: Order;
  selected: boolean;
  onAction: (action: OrderCardAction) => void;
}) {
  const meta = ORDER_STATUS_META[order.status];
  const cancelled = order.status === "cancelled";

  return (
    <article
      onClick={() => onAction("details")}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onAction("details")}
      tabIndex={0}
      role="button"
      aria-pressed={selected}
      aria-label={`Order ${order.id}`}
      className={cn(
        "group flex cursor-pointer flex-col gap-4 rounded-2xl border-2 bg-white p-4 transition-all duration-200 sm:p-[18px] lg:flex-row lg:items-center",
        selected
          ? "border-[#2E7D32] bg-[#F4FAF4] shadow-[0_14px_34px_-18px_rgba(46,125,50,0.4)]"
          : "border-transparent shadow-[0_0_0_1px_#E1E5E1] hover:shadow-[0_0_0_1.5px_#9fd0a5]"
      )}
    >
      {/* Crop image */}
      <img
        src={order.image}
        alt={order.crop}
        loading="lazy"
        className="h-40 w-full shrink-0 rounded-xl object-cover sm:h-36 lg:h-[104px] lg:w-[128px]"
      />

      {/* Main info */}
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-[5px]">
        <div className="flex flex-wrap items-center gap-2.5">
          <p className="text-[13px] font-bold text-[#111111]">{order.id}</p>
          <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-[10.5px] font-bold", meta.badgeClass)}>
            {meta.label}
          </span>
        </div>
        <h3 className="text-[15px] leading-tight font-bold text-[#111111]">{order.crop}</h3>
        <p className="text-[12.5px] font-medium text-[#666666]">
          {order.quantityKg.toLocaleString("en-IN")} kg • {order.grade}
        </p>
        <p className="text-[12px] text-[#777777]">
          Buyer: <span className="font-semibold text-[#111111]">{order.buyerName}</span>
        </p>
        <p className="text-[12px] text-[#777777]">Order Date: {order.orderDate}</p>
        {order.deliveredOn ? (
          <p className="text-[12px] text-[#777777]">Delivered On: {order.deliveredOn}</p>
        ) : order.expectedDelivery ? (
          <p className="text-[12px] text-[#777777]">Expected Delivery: {order.expectedDelivery}</p>
        ) : null}
        <p className="text-[13px] font-semibold text-[#111111]">
          ₹ {order.pricePerKg.toFixed(2)} /kg · Total:{" "}
          <span className="text-[#2E7D32]">₹ {order.total.toLocaleString("en-IN")}</span>
        </p>
      </div>

      {/* Actions */}
      <div className="flex shrink-0 flex-row flex-wrap gap-2 lg:w-[150px] lg:flex-col lg:items-stretch">
        {order.status === "in_transit" && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAction("track");
            }}
            className={`${BTN} bg-[#2E7D32] text-white hover:bg-[#256628]`}
          >
            <Truck className="h-3.5 w-3.5" strokeWidth={2.2} />
            Track Order
          </button>
        )}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onAction("details");
          }}
          className={`${BTN} border-[1.5px] border-[#2E7D32] bg-white text-[#2E7D32] hover:bg-[#EAF6EA]`}
        >
          View Details
        </button>
        {(order.status === "delivered" || order.status === "payment_completed" || cancelled) && (
          <button
            type="button"
            disabled={cancelled}
            onClick={(e) => {
              e.stopPropagation();
              if (!cancelled) onAction("receipt");
            }}
            className={cn(
              BTN,
              cancelled
                ? "cursor-not-allowed border-[1.5px] border-[#E1E5E1] bg-[#F7FAF7] text-[#B9BFB9]"
                : "border-[1.5px] border-[#CBDCF2] bg-white text-[#1D6FB8] hover:bg-[#F3F8FD]"
            )}
          >
            <Download className="h-3.5 w-3.5" strokeWidth={2.2} />
            Download Receipt
          </button>
        )}
      </div>
    </article>
  );
}
