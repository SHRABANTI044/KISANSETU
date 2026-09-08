import { Link } from "react-router-dom";
import { ClipboardList, Headset } from "lucide-react";

/** Wide RFQ promo card + Help & Support card. */
export default function ActionCards() {
  return (
    <div className="grid gap-5 xl:grid-cols-2">
      {/* RFQ card */}
      <section className="flex flex-wrap items-center justify-between gap-5 rounded-2xl border border-[#BFE3C5] bg-[#F0FAF1] p-5 sm:p-6">
        <div className="flex min-w-0 items-start gap-4">
          <span className="grid h-[52px] w-[52px] shrink-0 place-items-center rounded-2xl bg-[#2E7D32] text-white">
            <ClipboardList className="h-[25px] w-[25px]" strokeWidth={2} />
          </span>
          <div>
            <h2 className="font-display text-[17px] font-semibold text-[#155B32]">Need a Specific Supply?</h2>
            <p className="mt-1.5 max-w-sm text-[12.5px] leading-relaxed text-[#4A6B52]">
              Create a Request for Quotation (RFQ) and get offers from verified farmers.
            </p>
          </div>
        </div>
        <Link
          to="/buyer/requirements"
          className="inline-flex h-[46px] shrink-0 items-center rounded-xl bg-[#2E7D32] px-7 text-[14px] font-semibold text-white shadow-[0_12px_24px_-10px_rgba(46,125,50,0.55)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#256628]"
        >
          Create RFQ
        </Link>
      </section>

      {/* Help card */}
      <section className="flex flex-wrap items-center justify-between gap-5 rounded-2xl border border-[#E1E5E1] bg-white p-5 shadow-[0_10px_30px_-18px_rgba(17,17,17,0.12)] sm:p-6">
        <div className="flex min-w-0 items-start gap-4">
          <span className="grid h-[52px] w-[52px] shrink-0 place-items-center rounded-2xl bg-[#EAF6EA] text-[#2E7D32]">
            <Headset className="h-[25px] w-[25px]" strokeWidth={2} />
          </span>
          <div>
            <h2 className="font-display text-[17px] font-semibold text-[#111111]">Need Help?</h2>
            <p className="mt-1.5 text-[12.5px] leading-relaxed text-[#666666]">
              Our support team is here to assist you.
            </p>
          </div>
        </div>
        <Link
          to="/buyer/help-support"
          className="inline-flex h-[46px] shrink-0 items-center rounded-xl border-[1.5px] border-[#2E7D32] px-7 text-[14px] font-semibold text-[#2E7D32] transition-all duration-200 hover:bg-[#2E7D32] hover:text-white"
        >
          Contact Support
        </Link>
      </section>
    </div>
  );
}
