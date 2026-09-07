import { Check } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import Reveal from "./Reveal";

/** Centered pill + title + subtitle used for the Farmer / Buyer subsections. */
export function FeatureSubHeader({
  tag,
  title,
  subtitle,
}: {
  tag: string;
  title: string;
  subtitle: string;
}) {
  return (
    <Reveal className="flex flex-col items-center gap-3 text-center">
      <span className="rounded-full bg-ks-green px-4 py-1.5 text-[11px] font-semibold tracking-[0.16em] text-white uppercase">
        {tag}
      </span>
      <h3 className="font-display text-[24px] font-bold tracking-[-0.01em] text-ks-dark sm:text-[28px]">
        {title}
      </h3>
      <p className="max-w-xl text-[14.5px] leading-relaxed text-ks-muted">{subtitle}</p>
    </Reveal>
  );
}

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  desc: string;
  /** Optional supporting bullet points */
  points?: string[];
  /** Optional corner chip (e.g. "Where should I sell?") */
  chip?: string;
  /** Optional honesty note shown in a dashed box (estimates, sample data…) */
  note?: string;
  delay?: number;
  children?: ReactNode;
}

export default function FeatureCard({
  icon: Icon,
  title,
  desc,
  points,
  chip,
  note,
  delay = 0,
  children,
}: FeatureCardProps) {
  return (
    <Reveal delay={delay} className="h-full">
      <article className="group flex h-full flex-col rounded-[24px] border border-ks-border bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-ks-green/40 hover:shadow-card sm:p-7">
        <div className="flex items-start justify-between gap-3">
          <span className="grid h-[52px] w-[52px] place-items-center rounded-2xl bg-ks-light text-ks-green transition-colors duration-300 group-hover:bg-ks-green group-hover:text-white">
            <Icon className="h-[24px] w-[24px]" strokeWidth={2} />
          </span>
          {chip && (
            <span className="rounded-full border border-ks-green/25 bg-ks-light px-3 py-1.5 text-[10.5px] font-bold tracking-[0.06em] text-ks-green uppercase">
              {chip}
            </span>
          )}
        </div>
        <h4 className="mt-5 font-display text-[16.5px] font-semibold text-ks-dark">{title}</h4>
        <p className="mt-2 text-[13.5px] leading-relaxed text-ks-muted">{desc}</p>
        {points && (
          <ul className="mt-4 flex flex-col gap-2">
            {points.map((point) => (
              <li key={point} className="flex items-start gap-2.5 text-[12.5px] font-medium text-[#37433a]">
                <span className="mt-[1px] grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full bg-ks-light text-ks-green">
                  <Check className="h-[11px] w-[11px]" strokeWidth={3} />
                </span>
                {point}
              </li>
            ))}
          </ul>
        )}
        {children}
        {note && (
          <p className="mt-4 rounded-lg border border-dashed border-ks-green/35 bg-ks-light/60 px-3.5 py-2.5 text-[11.5px] leading-relaxed text-ks-dark/75">
            {note}
          </p>
        )}
      </article>
    </Reveal>
  );
}
