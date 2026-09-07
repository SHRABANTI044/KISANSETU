import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import type { MouseEvent as ReactMouseEvent } from "react";
import { Menu, User, UserPlus, X } from "lucide-react";
import { SECTION_LINKS } from "../data/site";
import { cn } from "../utils/cn";
import Logo from "./Logo";
import { useAuth } from "../context/AuthContext";

function AuthButtons({ stacked = false, onNavigate }: { stacked?: boolean; onNavigate?: () => void }) {
  const { profile, isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated && profile) {
    return (
      <div className={cn("flex items-center gap-3", stacked && "w-full flex-col")}>
        <span className="text-[14px] font-medium text-ks-dark">
          Hi, <strong className="font-semibold">{profile?.full_name ? profile.full_name.split(" ")[0] : (profile?.email ? profile.email.split("@")[0] : "User")}</strong> ({profile?.role || "Member"})
        </span>
        <button
          type="button"
          onClick={async () => {
            await signOut();
            if (onNavigate) onNavigate();
            navigate("/");
          }}
          className="inline-flex h-[40px] items-center justify-center rounded-xl border border-red-200 bg-red-50 px-4 text-[13px] font-semibold text-red-600 transition-colors hover:bg-red-100"
        >
          Logout
        </button>
      </div>
    );
  }

    return (
      <div className={cn("flex items-center gap-3", stacked && "w-full flex-col sm:flex-row")}>
        <Link
          to="/login"
          onClick={onNavigate}
          className={cn(
            "inline-flex h-[46px] items-center justify-center gap-2 rounded-xl border-[1.6px] border-ks-green bg-white px-6 text-[15px] font-semibold text-ks-green transition-all duration-200 hover:bg-ks-light",
            stacked && "w-full sm:flex-1"
          )}
        >
          <User className="h-[18px] w-[18px]" strokeWidth={2.2} />
          Login
        </Link>
        <Link
          to="/register"
          onClick={onNavigate}
          className={cn(
            "inline-flex h-[46px] items-center justify-center gap-2 rounded-xl bg-ks-green px-6 text-[15px] font-semibold text-white shadow-[0_10px_22px_-10px_rgba(22,128,60,0.6)] transition-all duration-200 hover:bg-ks-dark",
            stacked && "w-full sm:flex-1"
          )}
        >
          <UserPlus className="h-[18px] w-[18px]" strokeWidth={2.2} />
          Sign Up
        </Link>
      </div>
    );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Close the mobile menu whenever the route changes */
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  /* Scroll-spy: highlight the landing-page section currently in view */
  useEffect(() => {
    if (pathname !== "/") {
      setActiveId(null);
      return;
    }
    setActiveId((current) => current ?? "home");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { rootMargin: "-30% 0px -62% 0px", threshold: 0 }
    );
    SECTION_LINKS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [pathname]);

  /** Smooth-scroll to a landing-page section (works from any route). */
  const goToSection = (e: ReactMouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setOpen(false);
    setActiveId(id);
    if (pathname === "/") {
      window.history.replaceState(null, "", `#${id}`);
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      navigate(`/#${id}`);
    }
  };

  const isActive = (id: string) => pathname === "/" && activeId === id;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b bg-white transition-shadow duration-300",
        scrolled ? "border-ks-border/80 shadow-nav" : "border-ks-border/60"
      )}
    >
      <div className="mx-auto flex h-[90px] w-full max-w-[1400px] items-center justify-between gap-6 px-5 sm:px-6 lg:px-8">
        <Logo />

        {/* Center navigation — desktop */}
        <nav aria-label="Primary" className="hidden items-center gap-6 xl:flex 2xl:gap-8">
          {SECTION_LINKS.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => goToSection(e, link.id)}
              aria-current={isActive(link.id) ? "location" : undefined}
              className={cn(
                "relative py-2 text-[15px] font-medium whitespace-nowrap transition-colors duration-200",
                isActive(link.id) ? "font-semibold text-ks-dark" : "text-ks-text hover:text-ks-green"
              )}
            >
              {link.label}
              <span
                aria-hidden="true"
                className={cn(
                  "absolute -bottom-[3px] left-1/2 h-[3px] w-6 -translate-x-1/2 rounded-full bg-ks-green transition-all duration-300",
                  isActive(link.id) ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
                )}
              />
            </a>
          ))}
        </nav>

        {/* Auth buttons — desktop */}
        <div className="hidden xl:block">
          <AuthButtons />
        </div>

        {/* Hamburger — mobile / tablet */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          className="grid h-11 w-11 place-items-center rounded-xl border border-ks-border text-ks-dark transition-colors hover:bg-ks-light xl:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile navigation drawer */}
      {open && (
        <div className="animate-menu-in absolute inset-x-0 top-full border-b border-ks-border bg-white shadow-[0_30px_50px_-20px_rgba(23,74,37,0.25)] xl:hidden">
          <nav aria-label="Mobile" className="mx-auto flex max-h-[calc(100dvh-90px)] w-full max-w-[1400px] flex-col gap-1 overflow-y-auto px-5 py-4 sm:px-6">
            {SECTION_LINKS.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => goToSection(e, link.id)}
                className={cn(
                  "flex items-center justify-between rounded-xl px-4 py-3 text-[15.5px] font-medium transition-colors",
                  isActive(link.id)
                    ? "bg-ks-light font-semibold text-ks-dark"
                    : "text-ks-text hover:bg-ks-bg hover:text-ks-green"
                )}
              >
                {link.label}
              </a>
            ))}
            <div className="mt-3 border-t border-ks-border/80 pt-4 pb-2">
              <AuthButtons stacked onNavigate={() => setOpen(false)} />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
