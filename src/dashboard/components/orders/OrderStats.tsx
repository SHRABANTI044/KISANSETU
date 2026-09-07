import { CircleCheckBig, Clock, IndianRupee, Package } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Order } from "../../data/orders";
import { isDeliveredLike } from "../../data/orders";
import { cn } from "../../../utils/cn";

interface StatDef {
  label: string;
  value: string;
  icon: LucideIcon;
  iconBox: string;
}

/** Statistics computed live from the order dataset (never hardcoded). */
export default function OrderStats({ orders }: { orders: Order[] }) {
  const inTransit = orders.filter((o) => o.status === "in_transit").length;
  const delivered = orders.filter((o) => isDeliveredLike(o.status)).length;
  const totalEarnings = orders.reduce((sum, o) => sum + o.total, 0);

  const stats: StatDef[] = [
    { label: "Total Orders", value: String(orders.length), icon: Package, iconBox: "bg-[#EAF6EA] text-[#2E7D32]" },
    { label: "In Transit", value: String(inTransit), icon: Clock, iconBox: "bg-sky-100 text-sky-700" },
    { label: "Delivered", value: String(delivered), icon: CircleCheckBig, iconBox: "bg-[#EAF6EA] text-[#2E7D32]" },
    { label: "Total Earnings", value: `₹ ${totalEarnings.toLocaleString("en-IN")}`, icon: IndianRupee, iconBox: "bg-amber-100 text-amber-700" },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
      {stats.map((stat) => (
        <article
          key={stat.label}
          className="flex items-center gap-3.5 rounded-2xl border border-[#E1E5E1] bg-white p-4.5 p-4 shadow-[0_10px_30px_-18px_rgba(17,17,17,0.12)] sm:p-5"
        >
          <span className={cn("grid h-[44px] w-[44px] shrink-0 place-items-center rounded-xl", stat.iconBox)}>
            <stat.icon className="h-[21px] w-[21px]" strokeWidth={2} />
          </span>
          <div>
            <p className="font-display text-[20px] leading-none font-bold text-[#111111] sm:text-[22px]">
              {stat.value}
            </p>
            <p className="mt-1.5 text-[11.5px] font-medium text-[#777777]">{stat.label}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
