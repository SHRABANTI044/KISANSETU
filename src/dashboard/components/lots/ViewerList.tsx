import { Building2, Clock, MapPin } from "lucide-react";
import type { LotViewer } from "../../data/cropLots";

export default function ViewerList({
  viewers,
  totalViews,
}: {
  viewers: LotViewer[];
  totalViews: number;
}) {
  return (
    <div>
      <p className="rounded-xl bg-[#EAF6EA]/70 px-4 py-3 text-[12.5px] font-semibold text-[#155B32]">
        {totalViews.toLocaleString("en-IN")} people viewed this lot.
      </p>
      {viewers.length === 0 ? (
        <p className="mt-3 rounded-xl border border-dashed border-[#D8DED8] bg-[#FAFBFA] px-4 py-6 text-center text-[12.5px] text-[#777777]">
          Recent viewers will appear here.
        </p>
      ) : (
        <ul className="mt-3 flex flex-col gap-2.5">
          {viewers.map((viewer) => (
            <li key={viewer.id} className="flex items-center gap-3 rounded-xl border border-[#E1E5E1] bg-white p-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#EAF6EA] font-display text-[11px] font-bold text-[#2E7D32]">
                {viewer.initials}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[12.5px] font-semibold text-[#111111]">{viewer.name}</p>
                <p className="flex items-center gap-1 truncate text-[11px] text-[#777777]">
                  <Building2 className="h-3 w-3 shrink-0" />
                  {viewer.business}
                </p>
                <p className="mt-0.5 flex items-center gap-2 text-[10.5px] text-[#999999]">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {viewer.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {viewer.lastViewed}
                  </span>
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
