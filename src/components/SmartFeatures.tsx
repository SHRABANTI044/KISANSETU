import { Sparkles } from "lucide-react";
import { SMART_FEATURES } from "../data/site";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

export default function SmartFeatures() {
  return (
    <section
      aria-label="Smart features"
      className="relative isolate overflow-hidden bg-ks-deep py-20 sm:py-24"
    >
      {/* texture + glow */}
      <div className="bg-dots absolute inset-0 -z-10" aria-hidden="true" />
      <div
        className="absolute -top-40 left-1/2 -z-10 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-ks-green/30 blur-[130px]"
        aria-hidden="true"
      />

      <div className="ks-container">
        <Reveal>
          <SectionHeading
            tone="dark"
            eyebrow="AI Capabilities"
            title="Smart Features"
            description="Technology that helps farmers and buyers make better decisions."
          />
          <div className="mt-5 flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[12px] font-medium text-white/80">
              <Sparkles className="h-3.5 w-3.5 text-[#9fdcb0]" />
              Planned capabilities — rolling out progressively
            </span>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SMART_FEATURES.map((feature, i) => (
            <Reveal key={feature.title} delay={i * 70}>
              <article className="h-full rounded-[24px] border border-white/10 bg-white/[0.06] p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.1] sm:p-7">
                <span className="grid h-[50px] w-[50px] place-items-center rounded-2xl bg-ks-green text-white shadow-[0_14px_28px_-12px_rgba(0,0,0,0.5)] ring-1 ring-white/20">
                  <feature.icon className="h-[23px] w-[23px]" strokeWidth={2} />
                </span>
                <h3 className="mt-5 font-display text-[16px] leading-snug font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-white/70">{feature.desc}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
