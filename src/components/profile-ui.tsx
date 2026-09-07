import { useRef } from "react";
import type { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleCheckBig,
  Pencil,
  Upload,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "../utils/cn";
import { LogoMark } from "./Logo";

/* ------------------------------ Inputs ---------------------------------- */

const inputClasses =
  "h-[48px] w-full rounded-xl border border-[#E1E5E1] bg-[#FAFBFA] px-4 text-[14px] text-[#111111] transition-colors outline-none placeholder:text-[#999999] focus:border-[#2E7D32] focus:bg-white";

export function FieldLabel({
  label,
  optional = false,
  htmlFor,
}: {
  label: string;
  optional?: boolean;
  htmlFor?: string;
}) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 flex items-baseline gap-2 text-[13px] font-semibold text-[#111111]">
      {label}
      {optional && <span className="text-[11px] font-medium text-[#999999]">Optional</span>}
    </label>
  );
}

export function TextField({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  optional = false,
  inputMode,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  optional?: boolean;
  inputMode?: "text" | "numeric" | "tel" | "email";
}) {
  return (
    <div>
      <FieldLabel label={label} optional={optional} htmlFor={id} />
      <input
        id={id}
        type={type}
        inputMode={inputMode}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputClasses}
      />
    </div>
  );
}

export function SelectField({
  id,
  label,
  value,
  onChange,
  options,
  optional = false,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  optional?: boolean;
}) {
  return (
    <div>
      <FieldLabel label={label} optional={optional} htmlFor={id} />
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className={inputClasses}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

export function TextAreaField({
  id,
  label,
  value,
  onChange,
  placeholder,
  optional = false,
  rows = 3,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  optional?: boolean;
  rows?: number;
}) {
  return (
    <div>
      <FieldLabel label={label} optional={optional} htmlFor={id} />
      <textarea
        id={id}
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full resize-none rounded-xl border border-[#E1E5E1] bg-[#FAFBFA] px-4 py-3 text-[14px] text-[#111111] transition-colors outline-none placeholder:text-[#999999] focus:border-[#2E7D32] focus:bg-white"
      />
    </div>
  );
}

export function ChoiceField({
  label,
  value,
  onChange,
  options,
  optional = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  optional?: boolean;
}) {
  return (
    <div>
      <FieldLabel label={label} optional={optional} />
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={value === option}
            onClick={() => onChange(option)}
            className={cn(
              "rounded-full border px-4 py-2 text-[13px] font-medium transition-all duration-150",
              value === option
                ? "border-[#2E7D32] bg-[#EAF6EA] font-semibold text-[#155B32]"
                : "border-[#E1E5E1] bg-white text-[#555555] hover:border-[#2E7D32]/45"
            )}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

export function FileField({
  id,
  label,
  value,
  onChange,
  optional = false,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (fileName: string) => void;
  optional?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div>
      <FieldLabel label={label} optional={optional} htmlFor={id} />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex w-full items-center gap-3 rounded-xl border-[1.5px] border-dashed border-[#CFD6CF] bg-[#FAFBFA] px-4 py-3.5 text-left transition-colors hover:border-[#2E7D32]/50"
      >
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#EAF6EA]">
          <Upload className="h-4 w-4 text-[#2E7D32]" strokeWidth={2.2} />
        </span>
        <span className="min-w-0 flex-1 truncate text-[13px] text-[#666666]">
          {value || "Click to choose a file (demo — not uploaded)"}
        </span>
      </button>
      <input
        ref={inputRef}
        id={id}
        type="file"
        className="sr-only"
        onChange={(e) => onChange(e.target.files?.[0]?.name ?? "")}
        aria-label={label}
      />
    </div>
  );
}

/* ---------------------------- Layout pieces ------------------------------ */

export function FieldGrid({ children }: { children: ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
}

export function SectionCard({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[22px] border border-[#E1E5E1] bg-white p-6 shadow-[0_12px_34px_-18px_rgba(17,17,17,0.12)] sm:p-7">
      <div className="flex items-center gap-3.5">
        <span className="grid h-[46px] w-[46px] shrink-0 place-items-center rounded-2xl bg-[#EAF6EA] text-[#2E7D32]">
          <Icon className="h-[22px] w-[22px]" strokeWidth={2} />
        </span>
        <div>
          <h2 className="font-display text-[18px] font-semibold text-[#111111]">{title}</h2>
          {description && <p className="mt-0.5 text-[12.5px] text-[#666666]">{description}</p>}
        </div>
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export function StepNav({
  onBack,
  onContinue,
  backLabel = "Back",
  continueLabel = "Save & Continue",
}: {
  onBack: () => void;
  onContinue: () => void;
  backLabel?: string;
  continueLabel?: string;
}) {
  return (
    <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex h-[50px] items-center justify-center gap-2 rounded-xl border-[1.5px] border-[#D8DED8] bg-white px-6 text-[14px] font-semibold text-[#444444] transition-all duration-200 hover:border-[#2E7D32]/50 hover:text-[#2E7D32]"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={2.4} />
        {backLabel}
      </button>
      <button
        type="button"
        onClick={onContinue}
        className="inline-flex h-[50px] items-center justify-center gap-2 rounded-xl bg-[#2E7D32] px-7 text-[14.5px] font-semibold text-white shadow-[0_12px_24px_-10px_rgba(46,125,50,0.55)] transition-all duration-200 hover:bg-[#256628]"
      >
        {continueLabel}
        <ArrowRight className="h-[17px] w-[17px]" strokeWidth={2.4} />
      </button>
    </div>
  );
}

export function EntryCard({
  title,
  canRemove,
  onRemove,
  children,
}: {
  title: string;
  canRemove: boolean;
  onRemove: () => void;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[#E1E5E1] bg-white p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-[11.5px] font-bold tracking-[0.12em] text-[#2E7D32] uppercase">{title}</p>
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-[12px] font-semibold text-red-500 transition-colors hover:text-red-600"
          >
            Remove
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

export function Note({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-xl border border-dashed border-[#2E7D32]/35 bg-[#EAF6EA]/60 px-4 py-3 text-[12.5px] leading-relaxed text-[#155B32]/85">
      {children}
    </p>
  );
}

/* ----------------------------- Progress ---------------------------------- */

function Progress({ steps, current }: { steps: string[]; current: number }) {
  return (
    <div className="mt-7">
      {/* Desktop stepper */}
      <ol className="hidden md:flex">
        {steps.map((label, i) => {
          const state = i < current ? "done" : i === current ? "current" : "todo";
          return (
            <li key={label} className={cn("flex items-center", i < steps.length - 1 && "flex-1")}>
              <div className="flex flex-col items-center gap-2">
                <span
                  className={cn(
                    "grid h-9 w-9 place-items-center rounded-full text-[12.5px] font-bold transition-colors",
                    state === "done" && "bg-[#2E7D32] text-white",
                    state === "current" && "border-2 border-[#2E7D32] bg-white text-[#2E7D32]",
                    state === "todo" && "border-2 border-[#D8DED8] bg-white text-[#999999]"
                  )}
                >
                  {state === "done" ? <Check className="h-4 w-4" strokeWidth={3} /> : i + 1}
                </span>
                <span
                  className={cn(
                    "max-w-[92px] text-center text-[10.5px] leading-tight",
                    state === "current" ? "font-bold text-[#155B32]" : "font-medium text-[#888888]"
                  )}
                >
                  {label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <span
                  className={cn("mx-1 mb-6 h-[2px] flex-1 rounded", i < current ? "bg-[#2E7D32]" : "bg-[#E1E5E1]")}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>

      {/* Mobile / tablet segmented bar */}
      <div className="md:hidden">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[12.5px] font-bold text-[#155B32]">
            Step {current + 1} of {steps.length}
          </p>
          <p className="text-[12px] font-medium text-[#666666]">{steps[current]}</p>
        </div>
        <div className="mt-2.5 flex gap-1.5">
          {steps.map((s, i) => (
            <span key={s} className={cn("h-1.5 flex-1 rounded-full", i <= current ? "bg-[#2E7D32]" : "bg-[#E1E5E1]")} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ Shell ----------------------------------- */

export function ProfileShell({
  title,
  subtitle,
  steps,
  current,
  children,
}: {
  title: string;
  subtitle: string;
  steps: string[];
  current: number;
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#F7FAF7]">
      {/* Slim brand header (auth pages stay free of the landing navbar) */}
      <header className="sticky top-0 z-40 border-b border-[#E1E5E1] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-[980px] items-center justify-between px-5 sm:px-6">
          <Link to="/" aria-label="Kishan Setu — back to home" className="flex items-center gap-2.5">
            <LogoMark className="h-9 w-9" />
            <span className="flex flex-col leading-none">
              <span className="font-display text-[16.5px] font-bold">
                <span className="text-[#E8862D]">Kishan</span> <span className="text-[#2E7D32]">Setu</span>
              </span>
              <span className="mt-[3px] text-[8.5px] font-medium text-[#666666]">
                Connecting Farmers to Better Markets
              </span>
            </span>
          </Link>
          <Link
            to="/login"
            className="text-[12.5px] font-semibold text-[#666666] transition-colors hover:text-[#2E7D32]"
          >
            Exit setup
          </Link>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[980px] px-5 py-8 sm:px-6 sm:py-10">
        <h1 className="font-display text-[26px] font-bold tracking-[-0.01em] text-[#111111] sm:text-[28px]">
          {title}
        </h1>
        <p className="mt-1.5 max-w-2xl text-[14px] leading-relaxed text-[#666666]">{subtitle}</p>
        <Progress steps={steps} current={current} />
        <div className="mt-8">{children}</div>
      </div>
    </main>
  );
}

/* ------------------------------ Review ---------------------------------- */

export function ReviewBlock({
  title,
  onEdit,
  rows,
}: {
  title: string;
  onEdit: () => void;
  rows: [string, string][];
}) {
  const visible = rows.filter(([, v]) => v && v.trim() !== "");
  return (
    <div className="rounded-2xl border border-[#E1E5E1] bg-white p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="font-display text-[15px] font-semibold text-[#111111]">{title}</h3>
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-[#2E7D32] transition-colors hover:text-[#155B32]"
        >
          <Pencil className="h-3.5 w-3.5" />
          Edit
        </button>
      </div>
      {visible.length === 0 ? (
        <p className="text-[12.5px] text-[#999999]">No details added yet.</p>
      ) : (
        <dl className="grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
          {visible.map(([k, v]) => (
            <div key={k} className="flex items-baseline justify-between gap-3 border-b border-[#F0F3F0] pb-2">
              <dt className="text-[12px] font-medium text-[#777777]">{k}</dt>
              <dd className="text-right text-[12.5px] font-semibold text-[#111111]">{v}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}

/* --------------------------- Completion ---------------------------------- */

export function CompletionScreen({
  title,
  text,
  platformId,
  cta,
  to,
}: {
  title: string;
  text: string;
  platformId: string;
  cta: string;
  to: string;
}) {
  const navigate = useNavigate();
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F7FAF7] px-5 py-14">
      <div className="animate-pop-in w-full max-w-[520px] rounded-[26px] border border-[#E1E5E1] bg-white p-8 text-center shadow-[0_18px_50px_-20px_rgba(17,17,17,0.2)] sm:p-10">
        <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-[#EAF6EA]">
          <CircleCheckBig className="h-10 w-10 text-[#2E7D32]" strokeWidth={2} />
        </span>
        <h1 className="mt-6 font-display text-[24px] font-bold text-[#111111]">{title}</h1>
        <p className="mt-2.5 text-[14px] leading-relaxed text-[#666666]">{text}</p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
          <span className="rounded-full bg-[#EAF6EA] px-4 py-2 font-display text-[13.5px] font-bold text-[#155B32]">
            {platformId}
          </span>
          <span className="rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-[12px] font-semibold text-amber-700">
            Verification Status: Pending
          </span>
        </div>
        <p className="mt-3 text-[11px] text-[#888888]">
          {platformId} is an internal KisanSetu platform ID — not a government ID.
        </p>

        <button
          type="button"
          onClick={() => navigate(to)}
          className="mt-7 inline-flex h-[52px] w-full items-center justify-center gap-2.5 rounded-xl bg-[#2E7D32] text-[15px] font-semibold text-white shadow-[0_12px_24px_-10px_rgba(46,125,50,0.55)] transition-all duration-200 hover:bg-[#256628]"
        >
          {cta}
          <ArrowRight className="h-[18px] w-[18px]" strokeWidth={2.4} />
        </button>
      </div>
    </main>
  );
}
