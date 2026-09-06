import { Check, Truck } from "lucide-react";
import type { TrackingStage } from "../../data/orders";
import { cn } from "../../../utils/cn";

export default function TrackingTimeline({ stages }: { stages: TrackingStage[] }) {
  const isCancelledFlow = stages.some((s) => s.label === "Cancelled");

  return (
    <div>
      <h3 className="font-display text-[15px] font-semibold text-[#111111]">Tracking Progress</h3>
      <ol className="relative mt-4">
        {stages.map((stage, i) => {
          const last = i === stages.length - 1;
          const done = stage.state === "done";
          const current = stage.state === "current";
          const cancelledStage = stage.label === "Cancelled";
          return (
            <li key={stage.label} className="relative flex gap-3.5 pb-6 last:pb-0">
              {/* Connector */}
              {!last && (
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute top-[26px] bottom-0 left-[13px] w-[2px] rounded-full",
                    done ? "bg-[#2E7D32]/60" : "bg-[#E1E5E1]"
                  )}
                />
              )}

              {/* Node */}
              <span
                className={cn(
                  "relative z-10 grid h-7 w-7 shrink-0 place-items-center rounded-full ring-4",
                  done && "bg-[#2E7D32] text-white ring-[#EAF6EA]",
                  current && !cancelledStage && "bg-white text-[#2E7D32] ring-[#EAF6EA]",
                  current && cancelledStage && "bg-red-500 text-white ring-red-50",
                  stage.state === "pending" && "border-2 border-[#D8DED8] bg-white ring-transparent"
                )}
              >
                {done && !cancelledStage && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                {cancelledStage && <Check className="hidden h-3.5 w-3.5" strokeWidth={3} />}
                {cancelledStage && <span className="text-[11px] font-bold leading-none">×</span>}
                {current && !cancelledStage && <Truck className="h-3.5 w-3.5" strokeWidth={2.2} />}
              </span>

              {/* Content */}
              <div className="min-w-0 flex-1 pt-0.5">
                <div className="flex flex-wrap items-center gap-2">
                  <p
                    className={cn(
                      "text-[13px] font-semibold",
                      stage.state === "pending" ? "text-[#999999]" : "text-[#111111]"
                    )}
                  >
                    {stage.label}
                  </p>
                  {done && <span className="rounded-full bg-[#EAF6EA] px-2 py-0.5 text-[9.5px] font-bold tracking-wide text-[#2E7D32] uppercase">Done</span>}
                  {current && !cancelledStage && <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[9.5px] font-bold tracking-wide text-sky-700 uppercase">Current</span>}
                  {stage.state === "pending" && <span className="rounded-full bg-[#E8EAE8] px-2 py-0.5 text-[9.5px] font-bold tracking-wide text-[#777777] uppercase">Pending</span>}
                </div>
                <p className={cn("mt-0.5 text-[11.5px]", stage.state === "pending" ? "text-[#B0B6B0]" : "text-[#888888]")}>
                  {stage.when}
                </p>
              </div>
            </li>
          );
        })}
        {isCancelledFlow && (
          <p className="mt-1 rounded-xl bg-red-50 px-4 py-2.5 text-[11.5px] font-medium text-red-600">
            This order was cancelled before pickup. No payment was processed.
          </p>
        )}
      </ol>
    </div>
  );
}
