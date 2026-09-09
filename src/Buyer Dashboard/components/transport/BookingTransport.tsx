import { useState } from "react";
import { Truck } from "lucide-react";
import { CROP_OPTIONS } from "../../data/transportLogisticsData";

interface FormState {
  pickup: string;
  delivery: string;
  crop: string;
  quantity: string;
}

const INITIAL: FormState = { pickup: "", delivery: "", crop: "", quantity: "" };

interface Quote {
  partner: string;
  price: string;
  eta: string;
}

/** Right-side "Book a Transport" card with frontend-validated quote form. */
export default function BookingTransport() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [quotes, setQuotes] = useState<Quote[] | null>(null);

  const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const getQuotes = () => {
    const er: Partial<FormState> = {};
    if (!form.pickup.trim()) er.pickup = "Pickup location is required";
    if (!form.delivery.trim()) er.delivery = "Delivery location is required";
    if (!form.crop) er.crop = "Please choose a crop";
    if (!form.quantity.trim() || Number(form.quantity) <= 0 || Number.isNaN(Number(form.quantity)))
      er.quantity = "Enter a valid quantity";
    setErrors(er);
    if (Object.keys(er).length > 0) {
      setQuotes(null);
      return;
    }
    // Frontend mock quote engine — replaced by a Supabase RPC/service later.
    const qty = Number(form.quantity);
    setQuotes([
      { partner: "SafeLogistics", price: `₹ ${(qty * 3.1).toLocaleString("en-IN")}`, eta: "2–3 days" },
      { partner: "AgriMove", price: `₹ ${(qty * 3.4).toLocaleString("en-IN")}`, eta: "1–2 days" },
      { partner: "Bharat Trans", price: `₹ ${(qty * 2.9).toLocaleString("en-IN")}`, eta: "3–4 days" },
    ]);
  };
  const fieldCls = (bad?: string) =>
    `h-[42px] w-full rounded-xl border-[1.5px] bg-white px-3.5 text-[13px] text-[#111111] outline-none transition-colors placeholder:text-[#9AA79A] focus:border-[#2E7D32] ${
      bad ? "border-red-400" : "border-[#E4EDE4]"
    }`;

  return (
    <div className="rounded-2xl border border-[#E4EDE4] bg-white p-5 shadow-[0_10px_24px_-16px_rgba(17,17,17,0.18)]">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#EAF6EA] text-[#2E7D32]">
          <Truck className="h-5 w-5" strokeWidth={2} />
        </span>
        <div>
          <h3 className="font-display text-[15px] font-bold text-[#111111]">Book a Transport</h3>
          <p className="text-[11.5px] text-[#666666]">Get competitive rates from verified transporters.</p>
        </div>
      </div>

      <div className="mt-4 space-y-3.5">
        <div>
          <label className="mb-1 block text-[12px] font-semibold text-[#3E5B47]">Pickup Location</label>
          <input className={fieldCls(errors.pickup)} placeholder="Enter pickup location" value={form.pickup} onChange={set("pickup")} />
          {errors.pickup && <p className="mt-1 text-[11px] font-medium text-red-500">{errors.pickup}</p>}
        </div>
        <div>
          <label className="mb-1 block text-[12px] font-semibold text-[#3E5B47]">Delivery Location</label>
          <input className={fieldCls(errors.delivery)} placeholder="Enter delivery location" value={form.delivery} onChange={set("delivery")} />
          {errors.delivery && <p className="mt-1 text-[11px] font-medium text-red-500">{errors.delivery}</p>}
        </div>
        <div>
          <label className="mb-1 block text-[12px] font-semibold text-[#3E5B47]">Select Crop</label>
          <select className={`${fieldCls(errors.crop)} ${form.crop ? "" : "text-[#9AA79A]"}`} value={form.crop} onChange={set("crop")}>
            <option value="">Choose crop</option>
            {CROP_OPTIONS.map((c) => (
              <option key={c} value={c} className="text-[#111111]">
                {c}
              </option>
            ))}
          </select>
          {errors.crop && <p className="mt-1 text-[11px] font-medium text-red-500">{errors.crop}</p>}
        </div>
        <div>
          <label className="mb-1 block text-[12px] font-semibold text-[#3E5B47]">Quantity (Quintal)</label>
          <input className={fieldCls(errors.quantity)} placeholder="Enter quantity" inputMode="numeric" value={form.quantity} onChange={set("quantity")} />
          {errors.quantity && <p className="mt-1 text-[11px] font-medium text-red-500">{errors.quantity}</p>}
        </div>

        <button
          type="button"
          onClick={getQuotes}
          className="inline-flex h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-[#2E7D32] text-[13.5px] font-semibold text-white shadow-[0_12px_24px_-10px_rgba(46,125,50,0.55)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#256628]"
        >
          Get Quotes
        </button>
      </div>

      {quotes && (
        <div className="mt-4 rounded-xl border border-[#CBE6CC] bg-[#F3FAF3] p-3.5">
          <p className="text-[12.5px] font-bold text-[#2E7D32]">
            {quotes.length} quotes found — {form.crop}, {form.quantity} Quintal
          </p>
          <p className="mt-0.5 text-[11px] text-[#3E5B47]">
            {form.pickup} → {form.delivery}
          </p>
          <div className="mt-2.5 space-y-2">
            {quotes.map((q) => (
              <div key={q.partner} className="flex items-center justify-between rounded-lg border border-[#E4EDE4] bg-white px-3 py-2">
                <div>
                  <p className="text-[12.5px] font-semibold text-[#111111]">{q.partner}</p>
                  <p className="text-[11px] text-[#666666]">ETA: {q.eta}</p>
                </div>
                <div className="text-right">
                  <p className="text-[13px] font-bold text-[#2E7D32]">{q.price}</p>
                  <button
                    type="button"
                    onClick={() => {
                      setQuotes(null);
                      setForm(INITIAL);
                    }}
                    className="text-[11px] font-semibold text-[#2E7D32] hover:underline"
                  >
                    Book now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
