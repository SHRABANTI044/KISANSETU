import { ArrowUpRight, Lightbulb, TrendingUp } from "lucide-react";
import type { CropPrediction } from "../../data/marketPrices";

/** AI Price Prediction — centrally sourced demo prediction (not live ML). */
export default function AIPredictionCard({
  cropLabel,
  prediction,
}: {
  cropLabel: string;
  prediction: CropPrediction;
}) {
  return (
    <section className="rounded-2xl border border-[#BFE3C5] bg-[#F0FAF1] p-5 shadow-[0_10px_30px_-18px_rgba(46,125,50,0.25)] sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid h-[42px] w-[42px] place-items-center rounded-2xl bg-[#2E7D32] text-white">
            <TrendingUp className="h-[21px] w-[21px]" strokeWidth={2.2} />
          </span>
          <h2 className="font-display text-[16.5px] font-semibold text-[#111111]">
            AI Price Prediction
          </h2>
        </div>
        <span className="rounded-full bg-[#E8862D]/15 px-3 py-1 text-[10.5px] font-bold tracking-wide text-[#C56713] uppercase">
          Beta
        </span>
      </div>

      <p className="mt-5 text-[12px] font-medium text-[#666666]">Predicted Price ({cropLabel})</p>
      <p className="mt-1 flex flex-wrap items-baseline gap-x-2">
        <span className="font-display text-[30px] leading-none font-bold text-[#155B32]">
          ₹ {prediction.price.toFixed(2)}
          <span className="ml-1 font-sans text-[13px] font-semibold text-[#666666]">/kg</span>
        </span>
        <span className="flex items-center gap-1 text-[12px] font-semibold text-[#2E7D32]">
          (in {prediction.days}) <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2.4} />
        </span>
      </p>
      <p className="mt-2.5 text-[12px] leading-relaxed text-[#555555]">{prediction.note}</p>

      <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-[#2E7D32]/20 bg-white/70 px-4 py-3">
        <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-[#E8862D]" strokeWidth={2.2} />
        <p className="text-[12px] leading-relaxed font-medium text-[#155B32]">
          {prediction.recommendation}
        </p>
      </div>

      <p className="mt-3 text-[10.5px] text-[#8A938A]">
        Demo prediction — estimates only, not a guaranteed future price.
      </p>
    </section>
  );
}
