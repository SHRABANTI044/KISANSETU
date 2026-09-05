import { Link } from "react-router-dom";
import { ArrowRight, TrendingUp } from "lucide-react";
import FeatureHighlights from "./FeatureHighlights";
/*
 * NOTE FOR THE TEAM: the original reference background was not present in the
 * repository. `src/assets/images/hero-bg.jpg` is a faithful recreation of the
 * required composition (farmer right / luminous sky left / fields / river /
 * bridge / mandi + KisanSetu sign / tractor / mountains). Drop the original
 * artwork into `src/assets/images/hero-bg.jpg` (same filename) to use it.
 */
import heroBg from "../assets/images/hero-bg.jpg";

export default function HeroSection() {
  return (
    <section id="home" aria-label="Introduction" className="relative isolate overflow-hidden">
      {/* Background image — farmer stays on the right; left sky hosts the copy */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <img
          src={heroBg}
          alt=""
          className="h-full w-full object-cover object-[68%_center] md:object-[62%_center] lg:object-center"
        />
        {/* readability scrims (left wash for text, bottom fade for the features) */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/40 to-transparent sm:from-white/65 sm:via-white/28 lg:from-white/45 lg:via-white/12" />
        <div className="absolute inset-x-0 bottom-0 h-[46%] bg-gradient-to-t from-black/60 via-black/22 to-transparent" />
      </div>

      <div className="ks-container relative flex min-h-[640px] flex-col pt-[136px] sm:min-h-[700px] lg:min-h-[728px] lg:pt-[150px]">
        {/* Copy block — left aligned, sits over the open sky */}
        <div className="max-w-[580px]">
          <h1
            className="hero-item font-display text-[38px] leading-[1.08] font-bold tracking-[-0.015em] text-ks-dark sm:text-[52px] lg:text-[62px]"
            style={{ animationDelay: "60ms" }}
          >
            Bridging Farmers to
            <br />
            Better Markets
          </h1>
          <p
            className="hero-item mt-5 max-w-[500px] text-[16px] leading-[1.68] text-[#2b362d] sm:text-[19px]"
            style={{ animationDelay: "150ms" }}
          >
            Empowering farmers with real-time prices, direct buyers, and transparent
            transactions.
          </p>

          <div
            className="hero-item mt-8 flex flex-col gap-3.5 sm:flex-row sm:items-center sm:gap-4"
            style={{ animationDelay: "240ms" }}
          >
            <Link
              to="/register"
              className="group inline-flex h-[58px] w-full items-center justify-between gap-3 rounded-full bg-ks-green pr-2 pl-7 text-[16px] font-semibold text-white shadow-[0_16px_32px_-12px_rgba(22,128,60,0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-ks-dark sm:w-[196px]"
            >
              Get Started
              <span className="grid h-[42px] w-[42px] place-items-center rounded-full bg-white text-ks-green transition-transform duration-300 group-hover:translate-x-1">
                <ArrowRight className="h-[18px] w-[18px]" strokeWidth={2.5} />
              </span>
            </Link>
            <Link
              to="/market-prices"
              className="group inline-flex h-[58px] w-full items-center justify-center gap-2.5 rounded-full border-2 border-ks-green bg-white/95 px-7 text-[16px] font-semibold text-ks-dark backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-ks-light sm:w-[206px]"
            >
              <TrendingUp
                className="h-[19px] w-[19px] text-ks-green transition-transform duration-300 group-hover:scale-110"
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
