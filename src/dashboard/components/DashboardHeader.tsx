import { Bell, ChevronDown, CloudSun, Menu } from "lucide-react";
import { FARMER_USER, WEATHER } from "../data/farmerDashboardData";

/** Sticky dashboard top header — weather, notifications and farmer profile (mock). */
export default function DashboardHeader({ onMenu }: { onMenu: () => void }) {
  return (
    <header className="sticky top-0 z-40 flex h-[76px] items-center justify-between gap-4 border-b border-[#E1E5E1] bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
      {/* Left — mobile menu */}
      <button
        type="button"
        onClick={onMenu}
        aria-label="Open dashboard menu"
        className="grid h-11 w-11 place-items-center rounded-xl border border-[#E1E5E1] text-[#111111] transition-colors hover:bg-[#EAF6EA] lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>
      <div className="hidden lg:block" aria-hidden="true" />

      {/* Right */}
      <div className="flex items-center gap-2.5 sm:gap-3.5">
        {/* Weather (mock) */}
        <div className="hidden items-center gap-2.5 rounded-xl border border-[#E1E5E1] bg-[#F7FAF7] px-3.5 py-2 sm:flex">
          <CloudSun className="h-[22px] w-[22px] text-[#2E7D32]" strokeWidth={2} />
          <span className="flex flex-col leading-none">
            <span className="text-[13px] font-bold text-[#111111]">{WEATHER.temp}</span>
            <span className="mt-0.5 text-[10.5px] font-medium text-[#777777]">{WEATHER.city}</span>
          </span>
        </div>

        {/* Notifications (mock) */}
        <button
          type="button"
          aria-label={`${FARMER_USER.notifications} unread notifications`}
          className="relative grid h-11 w-11 place-items-center rounded-xl border border-[#E1E5E1] bg-white text-[#444444] transition-colors hover:bg-[#EAF6EA] hover:text-[#2E7D32]"
        >
          <Bell className="h-[19px] w-[19px]" strokeWidth={2.1} />
          <span className="absolute -top-1.5 -right-1.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {FARMER_USER.notifications}
          </span>
        </button>

        <span className="hidden h-9 w-px bg-[#E1E5E1] sm:block" aria-hidden="true" />

        {/* User */}
        <button
          type="button"
          aria-label="Account menu"
          className="flex items-center gap-2.5 rounded-xl px-1.5 py-1 transition-colors hover:bg-[#F7FAF7]"
        >
          <span className="grid h-10 w-10 place-items-center rounded-full bg-[#2E7D32] font-display text-[13px] font-bold text-white">
            {FARMER_USER.initials}
          </span>
          <span className="hidden flex-col items-start leading-tight md:flex">
            <span className="text-[13px] font-semibold text-[#111111]">{FARMER_USER.name}</span>
            <span className="text-[11px] font-medium text-[#777777]">{FARMER_USER.role}</span>
          </span>
          <ChevronDown className="hidden h-4 w-4 text-[#999999] md:block" />
        </button>
      </div>
    </header>
  );
}
