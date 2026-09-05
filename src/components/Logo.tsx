import { Link } from "react-router-dom";
import { TAGLINE } from "../data/site";
import { cn } from "../utils/cn";

/**
 * KisanSetu logo.
 *
 * NOTE: No original logo asset was found in the project, so this is a
 * faithful recreation (circular field emblem + sun + green/orange wordmark).
 * To use the official logo instead, save it as `src/assets/images/logo.png`
 * and swap the <LogoMark /> render below for an <img> tag.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 56 56"
      className={cn("h-12 w-12 shrink-0", className)}
      role="img"
      aria-label="KisanSetu emblem"
    >
      {/* outer ring */}
      <circle cx="28" cy="28" r="26.5" fill="#ffffff" stroke="#16803C" strokeWidth="2.6" />
      {/* sky */}
      <circle cx="28" cy="28" r="24" fill="#EAF6EA" />
      {/* sun */}
      <g stroke="#F2A93B" strokeWidth="1.7" strokeLinecap="round">
        <line x1="37" y1="11.5" x2="37" y2="14" />
        <line x1="44.5" y1="19" x2="42.6" y2="19.9" />
        <line x1="44" y1="27.5" x2="41.5" y2="27.5" />
        <line x1="29.5" y1="12.5" x2="31" y2="14.4" />
      </g>
      <circle cx="37" cy="20" r="5.4" fill="#F2A93B" />
      <circle cx="35.2" cy="18.2" r="1.6" fill="#FBD48A" />
      {/* hills */}
      <path d="M4 33c5.5-7.8 12-9.4 19.4-5.6 3.7 1.9 6.8 1.6 10.6-1 5-3.4 9.6-2.9 13.9 1.4 2 2 3.5 4.2 4.1 6.2v8a24 24 0 0 1-48 0Z" fill="#4FA963" />
      <path d="M4 38c6-6.4 12.5-6.8 19.5-2.6 3.6 2.1 6.9 2.2 10.9.3 5.4-2.6 10-2 13.6 2.1l4 4.4a24 24 0 0 1-48 0Z" fill="#16803C" />
      {/* field ridges */}
      <g stroke="#155B32" strokeWidth="1.5" strokeLinecap="round" opacity="0.85" fill="none">
        <path d="M13 44.5c4.5-2.6 9.5-2.6 14.5-.4" />
        <path d="M28 47.5c4.5-2.2 9-2.2 13.5-.2" />
      </g>
      {/* sprout */}
      <path d="M28 39.5v-8" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
      <path d="M28 34.2c-3.6-.4-5.5-2.3-6.1-5.5 3.6.4 5.5 2.3 6.1 5.5Z" fill="#ffffff" />
      <path d="M28 32.2c.7-3.2 2.6-5 6.1-5.3-.7 3.2-2.6 4.9-6.1 5.3Z" fill="#BFE3C5" />
    </svg>
  );
}

export default function Logo({ onDark = false }: { onDark?: boolean }) {
  return (
    <Link
      to="/"
      aria-label="KisanSetu — home"
      className="group flex shrink-0 items-center gap-3"
    >
      <LogoMark className="transition-transform duration-300 group-hover:scale-[1.04]" />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[22.5px] font-bold tracking-[-0.01em]">
          <span className="text-ks-orange">Kisan</span>
          <span className={onDark ? "text-white" : "text-ks-green"}>Setu</span>
        </span>
        <span
          className={cn(
            "mt-[5px] text-[9.2px] font-medium tracking-[0.015em]",
            onDark ? "text-white/60" : "text-ks-muted/85"
          )}
        >
          {TAGLINE}
        </span>
      </span>
    </Link>
  );
}
