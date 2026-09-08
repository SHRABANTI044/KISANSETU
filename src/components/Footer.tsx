import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import {
  FOOTER_BUYER_LINKS,
  FOOTER_FARMER_LINKS,
  FOOTER_QUICK_LINKS,
  TAGLINE,
} from "../data/site";
import Logo from "./Logo";

/* Social brand marks drawn in Lucide's stroke style (not exported by the
   installed lucide-react version, so they are inlined here). */
function BrandIcon({ label, children }: { label: string; children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[16px] w-[16px]"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label={label}
    >
      {children}
    </svg>
  );
}

const SOCIALS = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/share/1FLTUsh1qV/",
    icon: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/prerona_0017?igsi=NXUyd3dhOHZocndq",
    icon: (
      <>
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <path d="M16 11.37a4 4 0 1 1-7.914 1.174A4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </>
    ),
  },
  {
    label: "Twitter / X",
    href: "https://x.com/Ranjita_1001",
    icon: (
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    ),
  },
    {
    label: "GitHub",
    href: "https://github.com/Ranjita0017", // <-- Paste your GitHub link here
    icon: (
      <>
        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
        <path d="M9 18c-4.51 2-5-2-7-2" />
      </>
    ),
  },
  {
    label: "LinkedIn",
    href: "www.linkedin.com/in/ranjita-das",
    icon: (
      <>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </>
    ),
  },
];

function LinkColumn({ title, links }: { title: string; links: { label: string; to: string }[] }) {
  return (
    <nav aria-label={title}>
      <h3 className="font-display text-[14px] font-semibold tracking-[0.08em] text-white uppercase">
        {title}
      </h3>
      <ul className="mt-5 flex flex-col gap-3">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              to={link.to}
              className="text-[13.5px] text-white/65 transition-colors duration-200 hover:text-white"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default function Footer() {
  return (
    <footer className="bg-ks-deep text-white">
      <div className="ks-container grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1.1fr_1.1fr_1.35fr] lg:gap-10">
        {/* Brand */}
        <div>
          <Logo onDark />
          <p className="mt-5 max-w-[280px] text-[13.5px] leading-relaxed text-white/65">
            {TAGLINE}. A digital agricultural marketplace for prices, buyers, deals, orders and
            payments.
          </p>
          <div className="mt-6 flex items-center gap-2.5">
            {SOCIALS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"               /* <-- Opens in a new tab / app */
                rel="noopener noreferrer"     /* <-- Security best practice */
                aria-label={`KisanSetu on ${social.label}`}
                className="grid h-[38px] w-[38px] place-items-center rounded-full border border-white/15 bg-white/5 text-white/70 transition-all duration-200 hover:border-ks-green hover:bg-ks-green hover:text-white"
              >
                <BrandIcon label={social.label}>{social.icon}</BrandIcon>
              </a>
            ))}
          </div>
        </div>

        <LinkColumn title="Quick Links" links={FOOTER_QUICK_LINKS} />
        <LinkColumn title="For Farmers" links={FOOTER_FARMER_LINKS} />
        <LinkColumn title="For Buyers" links={FOOTER_BUYER_LINKS} />

        {/* Contact */}
        <div>
          <h3 className="font-display text-[14px] font-semibold tracking-[0.08em] text-white uppercase">
            Contact
          </h3>
          <ul className="mt-5 flex flex-col gap-4 text-[13.5px] text-white/65">
            <li>
              <a href="https://mail.google.com/mail/?view=cm&fs=1&to=SIH.KisanSetu123@gmail.com"  target="_blank"
                rel="noopener noreferrer" className="flex items-center gap-3 transition-colors hover:text-white">
                <span className="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-full border border-white/12 bg-white/5 text-[#9fdcb0]">
                  <Mail className="h-[15px] w-[15px]" />
                </span>
                SIH.KisanSetu123@gmail.com
              </a>
            </li>
            <li>
              <a href="tel:+919876543210" className="flex items-center gap-3 transition-colors hover:text-white">
                <span className="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-full border border-white/12 bg-white/5 text-[#9fdcb0]">
                  <Phone className="h-[15px] w-[15px]" />
                </span>
                +91 74394 61622
              </a>
            </li>
            <li className="flex items-center gap-3">
              <span className="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-full border border-white/12 bg-white/5 text-[#9fdcb0]">
                <MapPin className="h-[15px] w-[15px]" />
              </span>
              Kolkata, West Bengal, India
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="ks-container flex flex-col items-center justify-between gap-3 py-6 text-center text-[12.5px] text-white/50 sm:flex-row sm:text-left">
          <p>© {new Date().getFullYear()} KisanSetu. All rights reserved.</p>
          <p className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1">
            <a href="#" className="transition-colors hover:text-white">Privacy Policy</a>
            <a href="#" className="transition-colors hover:text-white">Terms of Service</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
