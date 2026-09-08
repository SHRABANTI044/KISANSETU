import { Link } from "react-router-dom";
import { ArrowLeft, Hammer } from "lucide-react";
import BuyerDashboardLayout from "../layouts/BuyerDashboardLayout";

/**
 * In-shell placeholder for Buyer Dashboard modules that are not built yet —
 * keeps navigation functional without duplicating pages.
 */
export default function ModulePlaceholder({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <BuyerDashboardLayout>
      <div className="mx-auto flex w-full max-w-[1240px] flex-col items-center justify-center py-20 text-center">
        <span className="grid h-[72px] w-[72px] place-items-center rounded-[22px] bg-[#EAF6EA] text-[#2E7D32]">
          <Hammer className="h-[30px] w-[30px]" strokeWidth={1.9} />
        </span>
        <h1 className="mt-6 font-display text-[22px] font-bold text-[#111111]">{title}</h1>
        <p className="mt-2 max-w-sm text-[13.5px] leading-relaxed text-[#666666]">{description}</p>
        <Link
          to="/buyer/dashboard"
          className="group mt-7 inline-flex h-[46px] items-center gap-2 rounded-xl border-[1.5px] border-[#2E7D32] px-6 text-[13.5px] font-semibold text-[#2E7D32] transition-all duration-200 hover:bg-[#2E7D32] hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={2.4} />
          Back to Dashboard
        </Link>
      </div>
    </BuyerDashboardLayout>
  );
}
