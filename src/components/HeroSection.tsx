import { Link } from "react-router-dom";
import { ArrowRight, TrendingUp } from "lucide-react";
import FeatureHighlights from "./FeatureHighlights";
import { useAuth } from "../context/AuthContext";
/*
 * NOTE FOR THE TEAM: the original reference background was not present in the
 * repository. `src/assets/images/hero-bg.jpg` is a faithful recreation of the
 * required composition (farmer right / luminous sky left / fields / river /
 * bridge / mandi + KisanSetu sign / tractor / mountains). Drop the original
 * artwork into `src/assets/images/hero-bg.jpg` (same filename) to use it.
 */
import heroBg from "../assets/images/hero-bg.jpg";

export default function HeroSection() {
  const { isAuthenticated, profile } = useAuth();
  const getStartedRoute = !isAuthenticated
    ? "/register"
    : !profile?.profile_completed
    ? (profile?.role === "buyer" ? "/buyer-profile" : "/farmer-profile")
    : "/dashboard";
  return (
    <section id="home" aria-label="Introduction" className="relative isolate overflow-hidden">
      {/* Background image — farmer stays on the right; left sky hosts the copy */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <img
          src={heroBg}
          alt="KisanSetu background"
          className="h-full w-full object-cover object-[75%_center] sm:object-[70%_center] lg:object-[80%_center]"
        />
        {/* readability scrims (left wash for text, bottom fade for the features) */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/40 to-transparent sm:from-white/65 sm:via-white/28 lg:from-white/45 lg:via-white/12" />
        <div className="absolute inset-x-0 bottom-0 h-[46%] bg-gradient-to-t from-black/60 via-black/22 to-transparent" />
      </div>

        <div className="ks-container relative flex min-h-[500px] sm:min-h-[550px] lg:min-h-[580px] flex-col pt-[105px] lg:pt-[115px] pb-6">
        <div className="max-w-[520px]">
          {/* Subtle pill tag */}
          <span className="hero-item eyebrow mb-4" style={{ animationDelay: "30ms" }}>
            Direct Agricultural Marketplace
          </span>

          {/* Calibrated, pleasant heading */}
          <h1
            className="hero-item font-display text-[28px] leading-[1.18] font-bold tracking-tight text-ks-dark sm:text-[38px] lg:text-[44px]"
            style={{ animationDelay: "80ms" }}
          >
            Bridging Farmers to
            <br />
            Better Markets
          </h1>

          {/* Eye-soothing subtitle */}
          <p
            className="hero-item mt-3 max-w-[460px] text-[14.5px] leading-[1.65] font-medium text-[#1e2e21] sm:text-[16px]"
            style={{ animationDelay: "160ms" }}
          >
            Empowering farmers with real-time prices, direct buyers, and transparent transactions.
          </p>

          <div
            className="hero-item mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3.5"
            style={{ animationDelay: "240ms" }}
          >
            <Link
              to={getStartedRoute}
              className="group inline-flex h-[48px] w-full items-center justify-between gap-2.5 rounded-full bg-ks-green pr-1.5 pl-6 text-[14.5px] font-semibold text-white shadow-[0_12px_24px_-10px_rgba(22,128,60,0.55)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-ks-dark sm:w-[175px]"
            >
              Get Started
              <span className="grid h-[36px] w-[36px] place-items-center rounded-full bg-white text-ks-green transition-transform duration-300 group-hover:translate-x-0.5">
                <ArrowRight className="h-[16px] w-[16px]" strokeWidth={2.5} />
              </span>
            </Link>
            <Link
              to="/market-prices"
              className="group inline-flex h-[48px] w-full items-center justify-center gap-2 rounded-full border-2 border-ks-green bg-white/95 px-6 text-[14.5px] font-semibold text-ks-dark backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-ks-light sm:w-[175px]"
            >
              <TrendingUp
                className="h-[17px] w-[17px] text-ks-green transition-transform duration-300 group-hover:scale-110"
                strokeWidth={2.4}
              />
              Explore Prices
            </Link>
          </div>
        </div>

        {/* pushes the features row to the lower portion of the hero */}
        <div className="flex-1" aria-hidden="true" />

        <div className="hero-item pt-10" style={{ animationDelay: "360ms" }}>
          <FeatureHighlights />
        </div>
      </div>
    </section>
  );
}
