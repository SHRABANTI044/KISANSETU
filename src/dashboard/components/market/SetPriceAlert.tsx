import { useState } from "react";
import { Bell, CircleCheck, LoaderCircle } from "lucide-react";

export default function SetPriceAlert({ onAlert }: { onAlert: (target: string) => void }) {
  const [target, setTarget] = useState("22.00");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState("");
  const [error, setError] = useState("");

  const submit = () => {
    if (saving) return;
    const value = Number(target);
    if (!Number.isFinite(value) || value <= 0) {
      setError("Enter a valid target price.");
      setSaved("");
      return;
    }
    setError("");
    setSaving(true);
    window.setTimeout(() => {
      setSaving(false);
      setSaved(`Price alert set successfully at ₹${value.toFixed(2)}/kg.`);
      onAlert(target);
    }, 800);
  };

  return (
    <section className="rounded-2xl border border-[#E1E5E1] bg-white p-5 shadow-[0_10px_30px_-18px_rgba(17,17,17,0.12)] sm:p-6">
      <div className="flex items-center gap-3">
        <span className="grid h-[42px] w-[42px] place-items-center rounded-2xl bg-[#EAF6EA] text-[#2E7D32]">
          <Bell className="h-[20px] w-[20px]" strokeWidth={2} />
        </span>
        <div>
          <h2 className="font-display text-[16.5px] font-semibold text-[#111111]">Set Price Alert</h2>
          <p className="mt-0.5 text-[12px] text-[#666666]">Get notified when price crosses your target.</p>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <div className="relative flex-1">
          <input
            type="number"
            min={0}
            step="0.5"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            aria-label="Target price per kg"
            className="h-[48px] w-full rounded-xl border border-[#E1E5E1] bg-[#FAFBFA] px-4 pr-12 text-[15px] font-semibold text-[#111111] transition-colors outline-none focus:border-[#2E7D32] focus:bg-white"
          />
          <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-[12px] font-medium text-[#888888]">
            ₹/kg
          </span>
        </div>
        <button
          type="button"
          onClick={submit}
          disabled={saving}
          aria-busy={saving}
          className="inline-flex h-[48px] shrink-0 items-center justify-center gap-2 rounded-xl bg-[#2E7D32] px-6 text-[13.5px] font-semibold text-white shadow-[0_10px_22px_-10px_rgba(46,125,50,0.55)] transition-all duration-200 hover:bg-[#256628] disabled:cursor-wait disabled:opacity-85"
        >
          {saving ? <LoaderCircle className="h-4 w-4 animate-spin" strokeWidth={2.4} /> : "Set Alert"}
        </button>
      </div>

      {error && <p role="alert" className="mt-2.5 text-[12px] font-medium text-red-500">{error}</p>}
      {saved && (
        <p role="status" className="animate-pop-in mt-3 flex items-center gap-2 rounded-xl border border-[#2E7D32]/25 bg-[#EAF6EA] px-3.5 py-2.5 text-[12px] font-semibold text-[#155B32]">
          <CircleCheck className="h-4 w-4 shrink-0 text-[#2E7D32]" strokeWidth={2.2} />
          {saved}
        </p>
      )}
    </section>
  );
}
