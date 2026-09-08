import { Link } from "react-router-dom";
import { ArrowLeft, Hammer } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";

/**
 * Shared in-shell placeholder for dashboard sidebar modules that are not
 * built yet — keeps the dashboard chrome consistent (no page jumps).
 */
export default function DashboardComingSoonPage({ title }: { title: string }) {
  return (
    <DashboardLayout>
      <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center justify-center py-20 text-center">
        <span className="grid h-[72px] w-[72px] place-items-center rounded-[22px] bg-[#EAF6EA] text-[#2E7D32]">
          <Hammer className="h-[30px] w-[30px]" strokeWidth={1.9} />
        </span>
        <h1 className="mt-6 font-display text-[22px] font-bold text-[#111111]">{title}</h1>
        <p className="mt-2 max-w-sm text-[13.5px] leading-relaxed text-[#666666]">
          This module is on the roadmap and will be built on top of the same dashboard layout.
          For now, the Dashboard home shows its preview.
        </p>
        <Link
          to="/dashboard"
          className="group mt-7 inline-flex h-[46px] items-center gap-2 rounded-xl border-[1.5px] border-[#2E7D32] px-6 text-[13.5px] font-semibold text-[#2E7D32] transition-all duration-200 hover:bg-[#2E7D32] hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={2.4} />
          Back to Dashboard
        </Link>
      </div>
    </DashboardLayout>
  );
}
