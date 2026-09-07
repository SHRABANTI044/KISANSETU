import { HOW_IT_WORKS } from "../data/site";
import { cn } from "../utils/cn";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

export default function HowItWorks() {
  return (
    <section id="how-it-works" aria-label="How KisanSetu works" className="py-20 sm:py-24">
      <div className="ks-container">
        <Reveal>
          <SectionHeading
            eyebrow="Getting Started"
            title="How KisanSetu Works"
            description="From creating an account to completing a transparent agricultural deal."
          />
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {HOW_IT_WORKS.map((step, i) => (
            <Reveal
              key={step.num}
              delay={i * 60}
              className={cn(i === HOW_IT_WORKS.length - 1 && "lg:col-start-2")}
            >
              <article className="group h-full rounded-[24px] border border-ks-border bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-ks-green/40 hover:shadow-card">
                <div className="flex items-start justify-between">
                  <span
                    aria-hidden="true"
                    className="font-display text-[46px] leading-none font-bold text-ks-green/15 transition-colors duration-300 group-hover:text-ks-green/25"
                  >
                    {step.num}
                  </span>
                  <span className="grid h-[48px] w-[48px] place-items-center rounded-2xl bg-ks-light text-ks-green transition-colors duration-300 group-hover:bg-ks-green group-hover:text-white">
                    <step.icon className="h-[22px] w-[22px]" strokeWidth={2} />
                  </span>
                </div>
                <h3 className="mt-5 font-display text-[17px] font-semibold text-ks-dark">{step.title}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-ks-muted">{step.desc}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
