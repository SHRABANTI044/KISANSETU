import { BadgeCheck, Clock, ShoppingBag, Wallet } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { EARNINGS_SUMMARY, inr } from "../../data/earnings";
import { cn } from "../../../utils/cn";

interface SummaryCardDef {
  label: string;
  value: string;
  supporting: string;
  supportingTone: "green" | "muted";
  icon: LucideIcon;
  iconBox: string;
  trend?: string;
}

const CARDS: SummaryCardDef[] = [
  {
    label: "Total Earnings",
    value: inr(EARNINGS_SUMMARY.totalEarnings),
    supporting: "vs last month",
    supportingTone: "muted",
    trend: `▲ ${EARNINGS_SUMMARY.earningsChange}%`,
    icon: Wallet,
    iconBox: "bg-[#EAF6EA] text-[#2E7D32]",
  },
  {
    label: "Lots Sold",
    value: String(EARNINGS_SUMMARY.lotsSold),
    supporting: `+${EARNINGS_SUMMARY.lotsChange} this month`,
    supportingTone: "green",
    icon: ShoppingBag,
    iconBox: "bg-[#EAF6EA] text-[#2E7D32]",
  },
  {
    label: "Amount Received",
    value: inr(EARNINGS_SUMMARY.amountReceived),
    supporting: `${EARNINGS_SUMMARY.receivedPercentage}% of earnings`,
    supportingTone: "green",
    icon: BadgeCheck,
    iconBox: "bg-[#EAF6EA] text-[#2E7D32]",
  },
  {
    label: "Pending Payment",
    value: inr(EARNINGS_SUMMARY.pendingPayment),
    supporting: `${EARNINGS_SUMMARY.pendingOrders} order`,
    supportingTone: "muted",
    icon: Clock,
    iconBox: "bg-amber-50 text-amber-600",
  },
];

export default function EarningsSummaryCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {CARDS.map((card) => (
        <article
          key={card.label}
          className="rounded-2xl border border-[#E1E5E1] bg-white p-5 shadow-[0_10px_30px_-18px_rgba(17,17,17,0.12)] transition-shadow duration-300 hover:shadow-[0_16px_40px_-18px_rgba(17,17,17,0.18)]"
        >
          <div className="flex items-start justify-between gap-3">
            <p className="text-[12.5px] font-medium text-[#666666]">{card.label}</p>
            <span className={cn("grid h-[38px] w-[38px] shrink-0 place-items-center rounded-full", card.iconBox)}>
              <card.icon className="h-[18px] w-[18px]" strokeWidth={2.1} />
            </span>
          </div>
          <p className="mt-3 font-display text-[24px] leading-none font-bold text-[#111111]">
            {card.value}
          </p>
          <p className="mt-2 text-[11.5px] font-semibold">
            {card.trend && <span className="mr-1.5 text-[#2E7D32]">{card.trend}</span>}
            <span className={card.supportingTone === "green" ? "text-[#2E7D32]" : "text-[#8A938A]"}>
              {card.supporting}
            </span>
          </p>
        </article>
      ))}
    </div>
  );
}
