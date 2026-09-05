import { Link } from "react-router-dom";
import { ArrowRight, BadgeCheck, Check, MapPin, ShoppingBasket, Sprout } from "lucide-react";
import {
  BUYER_BUYER_POINTS,
  BUYER_REQUESTS,
  FARMER_BUYER_POINTS,
} from "../data/site";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import type { LucideIcon } from "lucide-react";

function RoleCard({
  icon: Icon,
  title,
  subtitle,
  points,
  cta,
  to,
  delay,
}: {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  points: string[];
  cta: string;
  to: string;
  delay: number;
}) {
  return (
    <Reveal delay={delay}>
      <article className="flex h-full flex-col rounded-[26px] border border-ks-border bg-white p-7 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-panel sm:p-8">
        <div className="flex items-center gap-4">
          <span className="grid h-[54px] w-[54px] place-items-center rounded-2xl bg-ks-green text-white shadow-[0_12px_22px_-10px_rgba(22,128,60,0.55)]">
            <Icon className="h-[26px] w-[26px]" strokeWidth={2} />
          </span>
          <div>
            <h3 className="font-display text-[19px] font-semibold text-ks-dark">{title}</h3>
            <p className="text-[13px] text-ks-muted">{subtitle}</p>
          </div>
        </div>
        <ul className="mt-6 flex flex-1 flex-col gap-3">
          {points.map((point) => (
            <li key={point} className="flex items-start gap-3">
              <span className="mt-[3px] grid h-[20px] w-[20px] shrink-0 place-items-center rounded-full bg-ks-light text-ks-green">
                <Check className="h-[12px] w-[12px]" strokeWidth={3} />
              </span>
              <span className="text-[14px] leading-relaxed text-[#37433a]">{point}</span>
            </li>
          ))}
        </ul>
        <Link
          to={to}
          className="group mt-6 inline-flex items-center gap-2 text-[14.5px] font-semibold text-ks-green transition-colors hover:text-ks-dark"
        >
          {cta}
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2.5} />
        </Link>
      </article>
    </Reveal>
  );
}

export default function BuyersSection() {
  return (
    <section id="buyers" aria-label="Connect with buyers" className="bg-ks-bg py-20 sm:py-24">
      <div className="ks-container">
        <Reveal>
          <SectionHeading
            eyebrow="Direct Connections"
            title="Connect with Buyers"
            description="Skip the middlemen. Farmers discover genuine buyers for their produce, and buyers find the crops they need — with clear requirements on both sides."
          />
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <RoleCard
            icon={Sprout}
            title="For Farmers"
            subtitle="Sell smarter, directly"
            points={FARMER_BUYER_POINTS}
            cta="Register as a Farmer"
            to="/register"
            delay={60}
          />
          <RoleCard
            icon={ShoppingBasket}
            title="For Buyers"
            subtitle="Source straight from farms"
            points={BUYER_BUYER_POINTS}
            cta="Register as a Buyer"
            to="/register"
            delay={160}
          />
        </div>

        {/* Sample buyer requirements (demo) */}
        <Reveal delay={80} className="mt-14">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h3 className="font-display text-[20px] font-semibold text-ks-dark">
                Buyer Requirements Near You
              </h3>
              <p className="mt-1 text-[13px] text-ks-muted">Sample listings shown for demonstration.</p>
            </div>
            <Link
              to="/buyers"
              className="group inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-ks-green hover:text-ks-dark"
            >
              View all buyers
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2.5} />
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {BUYER_REQUESTS.map((req, i) => (
              <article
                key={req.name}
                className="flex flex-col rounded-[22px] border border-ks-border bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-ks-green/40 hover:shadow-card"
                style={{ transitionDelay: `${i * 40}ms` }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-display text-[15.5px] leading-snug font-semibold text-ks-text">
                      {req.name}
                    </h4>
                    <p className="mt-1 flex items-center gap-1 text-[12.5px] text-ks-muted">
                      <MapPin className="h-3.5 w-3.5 text-ks-green" />
                      {req.location}
                    </p>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-ks-light px-2.5 py-1 text-[10.5px] font-semibold tracking-wide text-ks-green uppercase">
                    <BadgeCheck className="h-3 w-3" />
                    Verified
                  </span>
                </div>

                <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-ks-border/70 pt-4 text-[12.5px]">
                  <div>
                    <dt className="text-ks-muted">Crop</dt>
                    <dd className="mt-0.5 font-semibold text-ks-text">{req.crop}</dd>
                  </div>
                  <div>
                    <dt className="text-ks-muted">Quantity</dt>
                    <dd className="mt-0.5 font-semibold text-ks-text">{req.quantity}</dd>
                  </div>
                  <div>
                    <dt className="text-ks-muted">Quality</dt>
                    <dd className="mt-0.5 font-semibold text-ks-text">{req.quality}</dd>
                  </div>
                  <div>
                    <dt className="text-ks-muted">Offer</dt>
                    <dd className="mt-0.5 font-semibold text-ks-green">{req.offer}</dd>
                  </div>
                </dl>

                <Link
                  to="/buyers"
                  className="mt-5 inline-flex h-[42px] w-full items-center justify-center rounded-xl border-[1.5px] border-ks-green text-[13.5px] font-semibold text-ks-green transition-colors duration-200 hover:bg-ks-green hover:text-white"
                >
                  Contact Buyer
                </Link>
              </article>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
