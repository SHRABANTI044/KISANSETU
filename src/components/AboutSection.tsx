import { Check, Handshake, Quote } from "lucide-react";
import aboutImg from "../assets/images/about-farmer.jpg";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const ABOUT_AIMS = [
  "Farmers discover market information",
  "Farmers identify suitable selling opportunities",
  "Farmers connect with potential buyers",
  "Buyers discover agricultural produce",
  "Buyers connect with suitable farmers",
  "Both sides manage deals and orders transparently",
];

export default function AboutSection() {
  return (
    <section id="about" aria-label="About KisanSetu" className="py-20 sm:py-24">
      <div className="ks-container grid items-center gap-14 lg:grid-cols-2 lg:gap-16">
        {/* Visual */}
        <Reveal>
          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute -inset-3 rounded-[32px] border-2 border-ks-green/15"
            />
            <div
              aria-hidden="true"
              className="absolute -top-6 -left-6 h-24 w-24 rounded-tl-[34px] border-t-[3px] border-l-[3px] border-ks-green/30"
            />
            <img
              src={aboutImg}
              alt="Farmer smiling while holding a basket of freshly harvested vegetables in his field"
              className="relative aspect-[4/3.5] w-full rounded-[26px] object-cover"
              loading="lazy"
            />
            <div className="absolute -bottom-7 left-5 flex items-center gap-3.5 rounded-2xl border border-ks-border bg-white px-5 py-4 shadow-panel sm:left-8">
              <span className="grid h-[46px] w-[46px] place-items-center rounded-full bg-ks-green text-white">
                <Handshake className="h-[22px] w-[22px]" strokeWidth={2} />
              </span>
              <div>
                <p className="font-display text-[15px] leading-tight font-semibold text-ks-dark">
                  Farmer-first, always
                </p>
                <p className="text-[12px] text-ks-muted">Every feature designed around growers</p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Copy */}
        <Reveal delay={140}>
          <SectionHeading
            align="left"
            eyebrow="About Us"
            title="About KisanSetu"
            description="KisanSetu is a digital agricultural marketplace designed to bridge the gap between farmers and buyers. The platform aims to help both sides of the market work better together:"
          />

          <ul className="mt-7 grid gap-3 sm:grid-cols-2">
            {ABOUT_AIMS.map((aim) => (
              <li key={aim} className="flex items-start gap-3">
                <span className="mt-[2px] grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full bg-ks-light text-ks-green">
                  <Check className="h-[13px] w-[13px]" strokeWidth={3} />
                </span>
                <span className="text-[13.5px] leading-snug font-medium text-[#37433a]">{aim}</span>
              </li>
            ))}
          </ul>

          <figure className="mt-8 rounded-2xl border-l-4 border-ks-green bg-ks-light p-5 sm:p-6">
            <Quote className="h-5 w-5 text-ks-green" aria-hidden="true" />
            <blockquote className="mt-2.5 text-[15px] leading-[1.7] font-medium text-ks-dark">
              Our mission is to empower farmers with better market information, direct buyer
              connections and transparent digital transactions.
            </blockquote>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
