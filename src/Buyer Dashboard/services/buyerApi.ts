import type {
  BuyerOffer,
  BuyerOrder,
  BuyerRequirement,
  BuyerSupplier,
  BuyerTransaction,
} from "../types/buyer.types";
import { BUYER_SUMMARY_STATS, BUYER_ACTIVITIES, BUYER_AI_ADVISOR, BUYER_GREETING, MARKET_TREND_INFO, PRICE_SERIES, RECOMMENDED_LOTS, TOP_SUPPLIERS } from "../data/buyerDashboardData";
import { INITIAL_REQUIREMENTS } from "../data/buyerRequirements";
import { INITIAL_SUPPLIERS } from "../data/buyerSuppliers";
import { INITIAL_OFFERS_PAGE } from "../data/buyerOfferPageData";
import { INITIAL_BUYER_ORDERS, ORDER_TRACKING } from "../data/buyerOrdersData";
import { INITIAL_BUYER_TRANSACTIONS, PAYMENT_METHODS } from "../data/buyerPaymentsData";

/**
 * Buyer API service — the single seam between the Buyer Dashboard UI and the
 * (currently mock) data layer. Swap each resolver for a real REST/Supabase
 * call later without touching page components. Never place secrets here;
 * the backend owns keys and gateways.
 */
const DEMO_LATENCY = 120;

function delayed<T>(payload: T): Promise<T> {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(payload), DEMO_LATENCY);
  });
}

export const buyerApi = {
  fetchDashboardBundle: () =>
    delayed({
      greeting: BUYER_GREETING,
      stats: BUYER_SUMMARY_STATS,
      trend: MARKET_TREND_INFO,
      series: PRICE_SERIES,
      advisor: BUYER_AI_ADVISOR,
      activities: BUYER_ACTIVITIES,
      recommendedLots: RECOMMENDED_LOTS,
      topSuppliers: TOP_SUPPLIERS,
    }),

  fetchRequirements: (): Promise<BuyerRequirement[]> => delayed(INITIAL_REQUIREMENTS),

  fetchSuppliers: (): Promise<BuyerSupplier[]> => delayed(INITIAL_SUPPLIERS),

  fetchOffers: (): Promise<BuyerOffer[]> => delayed(INITIAL_OFFERS_PAGE),

  fetchOrders: (): Promise<BuyerOrder[]> => delayed(INITIAL_BUYER_ORDERS),

  fetchOrderTracking: (orderId: string) => delayed(ORDER_TRACKING[orderId] ?? null),

  fetchPayments: (): Promise<BuyerTransaction[]> => delayed(INITIAL_BUYER_TRANSACTIONS),

  fetchPaymentMethods: () => delayed(PAYMENT_METHODS),
};
