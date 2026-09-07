import type { ReactNode } from "react";
import { cn } from "../utils/cn";

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  align?: "left" | "center";
  tone?: "light" | "dark";
  className?: string;
}

/** Consistent eyebrow + heading + description block used by every section. */
export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  tone = "light",
  className,
}: SectionHeadingProps) {
  const dark = tone === "dark";
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className
      )}
    >
      {eyebrow && <span className={dark ? "eyebrow-dark" : "eyebrow"}>{eyebrow}</span>}
      <h2
        className={cn(
          "max-w-3xl font-display text-[29px] leading-[1.16] font-bold tracking-[-0.015em] text-balance sm:text-[36px] lg:text-[40px]",
          dark ? "text-white" : "text-ks-dark"
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "max-w-2xl text-[15px] leading-[1.7] sm:text-[16.5px]",
            dark ? "text-white/70" : "text-ks-muted"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
