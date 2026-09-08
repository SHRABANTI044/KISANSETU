import { Bell, ChevronDown, CloudSun, Menu, Search } from "lucide-react";
import { BUYER, BUYER_NOTIFICATIONS, BUYER_WEATHER } from "../data/buyerDashboardData";

/** Sticky buyer dashboard header — search, weather, notifications, buyer profile. */
export default function BuyerHeader({
  onMenu,
  searchValue,
  onSearch,
}: {
  onMenu: () => void;
  searchValue: string;
  onSearch: (value: string) => void;
}) {
  return (
    <header className="sticky top-0 z-40 flex h-[76px] items-center justify-between gap-3 border-b border-[#E1E5E1] bg-white/95 px-4 backdrop-blur sm:gap-5 sm:px-6 lg:px-8">
      {/* Left — hamburger + search */}
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <button
          type="button"
          onClick={onMenu}
          aria-label="Open dashboard menu"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-[#E1E5E1] text-[#111111] transition-colors hover:bg-[#EAF6EA] lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="relative hidden w-full max-w-[420px] sm:block">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 h-[18px] w-[18px] -translate-y-1/2 text-[#8A938A]" />
          <input
            type="search"
            value={searchValue}
            onChange={(e) => onSearch(e.target.value)}
            aria-label="Search the dashboard"
            placeholder="Search crops, varieties, farmers, locations..."
            className="h-[44px] w-full rounded-xl border border-[#E1E5E1] bg-[#F7FAF7] pr-3.5 pl-11 text-[13.5px] text-[#111111] transition-colors outline-none placeholder:text-[#999999] focus:border-[#2E7D32] focus:bg-white"
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex shrink-0 items-center gap-2.5 sm:gap-3.5">
        {/* Weather (mock) */}
        <div className="hidden items-center gap-2.5 rounded-xl border border-[#E1E5E1] bg-[#F7FAF7] px-3.5 py-2 md:flex">
          <CloudSun className="h-[22px] w-[22px] text-[#2E7D32]" strokeWidth={2} />
          <span className="flex flex-col leading-none">
            <span className="text-[13px] font-bold text-[#111111]">{BUYER_WEATHER.temp}</span>
            <span className="mt-0.5 text-[10.5px] font-medium text-[#777777]">{BUYER_WEATHER.city}</span>
          </span>
        </div>

        {/* Notifications (mock) */}
        <button
          type="button"
          aria-label={`${BUYER_NOTIFICATIONS} unread notifications`}
          className="relative grid h-11 w-11 place-items-center rounded-xl border border-[#E1E5E1] bg-white text-[#444444] transition-colors hover:bg-[#EAF6EA] hover:text-[#2E7D32]"
        >
          <Bell className="h-[19px] w-[19px]" strokeWidth={2.1} />
          <span className="absolute -top-1.5 -right-1.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {BUYER_NOTIFICATIONS}
          </span>
        </button>

        <span className="hidden h-9 w-px bg-[#E1E5E1] sm:block" aria-hidden="true" />

        {/* Buyer */}
        <button
          type="button"
          aria-label="Account menu"
          className="flex items-center gap-2.5 rounded-xl px-1.5 py-1 transition-colors hover:bg-[#F7FAF7]"
        >
          <span className="grid h-10 w-10 place-items-center rounded-full bg-[#7C3AED] font-display text-[13px] font-bold text-white">
            {BUYER.initials}
          </span>
          <span className="hidden flex-col items-start leading-tight md:flex">
            <span className="text-[13px] font-semibold text-[#111111]">{BUYER.name}</span>
            <span className="text-[11px] font-medium text-[#777777]">{BUYER.role}</span>
          </span>
          <ChevronDown className="hidden h-4 w-4 text-[#999999] md:block" />
        </button>
      </div>
    </header>
  );
}
