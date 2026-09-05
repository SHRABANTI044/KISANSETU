import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  ChartLine,
  Info,
  MapPin,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import PriceSearch from "../components/PriceSearch";
import { cn } from "../utils/cn";

const MARKETS = [
  "Lasalgaon (Nashik)",
  "Nashik APMC",
  "Pune APMC",
  "Mumbai (Vashi)",
  "Nagpur APMC",
];

const BASE_PRICES: Record<string, number> = {
  onion: 1850,
  tomato: 1340,
  potato: 1120,
  wheat: 2275,
  rice: 3050,
  cabbage: 950,
  maize: 2050,
  cotton: 6620,
  sugarcane: 315,
};

function titleCase(value: string) {
  return value.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
}

/** Deterministic demo prices — replaced by real mandi data once the API is connected. */
function demoPrices(crop: string) {
  const key = crop.trim().toLowerCase();
  const seed = [...key].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const base = BASE_PRICES[key] ?? 1200 + (seed % 800);
  return MARKETS.map((market, i) => {
    const drift = ((seed + i * 7) % 9) - 4;
    const price = Math.max(1, Math.round(base * (0.94 + i * 0.05 + drift / 100)));
    const change = Math.round(((seed + i * 5) % 70) - 30) / 10;
    return { market, price, change };
  });
}

export default function MarketPricesPage() {
  const [params] = useSearchParams();
  const crop = params.get("crop") ?? "";
  const location = params.get("location") ?? "";

  const cropLabel = crop ? titleCase(crop) : "Onion";
  const rows = useMemo(() => demoPrices(crop || "onion"), [crop]);

  return (
    <div className="bg-ks-bg pb-24">
      {/* Page band */}
      <section className="border-b border-ks-border/70 bg-white">
        <div className="ks-container flex flex-col gap-6 pt-[138px] pb-10">
          <Link
            to="/"
            className="inline-flex w-fit items-center gap-2 text-[13px] font-semibold text-ks-muted transition-colors hover:text-ks-green"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="eyebrow">Market Prices</span>
              <h1 className="mt-4 font-display text-[30px] font-bold text-ks-dark sm:text-[38px]">
                Market Prices & Trends
              </h1>
              <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[14.5px] text-ks-muted">
                Showing demo prices for{" "}
                <span className="font-semibold text-ks-green">{cropLabel}</span>
                {location && (
                  <>
                    {" "}
                    near{" "}
                    <span className="inline-flex items-center gap-1 font-semibold text-ks-green">
                      <MapPin className="h-4 w-4" /> {titleCase(location)}
                    </span>
                  </>
                )}
              </p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full border border-dashed border-ks-green/40 bg-ks-light px-4 py-2 text-[12px] font-medium text-ks-dark/80">
              <Info className="h-3.5 w-3.5 text-ks-green" />
              Demo data — live mandi feed coming soon
            </span>
          </div>
          <PriceSearch />
        </div>
      </section>

      {/* Price table */}
      <section className="ks-container mt-10">
        <div className="overflow-hidden rounded-[24px] border border-ks-border bg-white shadow-card">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ks-border/70 px-6 py-5 sm:px-7">
            <h2 className="flex items-center gap-2.5 font-display text-[17px] font-semibold text-ks-dark">
              <ChartLine className="h-5 w-5 text-ks-green" />
              {cropLabel} — modal prices across markets
            </h2>
            <span className="text-[12.5px] text-ks-muted">per quintal · updated sample</span>
          </div>

          <ul className="divide-y divide-ks-border/70">
            {rows.map((row) => {
              const near =
                location &&
                row.market.toLowerCase().includes(location.toLowerCase());
              return (
                <li
                  key={row.market}
                  className={cn(
                    "flex flex-wrap items-center gap-3 px-6 py-4 transition-colors hover:bg-ks-bg sm:flex-nowrap sm:gap-5 sm:px-7",
                    near && "bg-ks-light/60"
                  )}
                >
                  <p className="min-w-[170px] flex-1 text-[14.5px] font-semibold text-ks-text">
                    {row.market}
                    {near && (
                      <span className="ml-2 rounded-full bg-ks-green px-2.5 py-0.5 align-middle text-[10px] font-semibold tracking-wide text-white uppercase">
                        Your location
                      </span>
                    )}
                  </p>
                  <p className="font-display text-[17px] font-semibold whitespace-nowrap text-ks-dark">
                    ₹{row.price.toLocaleString("en-IN")}
                    <span className="ml-1 font-sans text-[11.5px] font-medium text-ks-muted">/q</span>
                  </p>
                  <span
                    className={cn(
                      "inline-flex w-[86px] items-center justify-center gap-1 rounded-full px-2 py-1 text-[12px] font-semibold",
                      row.change >= 0 ? "bg-ks-light text-ks-green" : "bg-red-50 text-red-600"
                    )}
                  >
                    {row.change >= 0 ? (
                      <TrendingUp className="h-3.5 w-3.5" strokeWidth={2.6} />
                    ) : (
                      <TrendingDown className="h-3.5 w-3.5" strokeWidth={2.6} />
                    )}
                    {row.change >= 0 ? "+" : ""}
                    {row.change.toFixed(1)}%
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        <p className="mt-4 text-[12px] text-ks-muted/80">
          Prices shown here are generated sample data for frontend development. A real mandi /
          Agmarknet data source can be connected later without changing this UI.
        </p>
      </section>
    </div>
  );
}
