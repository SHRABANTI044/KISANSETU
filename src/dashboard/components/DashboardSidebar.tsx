import { Link, NavLink } from "react-router-dom";
import { LogoMark } from "../../components/Logo";
import { FARMER_SIDEBAR_ITEMS } from "../data/farmerDashboardData";
import { cn } from "../../utils/cn";

const ACTIVE_CLASS =
  "bg-[#2E7D32] text-white shadow-[0_10px_22px_-10px_rgba(46,125,50,0.6)]";
const IDLE_CLASS = "text-[#555555] hover:bg-[#EAF6EA] hover:text-[#155B32]";

/**
 * Fixed dashboard sidebar — KisanSetu branding + exactly the nine
 * farmer navigation items from the approved feature list.
 */
export default function DashboardSidebar({
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
      <nav aria-label="Farmer dashboard" className="flex-1 overflow-y-auto p-4">
        <ul className="flex flex-col gap-1.5">
          {FARMER_SIDEBAR_ITEMS.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.to === "/dashboard"}
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

      <div className="border-t border-[#E1E5E1] px-5 py-4">
        <p className="text-[10.5px] leading-relaxed text-[#999999]">
          Frontend prototype — demo data only
        </p>
      </div>
    </aside>
  );
}
