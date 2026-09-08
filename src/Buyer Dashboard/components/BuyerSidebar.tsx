import { Link, NavLink } from "react-router-dom";
import { BadgeCheck, MapPin } from "lucide-react";
import { LogoMark } from "../../components/Logo";
import { BUYER, BUYER_SIDEBAR_ITEMS } from "../data/buyerDashboardData";
import { cn } from "../../utils/cn";

const ACTIVE_CLASS =
  "bg-[#2E7D32] text-white shadow-[0_10px_22px_-10px_rgba(46,125,50,0.6)]";
const IDLE_CLASS = "text-[#555555] hover:bg-[#EAF6EA] hover:text-[#155B32]";

/** Buyer dashboard sidebar — 8 buyer features + buyer profile card. */
export default function BuyerSidebar({
  className,
  onNavigate,
}: {
  className?: string;
  onNavigate?: () => void;
}) {
  return (
    <aside className={cn("flex h-full flex-col border-r border-[#E1E5E1] bg-white", className)}>
      {/* Brand */}
      <Link
        to="/"
        aria-label="KisanSetu — home"
        className="flex h-[76px] items-center gap-2.5 border-b border-[#E1E5E1] px-5"
        onClick={onNavigate}
      >
        <LogoMark className="h-10 w-10" />
        <span className="flex flex-col leading-none">
          <span className="font-display text-[18.5px] font-bold tracking-[-0.01em]">
            <span className="text-[#E8862D]">Kisan</span>
            <span className="text-[#2E7D32]">Setu</span>
          </span>
          <span className="mt-[4px] text-[8.8px] font-medium text-[#777777]">
            Connecting Farms to Markets
          </span>
        </span>
      </Link>

      {/* Navigation */}
      <nav aria-label="Buyer dashboard" className="flex-1 overflow-y-auto p-4">
        <ul className="flex flex-col gap-1.5">
          {BUYER_SIDEBAR_ITEMS.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.to === "/buyer/dashboard"}
                onClick={onNavigate}
                className={({ isActive }) =>
                  cn(
                    "group flex items-center gap-3 rounded-xl px-4 py-3 text-[13.5px] font-medium transition-all duration-150",
                    isActive ? ACTIVE_CLASS : IDLE_CLASS
                  )
                }
              >
                <item.icon className="h-[18px] w-[18px] shrink-0" strokeWidth={2.1} />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Buyer profile card */}
      <div className="border-t border-[#E1E5E1] p-4">
        <div className="rounded-2xl border border-[#E1E5E1] bg-[#F7FAF7] p-4">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#7C3AED] font-display text-[13px] font-bold text-white">
              {BUYER.initials}
            </span>
            <div className="min-w-0">
              <p className="truncate text-[13.5px] font-semibold text-[#111111]">{BUYER.name}</p>
              <p className="mt-0.5 flex items-center gap-1 text-[11px] text-[#777777]">
                <MapPin className="h-3 w-3 shrink-0 text-[#2E7D32]" />
                {BUYER.location}, {BUYER.state}
              </p>
            </div>
          </div>
          <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#EAF6EA] px-3 py-1 text-[11px] font-bold text-[#2E7D32]">
            <BadgeCheck className="h-3.5 w-3.5" />
            Verified Buyer
          </p>
        </div>
      </div>
    </aside>
  );
}
