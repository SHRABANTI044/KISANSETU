import { Link } from "react-router-dom";
import { ChevronRight, Phone } from "lucide-react";

/** Outlined "Login with Mobile Number" control → /login/mobile */
export default function MobileLoginOption() {
  return (
    <Link
      to="/login/mobile"
      className="group flex w-full items-center gap-4 rounded-2xl border-[1.5px] border-[#E1E5E1] bg-white p-4 text-left shadow-[0_8px_22px_-12px_rgba(17,17,17,0.14)] transition-all duration-200 hover:border-[#2E7D32]/60 hover:shadow-[0_14px_30px_-12px_rgba(46,125,50,0.25)]"
    >
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#EAF6EA]">
        <Phone className="h-[19px] w-[19px] text-[#2E7D32]" strokeWidth={2} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[14.5px] font-semibold text-[#111111]">
          Login with Mobile Number
        </span>
        <span className="mt-0.5 block text-[12.5px] text-[#666666]">
          We will send you an OTP to verify
        </span>
      </span>
      <ChevronRight
        className="h-5 w-5 shrink-0 text-[#9AA29A] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-[#2E7D32]"
        strokeWidth={2.2}
      />
    </Link>
  );
}
