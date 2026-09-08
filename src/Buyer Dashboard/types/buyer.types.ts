/**
 * Central TypeScript contracts for the Buyer Dashboard module.
 * Re-exported from their owning data modules so the entire `Buyer Dashboard`
 * tree has one canonical types surface for future API implementation.
 */

export type {
  BuyerIdentity,
  BuyerSidebarItem,
  BuyerDashboardStat,
  PricePoint,
  MarketTrendInfo,
  BuyerAIRecommendation,
  RecentActivityItem,
  RecommendedLot,
  Supplier,
} from "../data/buyerDashboardData";

export type {
  BuyerRequirement,
  RequirementOffer,
  RequirementStatus,
  CropKey,
} from "../data/buyerRequirements";

export type {
  BuyerSupplier,
  SupplierType,
} from "../data/buyerSuppliers";

export type {
  BuyerOffer,
  BuyerOfferStatus,
  ChatMsg,
} from "../data/buyerOfferPageData";

export type {
  BuyerOrder,
  BuyerOrderStatus,
  OrderTracking,
  TrackingStage,
} from "../data/buyerOrdersData";

export type {
  BuyerTransaction,
  PaymentMethod,
  PaymentStatus,
} from "../data/buyerPaymentsData";
