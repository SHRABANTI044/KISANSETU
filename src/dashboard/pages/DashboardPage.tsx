import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Handshake, Package, Plus, Store, Users } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";
import AIAdvisorCard from "../components/AIAdvisorCard";
import CropLotsTable from "../components/CropLotsTable";
import DashboardLayout from "../components/DashboardLayout";
import MarketPriceChart from "../components/MarketPriceChart";
import SummaryCard from "../components/SummaryCard";
import TopBuyers from "../components/TopBuyers";
import type { SummaryMetric } from "../data/farmerDashboardData";
import { GREETING } from "../data/farmerDashboardData";

/** /farmer-dashboard — farmer home after profile completion (connected to database). */
export default function FarmerDashboardPage() {
  const { user, profile } = useAuth();
  const [farmerCrops, setFarmerCrops] = useState<any[]>([]);
  const [preferredBuyer, setPreferredBuyer] = useState<string>("Wholesaler");

  useEffect(() => {
    async function loadDashboardData() {
      if (!user) return;
      try {
        // 1. Fetch crops cultivated by this farmer from farmer_crops
        const { data: cropsData, error: cropsError } = await supabase
          .from("farmer_crops")
          .select("*")
          .eq("farmer_id", user.id);

        if (!cropsError && cropsData) {
          setFarmerCrops(cropsData);
        }

        // 2. Fetch preferred buyer type from farmer_profiles
        const { data: profileData } = await supabase
          .from("farmer_profiles")
          .select("preferred_buyer_type")
          .eq("id", user.id)
          .maybeSingle();

        if (profileData?.preferred_buyer_type) {
          setPreferredBuyer(profileData.preferred_buyer_type);
        }
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      }
    }

    loadDashboardData();
  }, [user]);

  // Calculate counts based on database records
  const totalLotsCount = farmerCrops.length;
  const activeLotsCount = farmerCrops.filter(
    (c) => c.status?.toLowerCase() === "live" || c.list_for_sale === true
  ).length;
  const negotiationLotsCount = farmerCrops.filter(
    (c) =>
      c.status?.toLowerCase() === "negotiation" ||
      (!c.list_for_sale && c.status?.toLowerCase() !== "live")
  ).length;

  // Build the 4 blocks according to your exact specifications
  const summaryMetrics: SummaryMetric[] = [
    {
      id: "total-lots",
      label: "Total Crop Lots",
      value: String(totalLotsCount),
      supporting:
        totalLotsCount === 1 ? "1 cultivated crop" : `${totalLotsCount} cultivated crops`,
      trend: "neutral",
      icon: Package,
    },
    {
      id: "active-lots",
      label: "Active Crop Lots",
      value: String(activeLotsCount),
      supporting: "Listed for sale (Live)",
      trend: "up",
      icon: Store,
    },
    {
      id: "negotiation-lots",
      label: "Negotiation Lots",
      value: String(negotiationLotsCount),
      supporting: "Open for buyer offers",
      trend: "neutral",
      icon: Handshake,
    },
    {
      id: "preferred-buyer",
      label: "Preferred Buyer",
      value: preferredBuyer,
      supporting: "Target selling preference",
      trend: "neutral",
      icon: Users,
    },
  ];

  const greetingTitle = profile?.full_name
    ? `Welcome back, ${profile.full_name}`
    : GREETING.title;

  return (
    <DashboardLayout>
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-5 sm:gap-6">
        {/* Welcome */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-[24px] font-bold tracking-[-0.01em] text-[#111111] sm:text-[28px]">
              {greetingTitle} 👋
            </h1>
            <p className="mt-1 text-[13.5px] text-[#666666]">{GREETING.subtitle}</p>
          </div>
          <Link
            to="/dashboard/crop-lots"
            className="inline-flex h-[46px] items-center gap-2 rounded-xl bg-[#2E7D32] px-5 text-[14px] font-semibold text-white shadow-[0_12px_24px_-10px_rgba(46,125,50,0.55)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#256628]"
          >
            <Plus className="h-[17px] w-[17px]" strokeWidth={2.5} />
            Add Crop Lot
          </Link>
        </div>

        {/* 4 Summary cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {summaryMetrics.map((metric) => (
            <SummaryCard key={metric.id} metric={metric} />
          ))}
        </div>

        {/* Chart + AI advisor */}
        <div className="grid gap-5 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <MarketPriceChart />
          </div>
          <AIAdvisorCard />
        </div>

              {/* Crop lots + Top Buyers vertically next to it */}
        <div className="grid gap-5 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <CropLotsTable crops={farmerCrops} />
          </div>
          {/* Top Buyers now takes the 1-column spot where Recent Activity was */}
          <TopBuyers />
        </div>
      </div>
    </DashboardLayout>
  );
}
