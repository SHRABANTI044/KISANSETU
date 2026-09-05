import { HERO_FEATURES } from "../data/site";
import { cn } from "../utils/cn";

/**
 * Four feature columns that sit directly over the lower portion of the hero
 * image (white icon circles + white text + vertical separators), matching
 * the reference composition.
 */
export default function FeatureHighlights() {
  return (
    <ul
      aria-label="What KisanSetu offers"
       className="grid grid-cols-2 gap-x-2 gap-y-6 pb-6 lg:grid-cols-4 lg:gap-x-0"
    >
      {HERO_FEATURES.map((feature, i) => (
        <li
          key={feature.title}
          className={cn(
            "group flex flex-col items-center gap-4 px-3 text-center sm:px-5",
            i % 2 === 1 && "border-l border-white/25",
            i > 0 && "lg:border-l lg:border-white/30"
          )}
        >
          <span className="grid h-[60px] w-[60px] place-items-center rounded-full bg-white text-ks-green shadow-[0_14px_28px_-10px_rgba(10,40,20,0.45)] transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-[0_20px_34px_-10px_rgba(10,40,20,0.5)] sm:h-[66px] sm:w-[66px]">
            <feature.icon className="h-[25px] w-[25px] sm:h-[27px] sm:w-[27px]" strokeWidth={2.1} />
          </span>
          <span>
            <span className="block font-display text-[14.5px] leading-[1.3] font-semibold whitespace-pre-line text-white sm:text-[17.5px]">
              {feature.title}
            </span>
            <span className="mt-1.5 block text-[12px] leading-[1.55] whitespace-pre-line text-white/85 sm:text-[13.5px]">
              {feature.desc}
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
}
