import { useState } from "react";
import BuyerDashboardLayout from "../layouts/BuyerDashboardLayout";
import AIAdvisorCard from "../components/AIAdvisorCard";
import ActionCards from "../components/ActionCards";
import PriceTrendChart from "../components/PriceTrendChart";
import RecentActivity from "../components/RecentActivity";
import RecommendedLots from "../components/RecommendedLots";
import SummaryCards from "../components/SummaryCards";
import TopSuppliers from "../components/TopSuppliers";
import WelcomeBanner from "../components/WelcomeBanner";

/** /buyer/dashboard — buyer home after profile completion (frontend prototype). */
export default function BuyerDashboard() {
  const [query, setQuery] = useState("");

  return (
    <BuyerDashboardLayout searchValue={query} onSearch={setQuery}>
      <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-5 sm:gap-6">
        <WelcomeBanner />

        <SummaryCards />

        {/* Chart + AI advisor + activity */}
        <div className="grid items-stretch gap-5 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <PriceTrendChart />
          </div>
          <div className="flex flex-col gap-5">
            <AIAdvisorCard />
            <RecentActivity />
          </div>
        </div>

        {/* Recommended lots + suppliers */}
        <div className="grid items-start gap-5 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <RecommendedLots query={query} onViewLot={(crop) => setQuery(crop)} />
          </div>
          <TopSuppliers onViewProfile={(name) => setQuery(name)} />
        </div>

        <ActionCards />
      </div>
    </BuyerDashboardLayout>
  );
}
