import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import DashboardHeader from "./DashboardHeader";
import DashboardSidebar from "./DashboardSidebar";
import "../styles/dashboard.css";

/**
 * Dashboard shell: fixed left sidebar + sticky header + content area.
 * Chromeless by design (the marketing navbar/footer never appears here).
 */
export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();

  /* Close the drawer whenever the route changes */
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
      <DashboardSidebar className="fixed inset-y-0 left-0 z-40 hidden w-[264px] lg:block" />

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Dashboard menu">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <DashboardSidebar
            className="animate-menu-in absolute inset-y-0 left-0 w-[280px] shadow-2xl"
            onNavigate={() => setMobileOpen(false)}
          />
        </div>
      )}

      <div className="flex min-h-screen flex-col lg:pl-[264px]">
        <DashboardHeader onMenu={() => setMobileOpen(true)} />
        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-7 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
