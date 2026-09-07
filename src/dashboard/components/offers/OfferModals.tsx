import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Check, CircleAlert, Lightbulb, X } from "lucide-react";
import type { Buyer, Offer } from "../../data/offers";
import { inr, NEGOTIATION_TIPS } from "../../data/offers";
import { cn } from "../../../utils/cn";

/* ------------------------------ Modal shell -------------------------------- */

function ModalShell({
  title,
  onClose,
  children,
  wide = false,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  wide?: boolean;
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
        className={cn("animate-pop-in max-h-[92dvh] w-full overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-7", wide ? "max-w-[560px]" : "max-w-[440px]")}
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

/* ---------------------------- Accept confirm ------------------------------- */

export function AcceptOfferModal({
  offer,
  buyer,
  onCancel,
  onConfirm,
}: {
  offer: Offer;
  buyer: Buyer;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const rows: [string, string][] = [
    ["Buyer", buyer.name],
    ["Crop", offer.lotLabel],
    ["Quantity", `${offer.quantityKg.toLocaleString("en-IN")} kg`],
    ["Price", `₹ ${offer.pricePerKg.toFixed(2)}/kg`],
    ["Total Amount", `${inr(offer.totalAmount)}`],
  ];

  return (
    <ModalShell title="Accept this offer?" onClose={onCancel}>
      <p className="text-[12.5px] text-[#666666]">
        Confirm the deal details before accepting. The buyer will be notified.
      </p>
      <dl className="mt-4 flex flex-col gap-2.5">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-baseline justify-between gap-3 border-b border-[#F0F3F0] pb-2">
            <dt className="text-[12px] font-medium text-[#777777]">{label}</dt>
            <dd className="text-right text-[12.5px] font-semibold text-[#111111]">{value}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex h-[46px] flex-1 items-center justify-center rounded-xl border-[1.5px] border-[#D8DED8] bg-white text-[13.5px] font-semibold text-[#444444] transition-colors hover:border-[#2E7D32]/50 hover:text-[#2E7D32]"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="inline-flex h-[46px] flex-1 items-center justify-center gap-2 rounded-xl bg-[#2E7D32] text-[13.5px] font-semibold text-white transition-colors hover:bg-[#256628]"
        >
          <Check className="h-4 w-4" strokeWidth={2.6} />
          Confirm &amp; Accept
        </button>
      </div>
    </ModalShell>
  );
}

/* ---------------------------- Reject confirm ------------------------------- */

export function RejectOfferModal({
  offer,
  buyer,
  onCancel,
  onConfirm,
}: {
  offer: Offer;
  buyer: Buyer;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <ModalShell title="Reject this offer?" onClose={onCancel}>
      <p className="text-[13px] leading-relaxed text-[#666666]">
        Are you sure you want to reject the offer from{" "}
        <span className="font-semibold text-[#111111]">{buyer.name}</span> for{" "}
        <span className="font-semibold text-[#111111]">
          {offer.quantityKg.toLocaleString("en-IN")} kg of {offer.crop}
        </span>
        ? This action cannot be undone.
      </p>
      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex h-[46px] flex-1 items-center justify-center rounded-xl border-[1.5px] border-[#D8DED8] bg-white text-[13.5px] font-semibold text-[#444444] transition-colors hover:border-[#2E7D32]/50 hover:text-[#2E7D32]"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="inline-flex h-[46px] flex-1 items-center justify-center gap-2 rounded-xl bg-red-500 text-[13.5px] font-semibold text-white transition-colors hover:bg-red-600"
        >
          <X className="h-4 w-4" strokeWidth={2.6} />
          Reject Offer
        </button>
      </div>
    </ModalShell>
  );
}

/* ------------------------------ Counter modal ------------------------------ */

export function CounterOfferModal({
  offer,
  onCancel,
  onSend,
}: {
  offer: Offer;
  onCancel: () => void;
  onSend: (price: number, note: string) => void;
}) {
  const [price, setPrice] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = Number(price);
    if (!Number.isFinite(value) || value <= 0) {
      setError("Enter a valid counter price greater than 0.");
      return;
    }
    onSend(value, note.trim());
  };

  return (
    <ModalShell title="Counter Offer" onClose={onCancel}>
      <p className="flex items-center justify-between rounded-xl bg-[#F7FAF7] px-4 py-3 text-[12.5px] ring-1 ring-[#E1E5E1]">
        <span className="font-medium text-[#777777]">Current Offer Price</span>
        <span className="font-display text-[15px] font-bold text-[#111111]">₹ {offer.pricePerKg.toFixed(2)}/kg</span>
      </p>

      <form onSubmit={submit} className="mt-4 flex flex-col gap-4">
        <div>
          <label htmlFor="counter-price" className="mb-1.5 block text-[12px] font-semibold text-[#111111]">
            Enter your counter price (₹/kg)
          </label>
          <input
            id="counter-price"
            type="number"
            min={0}
            step="0.25"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder={`e.g. ${(offer.pricePerKg + 1).toFixed(2)}`}
            className={cn(
              "h-[48px] w-full rounded-xl border bg-[#FAFBFA] px-4 text-[15px] font-semibold text-[#111111] transition-colors outline-none placeholder:font-normal placeholder:text-[#999999] focus:bg-white",
              error ? "border-red-400 focus:border-red-500" : "border-[#E1E5E1] focus:border-[#1D6FB8]"
            )}
          />
          {error && (
            <p role="alert" className="mt-1.5 flex items-center gap-1.5 text-[12px] font-medium text-red-600">
              <CircleAlert className="h-3.5 w-3.5" strokeWidth={2.2} />
              {error}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="counter-note" className="mb-1.5 block text-[12px] font-semibold text-[#111111]">
            Add a message to the buyer <span className="font-normal text-[#999999]">(optional)</span>
          </label>
          <textarea
            id="counter-note"
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Grade A quality, freshly harvested — this is my best rate."
            className="w-full resize-none rounded-xl border border-[#E1E5E1] bg-[#FAFBFA] px-4 py-3 text-[13px] text-[#111111] transition-colors outline-none placeholder:text-[#999999] focus:border-[#1D6FB8] focus:bg-white"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex h-[46px] flex-1 items-center justify-center rounded-xl border-[1.5px] border-[#D8DED8] bg-white text-[13.5px] font-semibold text-[#444444] transition-colors hover:border-[#2E7D32]/50 hover:text-[#2E7D32]"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex h-[46px] flex-1 items-center justify-center rounded-xl bg-[#1D6FB8] text-[13.5px] font-semibold text-white transition-colors hover:bg-[#175c99]"
          >
            Send Counter Offer
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

/* ----------------------------- Tips modal ---------------------------------- */

export function NegotiationTipsModal({ onClose }: { onClose: () => void }) {
  return (
    <ModalShell title="Negotiation Tips" onClose={onClose} wide>
      <p className="text-[12.5px] text-[#666666]">
        Practical tips to get the best value for your produce.
      </p>
      <ul className="mt-4 flex flex-col gap-3">
        {NEGOTIATION_TIPS.map((tip, i) => (
          <li key={tip} className="flex items-start gap-3 rounded-2xl bg-[#F7FAF7] px-4 py-3 ring-1 ring-[#E1E5E1]">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#EAF6EA] text-[12px] font-bold text-[#2E7D32]">
              {i + 1}
            </span>
            <span className="mt-0.5 text-[12.5px] leading-relaxed font-medium text-[#444444]">{tip}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 flex items-center gap-2 text-[12px] font-medium text-[#555555]">
        <Lightbulb className="h-4 w-4 text-[#E8862D]" />
        A well-negotiated deal can add 5–10% more value to your lot.
      </p>
    </ModalShell>
  );
}
