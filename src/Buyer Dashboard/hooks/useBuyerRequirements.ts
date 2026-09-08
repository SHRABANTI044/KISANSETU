import { useEffect, useState } from "react";
import { buyerApi } from "../services/buyerApi";
import type { BuyerRequirement } from "../types/buyer.types";

export type LoadState = "loading" | "ready" | "error";

/**
 * Loads the buyer's procurement requirements through the Buyer API service
 * layer (today mock-backed; tomorrow Supabase-driven) along with a load
 * state so pages can present loading/error UIs consistently.
 */
export function useBuyerRequirements() {
  const [requirements, setRequirements] = useState<BuyerRequirement[]>([]);
  const [loadState, setLoadState] = useState<LoadState>("loading");

  useEffect(() => {
    let cancelled = false;
    buyerApi
      .fetchRequirements()
      .then((data) => {
        if (cancelled) return;
        setRequirements(data);
        setLoadState("ready");
      })
      .catch(() => !cancelled && setLoadState("error"));
    return () => {
      cancelled = true;
    };
  }, []);

  return { requirements, setRequirements, loadState };
}
