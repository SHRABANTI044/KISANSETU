import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  Check,
  CircleAlert,
  Handshake,
  MapPin,
  Send,
  Star,
  X,
} from "lucide-react";
import type { BuyerSupplier } from "../../data/buyerSuppliers";
import { TYPE_META } from "../../data/buyerSuppliers";
import { cn } from "../../../utils/cn";

/* ------------------------------ Modal shell -------------------------------- */

function ModalShell({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/45 p-4 backdrop-blur-[2px] sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <div
        className="animate-pop-in max-h-[92dvh] w-full max-w-[480px] overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-display text-[18px] font-bold text-[#111111]">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[#E1E5E1] text-[#666666] transition-colors hover:bg-[#EAF6EA] hover:text-[#2E7D32]"
          >
            <X className="h-[18px] w-[18px]" />
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}

/* ---------------------------- Supplier profile ----------------------------- */

export function SupplierProfileModal({
  supplier,
  onClose,
  onInquire,
}: {
  supplier: BuyerSupplier;
  onClose: () => void;
  onInquire: () => void;
}) {
  const meta = TYPE_META[supplier.type];

  return (
    <ModalShell title="Supplier Profile" onClose={onClose}>
      <div className="flex items-center gap-3.5">
        <span className={cn("grid h-[58px] w-[58px] shrink-0 place-items-center rounded-full font-display text-[17px] font-bold", supplier.tone)}>
          {supplier.initials}
        </span>
        <div className="min-w-0">
          <p className="flex flex-wrap items-center gap-2 text-[16px] font-bold text-[#111111]">
            {supplier.name}
            <span className={cn("rounded-full px-2.5 py-0.5 text-[10px] font-bold", meta.badgeClass)}>
              {meta.label}
            </span>
          </p>
          <p className="mt-1 flex items-center gap-1 text-[11.5px] text-[#777777]">
            <MapPin className="h-3 w-3 shrink-0 text-[#2E7D32]" />
            {supplier.location}
          </p>
          <p className="mt-0.5 flex items-center gap-1 text-[11.5px] text-[#777777]">
            <Star className="h-3 w-3 text-amber-400" fill="currentColor" />
            <span className="font-semibold text-[#111111]">{supplier.rating.toFixed(1)}</span> · {supplier.deals} deals
          </p>
        </div>
      </div>

      <dl className="mt-5 flex flex-col gap-2.5">
        <div className="flex items-baseline justify-between gap-3 border-b border-[#F0F3F0] pb-2">
          <dt className="text-[12px] font-medium text-[#777777]">Annual Production</dt>
          <dd className="text-right text-[12.5px] font-semibold text-[#111111]">{supplier.annualProduction}</dd>
        </div>
        {supplier.members && (
          <div className="flex items-baseline justify-between gap-3 border-b border-[#F0F3F0] pb-2">
            <dt className="text-[12px] font-medium text-[#777777]">Members</dt>
            <dd className="text-right text-[12.5px] font-semibold text-[#111111]">{supplier.members}</dd>
          </div>
        )}
      </dl>

      <div className="mt-4">
        <p className="text-[12px] font-bold text-[#111111]">Main Crops</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {supplier.mainCrops.map((crop) => (
            <span key={crop} className="rounded-full bg-[#EEF3EE] px-3 py-1 text-[11.5px] font-semibold text-[#3E5B47]">
              {crop}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <p className="text-[12px] font-bold text-[#111111]">About Supplier</p>
        <p className="mt-1.5 rounded-xl bg-[#F7FAF7] px-4 py-3 text-[12.5px] leading-relaxed text-[#555555] ring-1 ring-[#E1E5E1]">
          {supplier.about}
        </p>
      </div>

      <div className="mt-5 flex gap-3">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-[46px] flex-1 items-center justify-center rounded-xl border-[1.5px] border-[#D8DED8] bg-white text-[13.5px] font-semibold text-[#444444] transition-colors hover:border-[#2E7D32]/50 hover:text-[#2E7D32]"
        >
          Close
        </button>
        <button
          type="button"
          onClick={onInquire}
          className="inline-flex h-[46px] flex-1 items-center justify-center gap-2 rounded-xl bg-[#2E7D32] text-[13.5px] font-semibold text-white transition-colors hover:bg-[#256628]"
        >
          <Handshake className="h-4 w-4" strokeWidth={2.2} />
          Send Inquiry
        </button>
      </div>
    </ModalShell>
  );
}

/* ------------------------------- Send inquiry ------------------------------ */

export function InquiryModal({
  supplier,
  onClose,
  onSent,
}: {
  supplier: BuyerSupplier;
  onClose: () => void;
  onSent: (supplierName: string) => void;
}) {
  const [crop, setCrop] = useState(supplier.mainCrops[0]!);
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("Quintal");
  const [message, setMessage] = useState(
    `I am interested in sourcing ${supplier.mainCrops[0]!} from your ${supplier.type === "fpo" ? "FPO" : "farm"}.`
  );
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!quantity.trim() || Number(quantity) <= 0) {
      setError("Please enter a valid quantity.");
      return;
    }
    setSent(true);
    window.setTimeout(() => {
      onSent(supplier.name);
    }, 1100);
  };

  const inputCls =
    "h-[46px] w-full rounded-xl border border-[#E1E5E1] bg-[#FAFBFA] px-3.5 text-[13.5px] text-[#111111] transition-colors outline-none placeholder:text-[#999999] focus:border-[#2E7D32] focus:bg-white";
  const labelCls = "mb-1.5 block text-[12px] font-semibold text-[#111111]";

  if (sent) {
    return (
      <ModalShell title="Inquiry Sent" onClose={onClose}>
        <div className="flex flex-col items-center gap-3 py-2 text-center">
          <span className="grid h-[68px] w-[68px] place-items-center rounded-full bg-[#EAF6EA]">
            <Check className="h-8 w-8 text-[#2E7D32]" strokeWidth={2.6} />
          </span>
          <h3 className="font-display text-[18px] font-bold text-[#111111]">Inquiry sent successfully!</h3>
          <p className="text-[12.5px] leading-relaxed text-[#666666]">
            Your sourcing inquiry for <span className="font-semibold text-[#111111]">{crop}</span> has
            been sent to <span className="font-semibold text-[#111111]">{supplier.name}</span>. They
            typically respond within 24–48 hours.
          </p>
        </div>
      </ModalShell>
    );
  }

  return (
    <ModalShell title="Send Inquiry" onClose={onClose}>
      <div className="flex items-center gap-3.5 rounded-2xl bg-[#F7FAF7] px-4 py-3 ring-1 ring-[#E1E5E1]">
        <span className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-full font-display text-[13px] font-bold", supplier.tone)}>
          {supplier.initials}
        </span>
        <div>
          <p className="text-[13px] font-semibold text-[#111111]">{supplier.name}</p>
          <p className="mt-0.5 text-[11px] text-[#777777]">{supplier.location}</p>
        </div>
      </div>

      <form onSubmit={submit} className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="inq-crop" className={labelCls}>Crop *</label>
          <select id="inq-crop" value={crop} onChange={(e) => {
            setCrop(e.target.value);
            setMessage(`I am interested in sourcing ${e.target.value} from your ${supplier.type === "fpo" ? "FPO" : "farm"}.`);
          }} className={inputCls}>
            {supplier.mainCrops.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-[1fr_100px] gap-2">
          <div>
            <label htmlFor="inq-qty" className={labelCls}>Quantity *</label>
            <input id="inq-qty" type="number" min={1} value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="e.g. 50" className={inputCls} />
          </div>
          <div>
            <label htmlFor="inq-unit" className={labelCls}>Unit *</label>
            <select id="inq-unit" value={unit} onChange={(e) => setUnit(e.target.value)} className={inputCls}>
              <option>Quintal</option>
              <option>kg</option>
              <option>tonne</option>
            </select>
          </div>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="inq-message" className={labelCls}>Message</label>
          <textarea
            id="inq-message"
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe your quantity, quality and delivery requirements..."
            className="w-full resize-none rounded-xl border border-[#E1E5E1] bg-[#FAFBFA] px-3.5 py-3 text-[13.5px] text-[#111111] transition-colors outline-none placeholder:text-[#999999] focus:border-[#2E7D32] focus:bg-white"
          />
        </div>

        {error && (
          <p role="alert" className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2.5 text-[12.5px] font-medium text-red-600 sm:col-span-2">
            <CircleAlert className="h-4 w-4 shrink-0" strokeWidth={2.2} />
            {error}
          </p>
        )}

        <div className="flex flex-col-reverse gap-3 sm:col-span-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-[46px] items-center justify-center rounded-xl border-[1.5px] border-[#D8DED8] bg-white px-6 text-[13.5px] font-semibold text-[#444444] transition-colors hover:border-[#2E7D32]/50 hover:text-[#2E7D32]"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex h-[46px] items-center justify-center gap-2 rounded-xl bg-[#2E7D32] px-7 text-[13.5px] font-semibold text-white shadow-[0_10px_22px_-10px_rgba(46,125,50,0.55)] transition-colors hover:bg-[#256628]"
          >
            <Send className="h-4 w-4" strokeWidth={2.2} />
            Send Inquiry
          </button>
        </div>
      </form>
    </ModalShell>
  );
}
