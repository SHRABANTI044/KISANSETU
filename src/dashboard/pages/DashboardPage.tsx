import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import AIAdvisorCard from "../components/AIAdvisorCard";
import CropLotsTable from "../components/CropLotsTable";
import DashboardLayout from "../components/DashboardLayout";
import MarketPriceChart from "../components/MarketPriceChart";
import RecentActivity from "../components/RecentActivity";
import SummaryCard from "../components/SummaryCard";
import TopBuyers from "../components/TopBuyers";
import { GREETING, SUMMARY_METRICS } from "../data/farmerDashboardData";

/** /farmer-dashboard — farmer home after profile completion (frontend prototype). */
export default function FarmerDashboardPage() {
  return (
    <DashboardLayout>
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-5 sm:gap-6">
        {/* Welcome */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-[24px] font-bold tracking-[-0.01em] text-[#111111] sm:text-[28px]">
              {GREETING.title} 👋
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

        {/* Summary cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {SUMMARY_METRICS.map((metric) => (
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

        {/* Crop lots + activity */}
        <div className="grid gap-5 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <CropLotsTable />
          </div>
          <RecentActivity />
        </div>

        {/* Buyers */}
        <TopBuyers />
      </div>
    </DashboardLayout>
  );
}
