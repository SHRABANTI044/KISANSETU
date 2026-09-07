import tomatoImg from "../../assets/images/lots/tomato.jpg";
import onionImg from "../../assets/images/lots/onion.jpg";
import potatoImg from "../../assets/images/lots/potato.jpg";
import chilliImg from "../../assets/images/lots/green-chilli.jpg";
import cauliflowerImg from "../../assets/images/lots/cauliflower.jpg";

/**
 * FRONTEND MOCK MARKET DATA + tiny derived-data service.
 * Structured so a real mandi/market API (and later an ML price-prediction
 * model) can replace these objects without touching the UI components.
 */

export type CropKey =
  | "tomato"
  | "onion"
  | "potato"
  | "green-chilli"
  | "cauliflower"
  | "wheat"
  | "rice"
  | "cotton";

export type TimeRange = "7d" | "30d" | "3m" | "1y";

export interface PricePoint {
  label: string;
  price: number;
}

export interface PriceStats {
  min: number;
  max: number;
  avg: number;
  weeklyChange: number;
}

export interface CropPrediction {
  price: number;
  days: string;
  increasePct: string;
  note: string;
  recommendation: string;
}

export interface MandiRow {
  market: string;
  location: string;
  min: number;
  max: number;
  avg: number;
  change: number;
  distance: string;
}

export interface HistoryRow {
  date: string;
  min: number;
  max: number;
  avg: number;
}

export interface CropData {
  key: CropKey;
  label: string;
  image?: string;
  varieties: string[];
  season: string;
  unit: string;
  stats: PriceStats;
  series7d: PricePoint[];
  prediction: CropPrediction;
  mandis: MandiRow[];
  history: HistoryRow[];
}

/* ------------------------------ 7-day series ------------------------------ */

const WEEK_LABELS = ["19 May", "20 May", "21 May", "22 May", "23 May", "24 May", "25 May"];

const WEEK: Record<CropKey, number[]> = {
  tomato: [18.5, 19.2, 18.0, 21.0, 22.5, 23.0, 21.2],
  onion: [15.8, 16.4, 15.5, 16.9, 17.6, 17.2, 16.5],
  potato: [13.9, 14.5, 13.5, 15.1, 15.8, 15.2, 14.8],
  "green-chilli": [35.0, 36.5, 34.0, 38.0, 41.0, 42.0, 38.5],
  cauliflower: [21.5, 22.0, 20.5, 23.5, 25.0, 26.0, 24.0],
  wheat: [23.2, 23.8, 22.9, 24.4, 25.1, 24.8, 24.5],
  rice: [29.5, 30.2, 29.0, 31.5, 32.4, 33.0, 32.0],
  cotton: [63.0, 64.5, 62.0, 66.0, 68.5, 69.0, 68.0],
};

const STATS: Record<CropKey, PriceStats> = {
  tomato: { min: 18.0, max: 24.5, avg: 21.2, weeklyChange: 8 },
  onion: { min: 14.5, max: 19.0, avg: 16.5, weeklyChange: 6 },
  potato: { min: 12.8, max: 17.2, avg: 14.8, weeklyChange: 5 },
  "green-chilli": { min: 33.0, max: 43.5, avg: 38.5, weeklyChange: 12 },
  cauliflower: { min: 20.0, max: 27.5, avg: 24.0, weeklyChange: 9 },
  wheat: { min: 22.0, max: 26.2, avg: 24.5, weeklyChange: 4 },
  rice: { min: 28.5, max: 34.3, avg: 32.0, weeklyChange: 7 },
  cotton: { min: 60.0, max: 71.0, avg: 68.0, weeklyChange: 8 },
};

const TOMATO_HISTORY: HistoryRow[] = [
  { date: "25 May 2025", min: 18.0, max: 24.5, avg: 21.2 },
  { date: "24 May 2025", min: 20.0, max: 26.0, avg: 23.0 },
  { date: "23 May 2025", min: 19.0, max: 25.0, avg: 22.5 },
  { date: "22 May 2025", min: 18.0, max: 24.0, avg: 21.0 },
  { date: "21 May 2025", min: 16.0, max: 20.0, avg: 18.0 },
];

const TOMATO_MANDIS: MandiRow[] = [
  { market: "Ahmednagar", location: "Ahmednagar", min: 18.0, max: 22.0, avg: 20.2, change: 6, distance: "12 km" },
  { market: "Pune", location: "Pune", min: 19.0, max: 23.0, avg: 21.1, change: 8, distance: "85 km" },
  { market: "Nashik", location: "Nashik", min: 20.0, max: 24.0, avg: 22.3, change: 10, distance: "120 km" },
  { market: "Solapur", location: "Solapur", min: 17.5, max: 21.0, avg: 19.2, change: 4, distance: "250 km" },
  { market: "Lasalgaon", location: "Nashik", min: 21.0, max: 24.5, avg: 23.0, change: 9, distance: "130 km" },
];

/* ------------------------------- Crop config ------------------------------- */

interface CropDef {
  label: string;
  image?: string;
  varieties: string[];
  season: string;
}

const CROP_DEFS: Record<CropKey, CropDef> = {
  tomato: { label: "Tomato", image: tomatoImg, varieties: ["All Varieties", "Hybrid", "Desi", "Cherry"], season: "High Supply" },
  onion: { label: "Onion", image: onionImg, varieties: ["All Varieties", "Nashik Red", "White"], season: "Moderate Supply" },
  potato: { label: "Potato", image: potatoImg, varieties: ["All Varieties", "Jyoti", "Chipsona"], season: "Moderate Supply" },
  "green-chilli": { label: "Green Chilli", image: chilliImg, varieties: ["All Varieties", "G4", "Jwala"], season: "Rising Demand" },
  cauliflower: { label: "Cauliflower", image: cauliflowerImg, varieties: ["All Varieties", "Snowball"], season: "High Supply" },
  wheat: { label: "Wheat", varieties: ["All Varieties", "Lokwan", "Sharbati"], season: "Lean Season" },
  rice: { label: "Rice", varieties: ["All Varieties", "Basmati", "Kolam"], season: "Lean Season" },
  cotton: { label: "Cotton", varieties: ["All Varieties", "Shankar-6", "MCU-5"], season: "Moderate Supply" },
};

/* --------------------------- State / district factors ---------------------- */

export const STATE_OPTIONS = ["Maharashtra", "Karnataka", "Gujarat", "Madhya Pradesh"];
export const DISTRICT_OPTIONS = ["Ahmednagar", "Nashik", "Pune", "Mumbai", "Lasalgaon", "Nagpur", "Solapur"];

const STATE_FACTOR: Record<string, number> = {
  Maharashtra: 1,
  Karnataka: 1.03,
  Gujarat: 0.98,
  "Madhya Pradesh": 0.96,
};

const DISTRICT_FACTOR: Record<string, number> = {
  Ahmednagar: 1,
  Nashik: 1.05,
  Pune: 1.04,
  Mumbai: 1.12,
  Lasalgaon: 1.08,
  Nagpur: 0.97,
  Solapur: 0.94,
};

const round1 = (v: number) => Math.round(v * 10) / 10;
const scale = (v: number, f: number) => round1(v * f);

/* ------------------------------- Dataset ---------------------------------- */

function buildCrop(key: CropKey): CropData {
  const def = CROP_DEFS[key];
  const series7d = WEEK[key]!.map((price, i) => ({ label: WEEK_LABELS[i]!, price }));
  const stats = STATS[key]!;

  const history: HistoryRow[] =
    key === "tomato"
      ? TOMATO_HISTORY
      : WEEK_LABELS.slice()
          .reverse()
          .slice(0, 5)
          .map((label, i) => {
            const avg = WEEK[key]![6 - i]!;
            return { date: `${label} 2025`, min: round1(avg - 3.2), max: round1(avg + 3.3), avg };
          });

  const factor = key === "tomato" ? 1 : stats.avg / STATS.tomato.avg;
  const mandis = TOMATO_MANDIS.map((m) => ({
    ...m,
    min: scale(m.min, factor),
    max: scale(m.max, factor),
    avg: scale(m.avg, factor),
  }));

  const prediction: CropPrediction =
    key === "tomato"
      ? {
          price: 22.5,
          days: "3-4 days",
          increasePct: "6-8%",
          note: "Price may increase by 6-8% in next 3-4 days due to higher demand in nearby markets.",
          recommendation: "Consider waiting if storage is possible. Prices are expected to rise.",
        }
      : {
          price: round1(stats.avg * 1.065),
          days: "3-4 days",
          increasePct: "5-7%",
          note: `Price may increase by 5-7% in next 3-4 days due to higher demand in nearby markets.`,
          recommendation: "Consider waiting if storage is possible. Prices are expected to rise.",
        };

  return {
    key,
    label: def.label,
    image: def.image,
    varieties: def.varieties,
    season: def.season,
    unit: "kg",
    stats,
    series7d,
    prediction,
    mandis,
    history,
  };
}

export const CROPS: Record<CropKey, CropData> = Object.fromEntries(
  (Object.keys(CROP_DEFS) as CropKey[]).map((k) => [k, buildCrop(k)])
) as Record<CropKey, CropData>;

export const CROP_OPTIONS = Object.values(CROPS).map((c) => ({ key: c.key, label: c.label, image: c.image }));

/* --------------------------- Derived data service -------------------------- */

/** Central prediction accessor — swap internals for a real ML API later. */
export function getPrediction(crop: CropKey, factor = 1): CropPrediction {
  const p = CROPS[crop]!.prediction;
  return { ...p, price: scale(p.price, factor) };
}

export interface MarketView {
  stats: PriceStats;
  mandis: MandiRow[];
  compare: MandiRow[];
  history: HistoryRow[];
  prediction: CropPrediction;
}

/** Scales the whole view model by state + district (identity for defaults). */
export function getMarketView(crop: CropKey, state: string, district: string): MarketView {
  const factor = (STATE_FACTOR[state] ?? 1) * (DISTRICT_FACTOR[district] ?? 1);
  const base = CROPS[crop]!;
  const stats: PriceStats = {
    min: scale(base.stats.min, factor),
    max: scale(base.stats.max, factor),
    avg: scale(base.stats.avg, factor),
    weeklyChange: base.stats.weeklyChange,
  };
  const mandis = base.mandis.map((m) => ({ ...m, min: scale(m.min, factor), max: scale(m.max, factor), avg: scale(m.avg, factor) }));
  const compare = [...mandis].sort((a, b) => b.avg - a.avg);
  const history = base.history.map((h) => ({ ...h, min: scale(h.min, factor), max: scale(h.max, factor), avg: scale(h.avg, factor) }));
  return { stats, mandis, compare, history, prediction: getPrediction(crop, factor) };
}

/** Deterministic demo series per time range (7d is the canonical week). */
export function getSeries(crop: CropKey, range: TimeRange, factor = 1): PricePoint[] {
  const base = CROPS[crop]!;
  if (range === "7d") {
    return base.series7d.map((p) => ({ label: p.label, price: scale(p.price, factor) }));
  }
  const seed = base.stats.avg / 7;
  const mk = (count: number, labelFn: (i: number) => string): PricePoint[] =>
    Array.from({ length: count }, (_, i) => ({
      label: labelFn(i),
      price: scale(
        base.stats.avg * (1 + 0.07 * Math.sin(i * 1.4 + seed) + 0.035 * Math.cos(i * 0.8)),
        factor
      ),
    }));
  if (range === "30d") {
    return mk(10, (i) => {
      const d = new Date(2025, 4, 25 - (9 - i) * 3);
      return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
    });
  }
  if (range === "3m") {
    return mk(12, (i) => `W${i + 1}`);
  }
  const months = ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May"];
  return mk(12, (i) => months[i]!);
}

/* ------------------------------ Insights copy ------------------------------ */

export function getInsights(cropLabel: string, weeklyChange: number): { icon: "trend" | "market" | "clock" | "store" | "route"; text: string }[] {
  return [
    { icon: "trend", text: `${cropLabel} prices have increased by ${weeklyChange}% this week due to higher demand.` },
    { icon: "market", text: "Nashik and Lasalgaon are offering better prices than nearby markets." },
    { icon: "clock", text: "Good demand is expected in the next 3-4 days." },
    { icon: "store", text: "If you can store, consider waiting for a better price." },
    { icon: "route", text: "Check transport costs before choosing a distant market." },
  ];
}
