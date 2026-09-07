import { Link } from "react-router-dom";
import {
  BrainCircuit,
  ChartNoAxesColumn,
  Handshake,
  Headphones,
  ShieldCheck,
} from "lucide-react";
import { LogoMark } from "./Logo";
/* Reuses the existing project farmer asset (no new imagery added). */
import aboutFarmer from "../assets/images/about-farmer.jpg";

const BENEFITS = [
  {
    icon: ChartNoAxesColumn,
    title: "Real-time Market Prices",
    desc: "Stay updated with the latest market prices",
  },
  {
    icon: BrainCircuit,
    title: "AI Price Prediction",
    desc: "Get intelligent insights for better selling decisions",
  },
  {
    icon: Handshake,
    title: "Trusted Connections",
    desc: "Connect with verified buyers & farmers",
  },
  {
    icon: ShieldCheck,
    title: "Secure Transactions",
    desc: "Transparent & secure agri-trade",
  },
];

/** Brand wordmark for the auth pages — reuses the existing logo emblem; click → / */
function BrandWordmark() {
  return (
    <Link to="/" aria-label="Kishan Setu — back to home" className="group flex w-fit items-center gap-3">
      <LogoMark className="transition-transform duration-300 group-hover:scale-[1.04]" />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[22px] font-bold tracking-[-0.01em]">
          <span className="text-[#E8862D]">Kishan</span>{" "}
          <span className="text-[#2E7D32]">Setu</span>
        </span>
        <span className="mt-[5px] text-[9.2px] font-medium tracking-[0.015em] text-[#555555]">
          Connecting Farmers to Better Markets
        </span>
      </span>
    </Link>
  );
}

/**
 * Left agricultural / brand panel for the auth screens (~40% of the viewport
 * on desktop). The farmer stays visible in the lower area; a white veil keeps
 * the dark heading text readable (per the login reference).
 */
export default function LoginBrandPanel() {
  return (
    <aside className="relative isolate flex flex-col overflow-hidden lg:min-h-screen lg:w-[40.5%]">
      {/* Farmer / field photograph */}
      <img
        src={aboutFarmer}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover object-[center_20%]"
      />
      {/* Readability veil — heavy at top, fades out over the farmer */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/75 via-[58%] to-white/0"
      />

      <div className="relative z-10 flex flex-1 flex-col p-7 sm:p-9 xl:p-12">
        <BrandWordmark />

        <div className="mt-12 max-w-[440px] lg:mt-16">
          <h1 className="font-display text-[32px] leading-[1.16] font-bold tracking-[-0.01em] sm:text-[38px]">
            <span className="text-[#111111]">One Platform.</span>
            <br />
            <span className="text-[#2E7D32]">Two Powerful Roles.</span>
          </h1>
          <p className="mt-4 max-w-[340px] text-[14.5px] leading-relaxed text-[#555555]">
            Login as a Farmer or Buyer to access your personalized dashboard
          </p>
        </div>

        <ul className="mt-9 flex max-w-[400px] flex-col gap-5">
          {BENEFITS.map((benefit) => (
            <li key={benefit.title} className="flex items-start gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#EAF6EA] shadow-sm">
                <benefit.icon className="h-[20px] w-[20px] text-[#2E7D32]" strokeWidth={2} />
              </span>
              <span>
                <span className="block text-[14.5px] font-semibold text-[#111111]">
                  {benefit.title}
                </span>
                <span className="mt-0.5 block text-[12.5px] leading-snug text-[#555555]">
                  {benefit.desc}
                </span>
              </span>
            </li>
          ))}
        </ul>

        <div className="flex-1" aria-hidden="true" />

        {/* Help card — sits over the farmer/field area like the reference */}
        <div className="mt-10 w-fit max-w-full rounded-2xl border border-black/5 bg-white p-4 pr-7 shadow-[0_18px_44px_-18px_rgba(23,74,37,0.4)]">
          <div className="flex items-center gap-3.5">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#EAF6EA]">
              <Headphones className="h-[20px] w-[20px] text-[#2E7D32]" strokeWidth={2} />
            </span>
            <div>
              <p className="text-[13.5px] font-bold text-[#111111]">Need help?</p>
              <p className="mt-0.5 text-[12px] text-[#555555]">Call us at 1800-123-5578</p>
              <p className="text-[12px] text-[#555555]">SMS KRISHI to 5675</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
