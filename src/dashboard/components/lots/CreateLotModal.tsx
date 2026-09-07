import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { ImagePlus, X } from "lucide-react";
import type { CropLot } from "../../data/cropLots";
import { CROP_NAME_OPTIONS, FARMER_PROFILE, GRADE_OPTIONS, UNIT_OPTIONS } from "../../data/cropLots";
import { cn } from "../../../utils/cn";

export interface LotFormValues {
  crop: string;
  variety: string;
  quantity: string;
  unit: CropLot["unit"];
  grade: string;
  organic: "yes" | "no";
  location: string;
  expectedPrice: string;
  priceUnit: CropLot["unit"];
  description: string;
  image: string;
}

export type LotSaveIntent = "active" | "draft";

const inputCls =
  "h-[46px] w-full rounded-xl border border-[#E1E5E1] bg-[#FAFBFA] px-3.5 text-[13.5px] text-[#111111] transition-colors outline-none placeholder:text-[#999999] focus:border-[#2E7D32] focus:bg-white";
const labelCls = "mb-1.5 block text-[12px] font-semibold text-[#111111]";
const sectionCls = "sm:col-span-2";
const sectionTitleCls = "mb-3 border-b border-[#F0F3F0] pb-2 text-[11px] font-bold tracking-[0.08em] text-[#8A938A] uppercase";

export function lotToForm(lot: CropLot): LotFormValues {
  return {
    crop: lot.cropKey || lot.crop,
    variety: lot.variety,
    quantity: String(lot.quantity),
    unit: lot.unit,
    grade: lot.grade,
    organic: lot.organic ? "yes" : "no",
    location: lot.location,
    expectedPrice: lot.expectedPrice !== undefined ? String(lot.expectedPrice) : "",
    priceUnit: lot.priceUnit ?? lot.unit,
    description: lot.description,
    image: lot.image,
  };
}

export const EMPTY_LOT_FORM: LotFormValues = {
  crop: "",
  variety: "",
  quantity: "",
  unit: "kg",
  grade: "Grade A",
  organic: "no",
  location: FARMER_PROFILE.location,
  expectedPrice: "",
  priceUnit: "kg",
  description: "",
  image: "",
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
  onSave: (values: LotFormValues, intent: LotSaveIntent) => void;
}) {
  const [values, setValues] = useState<LotFormValues>(initialValues);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const set = (patch: Partial<LotFormValues>) => setValues((v) => ({ ...v, ...patch }));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const pickImage = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => typeof reader.result === "string" && set({ image: reader.result });
    reader.readAsDataURL(file);
  };

  const validate = (): string => {
    if (!values.crop.trim()) return "Please select a Crop Name.";
    if (!values.quantity.trim() || !Number.isFinite(Number(values.quantity)) || Number(values.quantity) <= 0)
      return "Quantity must be a number greater than 0.";
    if (!values.location.trim()) return "Please enter a Location.";
    if (!values.expectedPrice.trim() || Number(values.expectedPrice) <= 0)
      return "Expected Price must be a number greater than 0.";
    return "";
  };

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const message = validate();
    if (message) {
      setError(message);
      return;
    }
    onSave(values, "active");
  };

  const qtyExample = values.quantity
    ? `₹${values.expectedPrice || "…"} / ${values.priceUnit} • ${Number(values.quantity).toLocaleString("en-IN")} ${values.unit}`
    : `e.g. ₹2,100 / ${values.priceUnit}`;

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
                ? "Add the produce details to publish your lot to buyers."
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
          {/* Section 1 — Crop Details */}
          <p className={cn(sectionCls, sectionTitleCls)}>Crop Details</p>
          <div>
            <label htmlFor="lot-crop" className={labelCls}>Crop Name *</label>
            <select id="lot-crop" value={values.crop} onChange={(e) => set({ crop: e.target.value })} className={cn(inputCls, !values.crop && "text-[#999999]")}>
              <option value="" disabled>Select a crop</option>
              {CROP_NAME_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
              {!CROP_NAME_OPTIONS.includes(values.crop) && values.crop && <option value={values.crop}>{values.crop}</option>}
            </select>
          </div>
          <div>
            <label htmlFor="lot-variety" className={labelCls}>Variety</label>
            <input id="lot-variety" value={values.variety} onChange={(e) => set({ variety: e.target.value })} placeholder="e.g. Hybrid" className={inputCls} />
          </div>
          <div>
            <label htmlFor="lot-grade" className={labelCls}>Quality / Grade *</label>
            <select id="lot-grade" value={values.grade} onChange={(e) => set({ grade: e.target.value })} className={inputCls}>
              {GRADE_OPTIONS.map((g) => <option key={g} value={g}>{g}</option>)}
              {!GRADE_OPTIONS.includes(values.grade) && values.grade && <option value={values.grade}>{values.grade}</option>}
            </select>
          </div>
          <div>
            <label htmlFor="lot-organic" className={labelCls}>Organic</label>
            <select id="lot-organic" value={values.organic} onChange={(e) => set({ organic: e.target.value as LotFormValues["organic"] })} className={inputCls}>
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </div>

          {/* Section 2 — Quantity */}
          <p className={cn(sectionCls, sectionTitleCls)}>Quantity</p>
          <div className="grid grid-cols-[1fr_110px] gap-2">
            <div>
              <label htmlFor="lot-qty" className={labelCls}>Quantity *</label>
              <input id="lot-qty" type="number" min={1} value={values.quantity} onChange={(e) => set({ quantity: e.target.value })} placeholder="e.g. 500" className={inputCls} />
            </div>
            <div>
              <label htmlFor="lot-unit" className={labelCls}>Unit *</label>
              <select id="lot-unit" value={values.unit} onChange={(e) => set({ unit: e.target.value as CropLot["unit"] })} className={inputCls}>
                {UNIT_OPTIONS.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>
          <div />

          {/* Section 3 — Location */}
          <p className={cn(sectionCls, sectionTitleCls)}>Location</p>
          <div className={sectionCls}>
            <label htmlFor="lot-location" className={labelCls}>Location *</label>
            <input id="lot-location" value={values.location} onChange={(e) => set({ location: e.target.value })} placeholder={`e.g. ${FARMER_PROFILE.location}`} className={inputCls} />
            <p className="mt-1.5 text-[11px] text-[#999999]">Prefilled from your saved farm location — you can edit it if needed.</p>
          </div>

          {/* Section 4 — Expected Price */}
          <p className={cn(sectionCls, sectionTitleCls)}>Expected Price</p>
          <div className="grid grid-cols-[1fr_110px] gap-2">
            <div>
              <label htmlFor="lot-price" className={labelCls}>Expected Price *</label>
              <input id="lot-price" type="number" min={0} step="0.25" value={values.expectedPrice} onChange={(e) => set({ expectedPrice: e.target.value })} placeholder="e.g. 2100" className={inputCls} />
            </div>
            <div>
              <label htmlFor="lot-price-unit" className={labelCls}>Price Unit</label>
              <select id="lot-price-unit" value={values.priceUnit} onChange={(e) => set({ priceUnit: e.target.value as CropLot["unit"] })} className={inputCls}>
                {UNIT_OPTIONS.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>
          <div className="flex items-end pb-1">
            <p className="text-[12px] font-medium text-[#666666]">{qtyExample}</p>
          </div>

          {/* Section 5 — Crop Image */}
          <p className={cn(sectionCls, sectionTitleCls)}>Crop Image (Optional)</p>
          <div className={sectionCls}>
            {values.image ? (
              <div className="flex items-center gap-3">
                <img src={values.image} alt="Crop preview" className="h-20 w-20 rounded-xl object-cover ring-1 ring-[#E1E5E1]" />
                <button
                  type="button"
                  onClick={() => set({ image: "" })}
                  className="inline-flex h-9 items-center rounded-lg border-[1.5px] border-red-300 bg-white px-3 text-[12px] font-semibold text-red-500 transition-colors hover:bg-red-50"
                >
                  Remove Image
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex h-[72px] w-full flex-col items-center justify-center gap-1 rounded-xl border-[1.5px] border-dashed border-[#C9D2C9] bg-[#FAFBFA] text-[#2E7D32] transition-colors hover:border-[#2E7D32]/60 hover:bg-[#EAF6EA]/50"
              >
                <ImagePlus className="h-4 w-4" strokeWidth={2.2} />
                <span className="text-[11.5px] font-semibold">Upload crop image</span>
              </button>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="sr-only" aria-label="Upload crop image" onChange={(e) => pickImage(e.target.files?.[0])} />
          </div>

          {/* Section 6 — Description */}
          <p className={cn(sectionCls, sectionTitleCls)}>Description</p>
          <div className={sectionCls}>
            <label htmlFor="lot-desc" className={labelCls}>Description</label>
            <textarea
              id="lot-desc"
              rows={3}
              value={values.description}
              onChange={(e) => set({ description: e.target.value })}
              placeholder="Freshly harvested, good quality produce."
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