import { Link } from "react-router-dom";
import { ArrowRight, ShoppingBasket, Sprout } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { BUYER_DASH_TILES, FARMER_DASH_TILES } from "../data/site";
import type { DashTile } from "../data/site";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

function DashboardCard({
  icon: Icon,
  role,
  headline,
  tiles,
  delay,
}: {
  icon: LucideIcon;
  role: string;
  headline: string;
  tiles: DashTile[];
  delay: number;
}) {
  return (
    <Reveal delay={delay}>
      <article className="overflow-hidden rounded-[26px] border border-ks-border bg-white shadow-card">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-ks-border/70 bg-ks-light/70 px-6 py-5 sm:px-7">
          <div className="flex items-center gap-3.5">
            <span className="grid h-[46px] w-[46px] place-items-center rounded-2xl bg-ks-green text-white">
              <Icon className="h-[22px] w-[22px]" strokeWidth={2} />
            </span>
            <div>
              <h3 className="font-display text-[17px] font-semibold text-ks-dark">{role}</h3>
              <p className="text-[12px] text-ks-muted">{headline}</p>
            </div>
          </div>
          <Link
            to="/dashboard"
            className="group inline-flex items-center gap-1.5 rounded-full border-[1.5px] border-ks-green px-4 py-2 text-[12.5px] font-semibold text-ks-green transition-colors duration-200 hover:bg-ks-green hover:text-white"
          >
            Open preview
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" strokeWidth={2.5} />
          </Link>
        </header>

        <div className="grid grid-cols-1 gap-3 p-6 sm:grid-cols-2 sm:p-7">
          {tiles.map((tile) => (
            <div
              key={tile.label}
              className="flex items-center gap-3.5 rounded-2xl border border-ks-border/70 bg-ks-bg px-4 py-3.5 transition-colors duration-200 hover:border-ks-green/35 hover:bg-ks-light/60"
            >
              <span className="grid h-[40px] w-[40px] shrink-0 place-items-center rounded-full bg-white text-ks-green ring-1 ring-ks-border">
                <tile.icon className="h-[18px] w-[18px]" strokeWidth={2.1} />
              </span>
              <div className="min-w-0">
                <p className="font-display text-[15.5px] leading-tight font-semibold text-ks-dark">
                  {tile.value}
                </p>
                <p className="truncate text-[12px] text-ks-muted">{tile.label}</p>
              </div>
            </div>
          ))}
        </div>
      </article>
    </Reveal>
  );
}

export default function DashboardOverview() {
  return (
    <section id="dashboard" aria-label="Dashboard overview" className="bg-ks-bg py-20 sm:py-24">
      <div className="ks-container">
        <Reveal>
          <SectionHeading
            eyebrow="Personalised by Role"
            title="One Dashboard for Every User"
            description="The KisanSetu dashboard adapts to who you are. Farmers see prices, markets, produce lots and earnings; buyers see requirements, produce and transactions."
          />
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <DashboardCard
            icon={Sprout}
            role="Farmer Dashboard"
            headline="Prices, produce and earnings at a glance"
            tiles={FARMER_DASH_TILES}
            delay={80}
          />
          <DashboardCard
            icon={ShoppingBasket}
            role="Buyer Dashboard"
            headline="Requirements, produce and transactions"
            tiles={BUYER_DASH_TILES}
            delay={180}
          />
        </div>
      </div>
    </section>
  );
}
