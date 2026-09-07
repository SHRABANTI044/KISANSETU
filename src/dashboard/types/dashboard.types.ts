/**
 * Dashboard-specific TypeScript types, re-exported from the typed mock-data
 * modules. When real REST APIs replace the mocks, keep these interfaces as the
 * single contract for the dashboard UI layer.
 */
export type { SidebarItem, HeaderUser, WeatherInfo, SummaryMetric, MarketPricePoint, MarketOverview, AIRecommendation, ActivityItem, CropLot, Buyer } from "../data/farmerDashboardData";
export type { CropLot as CropLotRecord, LotOffer, LotViewer } from "../data/cropLots";
export type { CropKey, MandiRow, TimeRange } from "../data/marketPrices";
export type { InterestedBuyer, BuyerBadgeStatus } from "../data/interestedBuyers";
export type { Offer, OfferStatus as OfferStatusValue } from "../data/offers";
export type { Order, OrderStatus as OrderStatusValue } from "../data/orders";
export type { EarningsTransaction, EarningsSummary, PaymentStatus } from "../data/earnings";
export type { ChatMessage, ChatRole, AIResponse } from "../data/aiAdvisor";
export type { SupportCategory, SupportTicket, TicketStatus } from "../data/support";

/** Shared dashboard primitives (safe to keep even as APIs evolve). */
export type TrendDirection = "up" | "down" | "neutral";
export interface FarmerProfile {
  id: string;
  name: string;
  phone: string;
  location: string;
  role: "Farmer";
  initials: string;
}
