import { Check, Truck } from "lucide-react";
import { TRACKING_STAGES } from "../../data/transportLogisticsData";

/** Horizontal shipment progress timeline + green "on the way" notification card. */
export default function LiveTracking({ shipment }: { shipment: { id: string; expectedDelivery: string } }) {
  return (
    <section className="rounded-2xl border border-[#E4EDE4] bg-white p-5 shadow-[0_10px_24px_-16px_rgba(17,17,17,0.18)]">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#EAF6EA] text-[#2E7D32]">
          <Truck className="h-5 w-5" strokeWidth={2} />
        </span>
        <div>
          <h3 className="font-display text-[15px] font-bold text-[#111111]">Live Tracking</h3>
          <p className="text-[12px] text-[#666666]">Shipment ID: {shipment.id}</p>
        </div>
      </div>

      {/* Timeline */}
      <div className="mt-6 overflow-x-auto pb-2">
        <div className="flex min-w-[720px] items-start">
          {TRACKING_STAGES.map((st, i) => (
            <div key={st.title} className="flex flex-1 items-start last:flex-none">
              <div className="flex w-[110px] flex-col items-center text-center">
                <span
                  className={`grid h-9 w-9 place-items-center rounded-full border-[2.5px] ${
                    st.state === "done"
                      ? "border-[#2E7D32] bg-[#2E7D32] text-white"
                      : st.state === "current"
                        ? "border-[#2E7D32] bg-[#EAF6EA] text-[#2E7D32]"
                        : "border-[#D7E2D7] bg-white text-[#9AA79A]"
                  }`}
                >
                  {st.state === "done" ? (
                    <Check className="h-4 w-4" strokeWidth={3} />
                  ) : st.state === "current" ? (
                    <Truck className="h-4 w-4" strokeWidth={2.2} />
                  ) : (
                    <span className="h-2 w-2 rounded-full bg-[#C6D2C6]" />
                  )}
                </span>
                <p className={`mt-2 text-[12.5px] font-bold ${st.state === "upcoming" ? "text-[#9AA79A]" : "text-[#111111]"}`}>{st.title}</p>
                <p className="text-[11px] text-[#666666]">{st.date}</p>
                <p className="text-[11px] text-[#9AA79A]">{st.time}</p>
              </div>
              {i < TRACKING_STAGES.length - 1 && (
                <div className="mt-[17px] h-[2.5px] flex-1 rounded-full">
                  <div className={`h-full w-full rounded-full ${TRACKING_STAGES[i + 1].state === "upcoming" && st.state !== "done" ? "bg-[#E4EDE4]" : "bg-[#2E7D32]"}`} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Green notification card */}
      <div className="mt-4 flex items-start gap-3 rounded-xl bg-[#EAF6EA] p-4">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#2E7D32] text-white">
          <Truck className="h-4.5 w-4.5" strokeWidth={2.2} />
        </span>
        <div>
          <p className="text-[13.5px] font-bold text-[#2E7D32]">Your shipment is on the way!</p>
          <p className="mt-0.5 text-[12.5px] leading-relaxed text-[#3E5B47]">
            Currently at Durgapur, WB. Expected to reach Kolkata by {shipment.expectedDelivery}.
          </p>
        </div>
      </div>
    </section>
  );
}
