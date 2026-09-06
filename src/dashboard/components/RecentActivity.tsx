import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { RECENT_ACTIVITIES } from "../data/farmerDashboardData";

export default function RecentActivity() {
  return (
    <section className="flex flex-col rounded-2xl border border-[#E1E5E1] bg-white p-5 shadow-[0_10px_30px_-18px_rgba(17,17,17,0.12)] sm:p-6">
      <h2 className="font-display text-[16.5px] font-semibold text-[#111111]">Recent Activity</h2>

      <ul className="mt-5 flex flex-col">
        {RECENT_ACTIVITIES.map((activity) => (
          <li key={activity.id} className="flex items-start gap-3 border-b border-[#F0F3F0] py-3.5 last:border-0 last:pb-0">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#EAF6EA] text-[#2E7D32]">
              <activity.icon className="h-[15px] w-[15px]" strokeWidth={2.1} />
            </span>
            <div className="min-w-0">
              <p className="text-[12.5px] leading-snug font-medium text-[#111111]">{activity.text}</p>
              <p className="mt-0.5 text-[11px] text-[#999999]">{activity.timeAgo}</p>
            </div>
          </li>
        ))}
      </ul>

      <Link
        to="/dashboard/offers"
        className="group mt-4 inline-flex items-center gap-1.5 self-start text-[12.5px] font-semibold text-[#2E7D32] transition-colors hover:text-[#155B32]"
      >
        View All Activity
        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={2.5} />
      </Link>
    </section>
  );
}
