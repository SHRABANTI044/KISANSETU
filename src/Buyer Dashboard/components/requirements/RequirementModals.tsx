import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  ArrowLeftRight,
  Check,
  CircleAlert,
  Handshake,
  MapPin,
  Star,
  X,
} from "lucide-react";
import type { BuyerRequirement, RequirementOffer } from "../../data/buyerRequirements";
import { priceRange, REQUIREMENT_STATUS_META } from "../../data/buyerRequirements";
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
      className="fixed inset-0 z-[70] flex items-end justify-center bg-black/45 p-0 backdrop-blur-[2px] sm:items-center sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <div
        className={cn(
          "animate-pop-in max-h-[92dvh] w-full overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-3xl sm:p-7",
          wide ? "max-w-[620px]" : "max-w-[460px]"
        )}
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

/* --------------------------- Create / Edit form ---------------------------- */

export interface RequirementFormValues {
  cropName: string;
  variety: string;
  quantity: string;
  unit: BuyerRequirement["unit"];
  minPrice: string;
  maxPrice: string;
  grade: string;
  location: string;
  dueDateIso: string;
  description: string;
}

export const EMPTY_REQUIREMENT_FORM: RequirementFormValues = {
  cropName: "",
  variety: "",
  quantity: "",
  unit: "Quintal",
  minPrice: "",
  maxPrice: "",
  grade: "A",
  location: "",
  dueDateIso: "",
  description: "",
};

export function requirementToForm(req: BuyerRequirement): RequirementFormValues {
  return {
    cropName: req.cropName,
    variety: req.variety,
    quantity: String(req.quantity),
    unit: req.unit,
    minPrice: String(req.minPrice),
    maxPrice: String(req.maxPrice),
    grade: req.grade,
    location: req.location,
    dueDateIso: req.dueDateIso,
    description: req.description,
  };
}

const inputCls =
  "h-[46px] w-full rounded-xl border border-[#E1E5E1] bg-[#FAFBFA] px-3.5 text-[13.5px] text-[#111111] transition-colors outline-none placeholder:text-[#999999] focus:border-[#2E7D32] focus:bg-white";
const labelCls = "mb-1.5 block text-[12px] font-semibold text-[#111111]";

export function RequirementFormModal({
  mode,
  initialValues,
  onClose,
  onSave,
}: {
  mode: "create" | "edit";
  initialValues: RequirementFormValues;
  onClose: () => void;
  onSave: (values: RequirementFormValues) => void;
}) {
  const [values, setValues] = useState<RequirementFormValues>(initialValues);
  const [error, setError] = useState("");
  const set = (patch: Partial<RequirementFormValues>) => setValues((v) => ({ ...v, ...patch }));

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!values.cropName.trim() || !values.quantity.trim() || !values.location.trim()) {
      setError("Please fill Crop Name, Quantity and Location.");
      return;
    }
    if (!Number.isFinite(Number(values.quantity)) || Number(values.quantity) <= 0) {
      setError("Quantity must be a number greater than 0.");
      return;
    }
    if (values.minPrice && values.maxPrice && Number(values.maxPrice) < Number(values.minPrice)) {
      setError("Maximum price cannot be lower than minimum price.");
      return;
    }
    onSave(values);
  };

  return (
    <ModalShell title={mode === "create" ? "Create New Requirement" : "Edit Requirement"} onClose={onClose} wide>
      <p className="-mt-1 text-[12.5px] text-[#666666]">
        {mode === "create"
          ? "Post what you need — verified farmers will send offers. New requirements are created as Open."
          : "Update the requirement details. Your Requirement ID and received offers stay unchanged."}
      </p>

      <form onSubmit={submit} className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="req-crop" className={labelCls}>Crop Name *</label>
          <input id="req-crop" value={values.cropName} onChange={(e) => set({ cropName: e.target.value })} placeholder="e.g. Paddy" className={inputCls} />
        </div>
        <div>
          <label htmlFor="req-variety" className={labelCls}>Variety</label>
          <input id="req-variety" value={values.variety} onChange={(e) => set({ variety: e.target.value })} placeholder="e.g. Common" className={inputCls} />
        </div>
        <div className="grid grid-cols-[1fr_110px] gap-2">
          <div>
            <label htmlFor="req-qty" className={labelCls}>Quantity *</label>
            <input id="req-qty" type="number" min={1} value={values.quantity} onChange={(e) => set({ quantity: e.target.value })} placeholder="e.g. 100" className={inputCls} />
          </div>
          <div>
            <label htmlFor="req-unit" className={labelCls}>Unit *</label>
            <select id="req-unit" value={values.unit} onChange={(e) => set({ unit: e.target.value as BuyerRequirement["unit"] })} className={inputCls}>
              {["Quintal", "kg", "tonne"].map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="req-grade" className={labelCls}>Quality / Grade</label>
          <select id="req-grade" value={values.grade} onChange={(e) => set({ grade: e.target.value })} className={inputCls}>
            {["A", "B", "C", "Premium"].map((g) => (
              <option key={g}>{g}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="req-min" className={labelCls}>Preferred Price Minimum (₹)</label>
          <input id="req-min" type="number" min={0} value={values.minPrice} onChange={(e) => set({ minPrice: e.target.value })} placeholder="e.g. 2000" className={inputCls} />
        </div>
        <div>
          <label htmlFor="req-max" className={labelCls}>Preferred Price Maximum (₹)</label>
          <input id="req-max" type="number" min={0} value={values.maxPrice} onChange={(e) => set({ maxPrice: e.target.value })} placeholder="e.g. 2200" className={inputCls} />
        </div>
        <div>
          <label htmlFor="req-location" className={labelCls}>Preferred Location *</label>
          <input id="req-location" value={values.location} onChange={(e) => set({ location: e.target.value })} placeholder="e.g. Kolkata, WB" className={inputCls} />
        </div>
        <div>
          <label htmlFor="req-date" className={labelCls}>Required By Date</label>
          <input id="req-date" type="date" value={values.dueDateIso} onChange={(e) => set({ dueDateIso: e.target.value })} className={cn(inputCls, "text-[#666666]")} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="req-desc" className={labelCls}>Description</label>
          <textarea
            id="req-desc"
            rows={3}
            value={values.description}
            onChange={(e) => set({ description: e.target.value })}
            placeholder="Any quality notes, packing preference, delivery expectations..."
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
            className="inline-flex h-[46px] items-center justify-center rounded-xl bg-[#2E7D32] px-7 text-[13.5px] font-semibold text-white shadow-[0_10px_22px_-10px_rgba(46,125,50,0.55)] transition-colors hover:bg-[#256628]"
          >
            {mode === "create" ? "Create Requirement" : "Save Changes"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

/* ----------------------------- Details modal ------------------------------- */

export function RequirementDetailsModal({
  requirement,
  onClose,
}: {
  requirement: BuyerRequirement;
  onClose: () => void;
}) {
  const meta = REQUIREMENT_STATUS_META[requirement.status];
  const rows: [string, string][] = [
    ["Requirement ID", requirement.requirementId],
    ["Crop", `${requirement.cropName} (${requirement.variety})`],
    ["Grade", requirement.grade],
    ["Quantity", `${requirement.quantity.toLocaleString("en-IN")} ${requirement.unit}`],
    ["Preferred Price", `${priceRange(requirement.minPrice, requirement.maxPrice)} /quintal`],
    ["Location", requirement.location],
    ["Timeline", requirement.timeline],
    ["Due Date", requirement.dueDateLabel],
    ["Offers Received", String(requirement.offersCount)],
    ["Status", meta.label],
    ["Created Date", requirement.createdLabel],
  ];

  return (
    <ModalShell title="Requirement Details" onClose={onClose}>
      <span className={cn("inline-flex rounded-full px-3 py-1 text-[10.5px] font-bold", meta.badgeClass)}>
        {meta.label}
      </span>
      <dl className="mt-4 flex flex-col gap-2.5">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-baseline justify-between gap-3 border-b border-[#F0F3F0] pb-2">
            <dt className="text-[12px] font-medium text-[#777777]">{label}</dt>
            <dd className="text-right text-[12.5px] font-semibold text-[#111111]">{value}</dd>
          </div>
        ))}
      </dl>
      {requirement.description && (
        <div className="mt-4">
          <p className="text-[12px] font-bold text-[#111111]">Description</p>
          <p className="mt-1.5 rounded-xl bg-[#F7FAF7] px-4 py-3 text-[12.5px] leading-relaxed text-[#555555] ring-1 ring-[#E1E5E1]">
            {requirement.description}
          </p>
        </div>
      )}
    </ModalShell>
  );
}

/* ------------------------------ Offers modal ------------------------------- */

export function RequirementOffersModal({
  requirement,
  offers,
  onClose,
  onToast,
}: {
  requirement: BuyerRequirement;
  offers: RequirementOffer[];
  onClose: () => void;
  onToast: (message: string) => void;
}) {
  const statusStyles: Record<RequirementOffer["status"], string> = {
    pending: "bg-amber-100 text-amber-700",
    negotiating: "bg-[#DCEAF7] text-[#1D6FB8]",
    accepted: "bg-[#EAF6EA] text-[#2E7D32]",
  };
  const statusLabels: Record<RequirementOffer["status"], string> = {
    pending: "Pending",
    negotiating: "Negotiating",
    accepted: "Accepted",
  };

  const empty = offers.length === 0;

  return (
    <ModalShell title={`Offers for ${requirement.requirementId}`} onClose={onClose} wide>
      <div className="-mt-1 flex flex-wrap items-center justify-between gap-2">
        <p className="text-[12.5px] text-[#666666]">
          {requirement.cropName} ({requirement.variety}) · {requirement.quantity} {requirement.unit} ·{" "}
          {priceRange(requirement.minPrice, requirement.maxPrice)}/quintal
        </p>
        <span className="rounded-full bg-[#EAF6EA] px-3 py-1 text-[11px] font-bold text-[#2E7D32]">
          {offers.length} {offers.length === 1 ? "offer" : "offers"}
        </span>
      </div>

      {empty ? (
        <div className="mt-5 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-[#D8DED8] bg-[#FAFBFA] px-6 py-10 text-center">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-[#EAF6EA] text-[#2E7D32]">
            <Handshake className="h-5 w-5" strokeWidth={1.9} />
          </span>
          <p className="text-[13px] font-semibold text-[#111111]">No offers yet</p>
          <p className="max-w-xs text-[12px] leading-relaxed text-[#666666]">
            Your requirement is live. Verified farmers will appear here as they send offers.
          </p>
        </div>
      ) : (
        <ul className="mt-5 flex max-h-[52dvh] flex-col gap-3 overflow-y-auto pr-1">
          {offers.map((offer) => (
            <li key={offer.id} className="rounded-2xl border border-[#E1E5E1] bg-white p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="flex items-center gap-1.5 text-[13.5px] font-semibold text-[#111111]">
                    {offer.farmer}
                    <span className="flex items-center gap-0.5 text-[11px] font-semibold text-[#111111]">
                      <Star className="h-3 w-3 text-amber-400" fill="currentColor" />
                      {offer.rating.toFixed(1)}
                    </span>
                  </p>
                  <p className="mt-0.5 flex items-center gap-1 text-[11.5px] text-[#777777]">
                    <MapPin className="h-3 w-3 text-[#2E7D32]" />
                    {offer.location} · {offer.date}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-display text-[16px] font-bold text-[#2E7D32]">
                    ₹{offer.price.toLocaleString("en-IN")}
                    <span className="ml-1 font-sans text-[11px] font-medium text-[#777777]">/quintal</span>
                  </p>
                  <p className="text-[11px] text-[#777777]">Qty: {offer.quantity} quintal</p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[#F0F3F0] pt-3">
                <span className={cn("inline-flex rounded-full px-3 py-1 text-[10.5px] font-bold", statusStyles[offer.status])}>
                  {statusLabels[offer.status]}
                </span>
                <div className="flex gap-1.5">
                  {offer.status !== "accepted" && (
                    <>
                      <button
                        type="button"
                        onClick={() => onToast(`Offer from ${offer.farmer} accepted (demo).`)}
                        className="inline-flex h-8 items-center gap-1 rounded-lg bg-[#2E7D32] px-3 text-[11px] font-semibold text-white transition-colors hover:bg-[#256628]"
                      >
                        <Check className="h-3.5 w-3.5" strokeWidth={2.6} />
                        Accept
                      </button>
                      <button
                        type="button"
                        onClick={() => onToast(`Counter offer sent to ${offer.farmer} (demo).`)}
                        className="inline-flex h-8 items-center gap-1 rounded-lg border-[1.5px] border-[#1D6FB8] bg-white px-3 text-[11px] font-semibold text-[#1D6FB8] transition-colors hover:bg-[#F3F8FD]"
                      >
                        <ArrowLeftRight className="h-3.5 w-3.5" strokeWidth={2.4} />
                        Negotiate
                      </button>
                      <button
                        type="button"
                        onClick={() => onToast(`Offer from ${offer.farmer} rejected (demo).`)}
                        className="inline-flex h-8 items-center rounded-lg border-[1.5px] border-red-300 bg-white px-3 text-[11px] font-semibold text-red-500 transition-colors hover:bg-red-50"
                      >
                        <X className="h-3.5 w-3.5" strokeWidth={2.6} />
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </ModalShell>
  );
}
