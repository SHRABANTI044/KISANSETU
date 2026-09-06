import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { X } from "lucide-react";
import type { CropLot } from "../../data/cropLots";
import { GRADE_OPTIONS, UNIT_OPTIONS } from "../../data/cropLots";
import { cn } from "../../../utils/cn";

export interface LotFormValues {
  crop: string;
  quantity: string;
  unit: CropLot["unit"];
  grade: string;
  location: string;
  harvestDateIso: string;
  expectedPrice: string;
  status: "active" | "draft";
  description: string;
}

const inputCls =
  "h-[46px] w-full rounded-xl border border-[#E1E5E1] bg-[#FAFBFA] px-3.5 text-[13.5px] text-[#111111] transition-colors outline-none placeholder:text-[#999999] focus:border-[#2E7D32] focus:bg-white";
const labelCls = "mb-1.5 block text-[12px] font-semibold text-[#111111]";

export function lotToForm(lot: CropLot): LotFormValues {
  return {
    crop: lot.crop,
    quantity: String(lot.quantity),
    unit: lot.unit,
    grade: lot.grade,
    location: lot.location,
    harvestDateIso: lot.harvestDateIso,
    expectedPrice: lot.expectedPrice !== undefined ? String(lot.expectedPrice) : "",
    status: lot.status === "draft" ? "draft" : "active",
    description: lot.description,
  };
}

export const EMPTY_LOT_FORM: LotFormValues = {
  crop: "",
  quantity: "",
  unit: "kg",
  grade: "Grade A",
  location: "",
  harvestDateIso: "",
  expectedPrice: "",
  status: "active",
  description: "",
};

export default function CreateLotModal({
  mode,
  initialValues,
  onClose,
  onSave,
}: {
  mode: "create" | "edit";
  initialValues: LotFormValues;
  onClose: () => void;
  onSave: (values: LotFormValues) => void;
}) {
  const [values, setValues] = useState<LotFormValues>(initialValues);
  const [error, setError] = useState("");
  const set = (patch: Partial<LotFormValues>) => setValues((v) => ({ ...v, ...patch }));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!values.crop.trim() || !values.quantity.trim() || !values.location.trim()) {
      setError("Please fill Crop, Quantity and Location.");
      return;
    }
    const qty = Number(values.quantity);
    if (!Number.isFinite(qty) || qty <= 0) {
      setError("Quantity must be a number greater than 0.");
      return;
    }
    onSave(values);
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-black/45 p-0 backdrop-blur-[2px] sm:items-center sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-label={mode === "create" ? "Create new lot" : "Edit lot"}
      onClick={onClose}
    >
      <div
        className="animate-pop-in max-h-[92dvh] w-full max-w-[560px] overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-3xl sm:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-[19px] font-bold text-[#111111]">
              {mode === "create" ? "Create New Lot" : "Edit Lot"}
            </h2>
            <p className="mt-1 text-[12.5px] text-[#666666]">
              {mode === "create"
                ? "Add the produce details — you can edit them anytime."
                : "Update the lot details and save your changes."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[#E1E5E1] text-[#666666] transition-colors hover:bg-[#EAF6EA] hover:text-[#2E7D32]"
          >
            <X className="h-[18px] w-[18px]" />
          </button>
        </div>

        <form onSubmit={submit} className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="lot-crop" className={labelCls}>Crop Name</label>
            <input id="lot-crop" value={values.crop} onChange={(e) => set({ crop: e.target.value })} placeholder="e.g. Tomato (Hybrid)" className={inputCls} />
          </div>
          <div className="grid grid-cols-[1fr_110px] gap-2">
            <div>
              <label htmlFor="lot-qty" className={labelCls}>Quantity</label>
              <input id="lot-qty" type="number" min={1} value={values.quantity} onChange={(e) => set({ quantity: e.target.value })} placeholder="e.g. 500" className={inputCls} />
            </div>
            <div>
              <label htmlFor="lot-unit" className={labelCls}>Unit</label>
              <select id="lot-unit" value={values.unit} onChange={(e) => set({ unit: e.target.value as CropLot["unit"] })} className={inputCls}>
                {UNIT_OPTIONS.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="lot-grade" className={labelCls}>Quality / Grade</label>
            <select id="lot-grade" value={values.grade} onChange={(e) => set({ grade: e.target.value })} className={inputCls}>
              {GRADE_OPTIONS.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="lot-location" className={labelCls}>Location</label>
            <input id="lot-location" value={values.location} onChange={(e) => set({ location: e.target.value })} placeholder="e.g. Kothur, Ahmednagar" className={inputCls} />
          </div>
          <div>
            <label htmlFor="lot-date" className={labelCls}>Harvest Date</label>
            <input id="lot-date" type="date" value={values.harvestDateIso} onChange={(e) => set({ harvestDateIso: e.target.value })} className={cn(inputCls, "text-[#666666]")} />
          </div>
          <div>
            <label htmlFor="lot-price" className={labelCls}>Expected Price (per unit)</label>
            <input id="lot-price" type="number" min={0} step="0.25" value={values.expectedPrice} onChange={(e) => set({ expectedPrice: e.target.value })} placeholder="e.g. 23.00" className={inputCls} />
          </div>
          {mode === "create" && (
            <div>
              <label htmlFor="lot-status" className={labelCls}>Status</label>
              <select id="lot-status" value={values.status} onChange={(e) => set({ status: e.target.value as LotFormValues["status"] })} className={inputCls}>
                <option value="active">Active (publish now)</option>
                <option value="draft">Draft (save for later)</option>
              </select>
            </div>
          )}
          <div className="sm:col-span-2">
            <label htmlFor="lot-desc" className={labelCls}>Description</label>
            <textarea
              id="lot-desc"
              rows={3}
              value={values.description}
              onChange={(e) => set({ description: e.target.value })}
              placeholder="e.g. Freshly harvested, good quality produce. Ready for immediate delivery."
              className="w-full resize-none rounded-xl border border-[#E1E5E1] bg-[#FAFBFA] px-3.5 py-3 text-[13.5px] text-[#111111] transition-colors outline-none placeholder:text-[#999999] focus:border-[#2E7D32] focus:bg-white"
            />
          </div>

          {error && (
            <p role="alert" className="rounded-xl bg-red-50 px-4 py-2.5 text-[12.5px] font-medium text-red-600 sm:col-span-2">
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
              {mode === "create" ? "Create Lot" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
