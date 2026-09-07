import { useState } from "react";
import { INITIAL_LOTS, INITIAL_OFFERS, LOT_VIEWERS } from "../data/cropLots";
import type { CropLot, LotOffer, LotViewer } from "../data/cropLots";

/**
 * Dashboard hook exposing crop lots + per-lot offers/viewers from mock data.
 * Swap the state seeds for API calls when the backend is ready.
 */
export function useCropLots() {
  const [lots, setLots] = useState<CropLot[]>(INITIAL_LOTS);
  const [offers, setOffers] = useState<Record<string, LotOffer[]>>(INITIAL_OFFERS);
  const [viewers] = useState<Record<string, LotViewer[]>>(LOT_VIEWERS);

  return { lots, setLots, offers, setOffers, viewers };
}
