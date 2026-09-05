import { Link, useLocation, useNavigate } from "react-router-dom";
import type { MouseEvent as ReactMouseEvent } from "react";
import { TAGLINE } from "../data/site";
import { cn } from "../utils/cn";
import logoImg from "../assets/images/logo.png";

export function LogoMark({ className }: { className?: string }) {
  return (
    <img
      src={logoImg}
      alt="KisanSetu emblem"
      className={cn("h-12 w-12 rounded-full object-cover", className)}
    />
  );
}

export default function Logo({ onDark = false }: { onDark?: boolean }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // Logic: If already on the home page, smooth-scroll to top.
  // If on another page, navigate to Home.
  const handleHomeClick = (e: ReactMouseEvent<HTMLAnchorElement>) => {
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      window.history.replaceState(null, "", "/");
    } else {
      navigate("/");
    }
  };

  return (
    <Link
      to="/"
      onClick={handleHomeClick}
      aria-label="KisanSetu — home"
      className="group flex shrink-0 items-center gap-3 cursor-pointer"
    >
      <img
        src={logoImg}
        alt="KisanSetu"
        className="h-12 w-12 rounded-full object-cover transition-transform duration-300 group-hover:scale-[1.06]"
      />
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