/**
 * AI Advisor — frontend chat service.
 *
 * `sendMessageToAI()` is the single seam between the UI and the "AI".
 * Today it returns deterministic, farmer-aware demo answers; replace its
 * internals with a call to your backend AI endpoint (Gemini/OpenAI/etc.)
 * later without touching the chat components. Never put API keys in the
 * frontend — the backend should own them.
 */

export type ChatRole = "ai" | "user";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  /** Message text — `**bold**` segments render as strong. */
  text: string;
  time: string;
  /** Suggested follow-up buttons rendered under this message (AI only). */
  related?: string[];
  /** Renders the "You can try asking" suggestion block under this message. */
  showSuggestions?: boolean;
}

export interface AIResponse {
  text: string;
  related?: string[];
}

/** The four starter suggestions shown in the reference. */
export const SUGGESTED_QUESTIONS = [
  "Best crop for my area",
  "Today's market price of tomato",
  "How to control pests?",
  "Weather forecast for this week",
];

export function nowTime(): string {
  return new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
}

/** Seed conversation from the reference (UI seed data — no DB collection). */
export function seedConversation(firstName: string): ChatMessage[] {
  return [
    {
      id: "m1",
      role: "ai",
      text: `Hello ${firstName}! 👋\n\nI'm KisanSetu AI, your farming assistant.\nHow can I help you today?`,
      time: "10:24 AM",
      showSuggestions: true,
    },
    {
      id: "m2",
      role: "user",
      text: "What is the current market price of onion in Nashik?",
      time: "10:25 AM",
    },
    {
      id: "m3",
      role: "ai",
      text: "The current market price of onion in Nashik Mandi is\n**₹ 1,800 – ₹ 2,200 per quintal** (for **Grade A**).\n\nPrices may vary based on quality and demand.",
      time: "10:25 AM",
      related: ["Show price trend of onion", "Best time to sell onion", "Onion storage tips"],
    },
  ];
}

/* ------------------------- Demo responder -------------------------------- */

type TopicRule = {
  match: RegExp;
  respond: (ctx: { firstName: string; location: string }) => AIResponse;
};

const RULES: TopicRule[] = [
  {
    match: /onion.*(trend|price trend)|trend.*onion/i,
    respond: () => ({
      text: "Onion prices in Nashik have moved **up ~6% this week** — ₹16.5/kg on 19 May to about **₹ 18.0 – 19.0/kg** today.\n\nArrivals are normal and buying demand is steady.",
      related: ["Best time to sell onion", "Compare Nashik vs Lasalgaon", "Onion storage tips"],
    }),
  },
  {
    match: /onion.*(price|rate|bhav)|price.*onion|onion$/i,
    respond: () => ({
      text: "The current market price of onion in Nashik Mandi is\n**₹ 1,800 – ₹ 2,200 per quintal** (for **Grade A**).\n\nPrices may vary based on quality and demand.",
      related: ["Show price trend of onion", "Best time to sell onion", "Onion storage tips"],
    }),
  },
  {
    match: /(sell|selling).*(time|when|best)|best time to sell/i,
    respond: () => ({
      text: "For onions, our prediction suggests prices may **rise 5–7% in the next 3–4 days** due to stronger demand in nearby markets.\n\nIf your storage conditions are good (dry, ventilated), waiting a few days could give a better return. Do check the **Market Prices** page before deciding.",
      related: ["Today's onion price", "Onion storage tips", "Best market to sell onion"],
    }),
  },
  {
    match: /storage|store|godown/i,
    respond: () => ({
      text: "Onion storage tips:\n\n• Keep onions in a **dry, well-ventilated** place — moisture causes rot.\n• Use slatted wooden crates or bamboo baskets, not plastic bags.\n• Sort and remove damaged bulbs before storing.\n• Keep away from direct sunlight and check weekly.\n\nProperly stored onions can last 2–3 months.",
      related: ["Best time to sell onion", "Expected price next week"],
    }),
  },
  {
    match: /tomato.*(price|rate|bhav)|price.*tomato|market price of tomato/i,
    respond: () => ({
      text: "Today's tomato prices near you:\n\n• **Ahmednagar APMC:** ₹ 20.20/kg (avg)\n• **Pune:** ₹ 21.10/kg (avg)\n• **Lasalgaon:** ₹ 23.00/kg (avg)\n\nPrices are **up ~8% vs last week**. Lasalgaon is currently offering the best rate within ~130 km.",
      related: ["Show tomato price trend", "Best market to sell tomato", "Transport cost to Lasalgaon"],
    }),
  },
  {
    match: /(best|which|suitable) crop|crop for my area|crop suggestion/i,
    respond: ({ location }) => ({
      text: `For ${location || "your area"} (black cotton soil, semi-arid zone), these crops usually perform well:\n\n• **Onion** — strong local demand, good mandi access via Nashik\n• **Tomato (Hybrid)** — quick returns, steady year-round demand\n• **Wheat** — lower risk in rabi, stable prices\n\nTell me your farm size and season, and I can narrow it down further.`,
      related: ["Today's onion price", "Expected tomato price trend", "Irrigation tips for tomato"],
    }),
  },
  {
    match: /pest|insect|keed|disease|spray/i,
    respond: () => ({
      text: "For common vegetable pests (aphids, thrips, fruit borer):\n\n1. **Monitor first** — use yellow sticky traps to check pest levels.\n2. Spray **neem oil (0.5%)** in the evening for mild infestations.\n3. Use **pheromone traps** for fruit borer control.\n4. Avoid repeating the same chemical — rotate modes of action.\n5. Keep field edges weed-free to reduce pest shelter.\n\nShare the crop name and I can give crop-specific guidance.",
      related: ["Organic pest control options", "Spray timing for tomato"],
    }),
  },
  {
    match: /weather|rain|forecast|monsoon/i,
    respond: ({ location }) => ({
      text: `Weather outlook for ${location || "your area"} (demo data):\n\n• **Today:** Sunny, 28°C, light breeze\n• **Next 2–3 days:** Clear skies, 27–30°C\n• **Weekend:** 40% chance of light showers\n\nGood window for spraying and harvesting before the weekend.\n\n*Demo forecast — connect a weather API for live data.*`,
      related: ["Best day to spray pesticide", "This week's market outlook"],
    }),
  },
  {
    match: /market|mandi.*(best|which)|where.*sell/i,
    respond: () => ({
      text: "Comparing today's best markets near you:\n\n1. **Lasalgaon** — highest average price, ~130 km\n2. **Nashik** — strong demand, ~120 km\n3. **Ahmednagar** — closest, lowest transport cost\n\nThe best market depends on **price + transport cost + lot size**. Check the Compare section on the **Market Prices** page for live numbers.",
      related: ["Compare Nashik vs Lasalgaon", "Transport cost estimate"],
    }),
  },
];

const FALLBACK: AIResponse = {
  text: "I'm still learning! I can help best with questions about:\n\n• **Crop and mandi prices** — \"price of onion in Nashik\"\n• **Selling decisions** — \"when should I sell tomato\"\n• **Farming practices** — pests, irrigation, storage\n• **Weather** — this week's forecast\n\nTry one of the suggested questions, or ask in your own words.",
  related: ["Best crop for my area", "Today's market price of tomato", "How to control pests?"],
};

export interface FarmerContextForAI {
  firstName: string;
  location: string;
}

/**
 * The single chat service function. When your AI backend is ready,
 * make this an async call to `/api/ai/chat` and keep the same contract.
 */
export function sendMessageToAI(message: string, ctx: FarmerContextForAI): AIResponse {
  const text = message.trim();
  if (!text) return FALLBACK;
  const rule = RULES.find((r) => r.match.test(text));
  return rule ? rule.respond(ctx) : FALLBACK;
}
