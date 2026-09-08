import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import BuyerHeader from "../components/BuyerHeader";
import BuyerSidebar from "../components/BuyerSidebar";

/**
 * Buyer dashboard shell: fixed left sidebar + sticky header + content area.
 * Chromeless by design (the marketing navbar/footer never appears here).
 * `onSearch` lets a page consume the header search query (e.g. to filter lists).
 */
export default function BuyerDashboardLayout({
  children,
  searchValue = "",
  onSearch,
}: {
  children: ReactNode;
  searchValue?: string;
  onSearch?: (value: string) => void;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMobileOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="min-h-screen bg-[#F7FAF7]">
      {/* Desktop sidebar */}
      <BuyerSidebar className="fixed inset-y-0 left-0 z-40 hidden w-[264px] lg:block" />

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Buyer dashboard menu">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <BuyerSidebar
            className="animate-menu-in absolute inset-y-0 left-0 w-[280px] shadow-2xl"
            onNavigate={() => setMobileOpen(false)}
          />
        </div>
      )}

      <div className="flex min-h-screen flex-col lg:pl-[264px]">
        <BuyerHeader onMenu={() => setMobileOpen(true)} searchValue={searchValue} onSearch={onSearch ?? (() => {})} />
        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-7 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
