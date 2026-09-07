import { ChevronDown, LogOut, Menu, UserRound } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FARMER_USER } from "../data/farmerDashboardData";

/** Sticky dashboard top header with the account menu. */
export default function DashboardHeader({ onMenu }: { onMenu: () => void }) {
  const navigate = useNavigate();
  const { profile, signOut } = useAuth();
  const [accountOpen, setAccountOpen] = useState(false);
  const displayName = profile?.full_name || FARMER_USER.name;
  const displayRole = profile?.role === "buyer" ? "Buyer" : FARMER_USER.role;
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || FARMER_USER.initials;
  const profileRoute = profile?.role === "buyer" ? "/buyer-profile" : "/farmer-profile";

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

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

        {/* User */}
        <div className="relative">
          <button
            type="button"
            aria-label="Account menu"
            aria-expanded={accountOpen}
            onClick={() => setAccountOpen((open) => !open)}
            className="flex items-center gap-2.5 rounded-xl px-1.5 py-1 transition-colors hover:bg-[#F7FAF7]"
          >
          <span className="grid h-10 w-10 place-items-center rounded-full bg-[#2E7D32] font-display text-[13px] font-bold text-white">
            {initials}
          </span>
          <span className="hidden flex-col items-start leading-tight md:flex">
            <span className="text-[13px] font-semibold text-[#111111]">{displayName}</span>
            <span className="text-[11px] font-medium text-[#777777]">{displayRole}</span>
          </span>
            <ChevronDown className={`hidden h-4 w-4 text-[#999999] transition-transform md:block ${accountOpen ? "rotate-180" : ""}`} />
          </button>
          {accountOpen && (
            <div className="absolute right-0 top-[calc(100%+10px)] z-50 w-56 rounded-2xl border border-[#E1E5E1] bg-white p-2 shadow-xl">
              <button
                type="button"
                onClick={() => { setAccountOpen(false); navigate("/dashboard/profile"); }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-semibold text-[#222222] hover:bg-[#EAF6EA]"
              >
                <UserRound className="h-4 w-4 text-[#2E7D32]" />
                View profile
              </button>
              <button
                type="button"
                onClick={() => { setAccountOpen(false); navigate(profileRoute); }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-semibold text-[#222222] hover:bg-[#EAF6EA]"
              >
                <UserRound className="h-4 w-4 text-[#2E7D32]" />
                Edit profile
              </button>
              <div className="my-1 border-t border-[#E1E5E1]" />
              <button
                type="button"
                onClick={handleSignOut}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-semibold text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
