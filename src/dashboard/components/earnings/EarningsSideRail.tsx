import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  Landmark,
  Lightbulb,
  Pencil,
  Sprout,
  X,
} from "lucide-react";
import { BANK_ACCOUNT } from "../../data/earnings";
import type { BankAccount } from "../../data/earnings";
import { EARNINGS_SUMMARY, inr } from "../../data/earnings";

const inputCls =
  "h-[46px] w-full rounded-xl border border-[#E1E5E1] bg-[#FAFBFA] px-3.5 text-[13.5px] text-[#111111] transition-colors outline-none placeholder:text-[#999999] focus:border-[#2E7D32] focus:bg-white";

/* ------------------------------ Progress card ------------------------------ */

export function ProgressCard() {
  return (
    <section className="rounded-2xl border border-[#BFE3C5] bg-[#F0FAF1] p-5 sm:p-6">
      <span className="grid h-[42px] w-[42px] place-items-center rounded-2xl bg-[#2E7D32] text-white">
        <Sprout className="h-[21px] w-[21px]" strokeWidth={2} />
      </span>
      <h2 className="mt-4 font-display text-[16.5px] font-semibold text-[#155B32]">Great Progress!</h2>
      <p className="mt-1.5 text-[12.5px] leading-relaxed text-[#3E5B47]">
        Your earnings are {EARNINGS_SUMMARY.earningsChange}% higher than last month. Keep growing!
      </p>
    </section>
  );
}

/* --------------------------- Pending settlement ---------------------------- */

export function PendingSettlementCard() {
  return (
    <section className="rounded-2xl border border-[#F3CFCF] bg-[#FDF3F3] p-5 sm:p-6">
      <div className="flex items-center gap-3">
        <span className="grid h-[42px] w-[42px] place-items-center rounded-2xl bg-[#C62828] text-white">
          <Landmark className="h-[20px] w-[20px]" strokeWidth={2} />
        </span>
        <h2 className="font-display text-[16.5px] font-semibold text-[#7A1F1F]">Pending Settlement</h2>
      </div>
      <p className="mt-3 font-display text-[26px] leading-none font-bold text-[#7A1F1F]">
        {inr(EARNINGS_SUMMARY.pendingPayment)}
      </p>
      <p className="mt-2 text-[12.5px] leading-relaxed text-[#8A4A4A]">
        Payment will be released after delivery confirmation.
      </p>
      <Link
        to="/dashboard/orders"
        className="mt-4 inline-flex h-[42px] w-full items-center justify-center gap-2 rounded-xl border-[1.5px] border-[#C62828]/40 bg-white text-[12.5px] font-semibold text-[#C62828] transition-colors duration-200 hover:bg-[#C62828] hover:text-white"
      >
        View Pending Orders
        <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
      </Link>
    </section>
  );
}

/* ---------------------------- Edit bank modal ------------------------------ */

function EditBankModal({
  account,
  onClose,
  onSave,
}: {
  account: BankAccount;
  onClose: () => void;
  onSave: (next: BankAccount) => void;
}) {
  const [form, setForm] = useState(account);
  const set = (patch: Partial<BankAccount>) => setForm((f) => ({ ...f, ...patch }));

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave(form);
  };

  const fields: { id: keyof BankAccount; label: string; placeholder: string }[] = [
    { id: "holder", label: "Account Holder", placeholder: "Account holder name" },
    { id: "bank", label: "Bank Name", placeholder: "Your bank" },
    { id: "number", label: "Account Number", placeholder: "XXXX XXXX 1234" },
    { id: "ifsc", label: "IFSC Code", placeholder: "SBIN0001234" },
  ];

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/45 p-5 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-label="Edit bank account details"
      onClick={onClose}
    >
      <form
        onSubmit={submit}
        className="animate-pop-in w-full max-w-[440px] rounded-3xl bg-white p-6 shadow-2xl sm:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-[18px] font-bold text-[#111111]">Edit Bank Details</h2>
            <p className="mt-1 text-[12.5px] text-[#666666]">Update your settlement account (demo).</p>
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

        <div className="mt-5 flex flex-col gap-4">
          {fields.map((field) => (
            <div key={field.id}>
              <label htmlFor={`bank-${field.id}`} className="mb-1.5 block text-[12px] font-semibold text-[#111111]">
                {field.label}
              </label>
              <input
                id={`bank-${field.id}`}
                value={String(form[field.id])}
                onChange={(e) => set({ [field.id]: e.target.value } as Partial<BankAccount>)}
                placeholder={field.placeholder}
                className={inputCls}
              />
            </div>
          ))}
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-[46px] flex-1 items-center justify-center rounded-xl border-[1.5px] border-[#D8DED8] bg-white text-[13.5px] font-semibold text-[#444444] transition-colors hover:border-[#2E7D32]/50 hover:text-[#2E7D32]"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex h-[46px] flex-1 items-center justify-center rounded-xl bg-[#2E7D32] text-[13.5px] font-semibold text-white transition-colors hover:bg-[#256628]"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

/* ----------------------------- Bank card ----------------------------------- */

export function BankAccountCard({ onSaved }: { onSaved: () => void }) {
  const [account, setAccount] = useState<BankAccount>(BANK_ACCOUNT);
  const [editing, setEditing] = useState(false);

  const rows: [string, string][] = [
    ["Account Holder", account.holder],
    ["Bank Name", account.bank],
    ["Account Number", account.number],
    ["IFSC Code", account.ifsc],
  ];

  return (
    <section className="rounded-2xl border border-[#E1E5E1] bg-white p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid h-[42px] w-[42px] place-items-center rounded-2xl bg-[#EAF6EA] text-[#2E7D32]">
            <Landmark className="h-[20px] w-[20px]" strokeWidth={2} />
          </span>
          <h2 className="font-display text-[16px] leading-tight font-semibold text-[#111111]">
            Bank Account Details
          </h2>
        </div>
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-[#2E7D32] transition-colors hover:text-[#155B32]"
        >
          <Pencil className="h-3.5 w-3.5" />
          Edit
        </button>
      </div>

      <dl className="mt-5 flex flex-col gap-3">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-baseline justify-between gap-3 border-b border-[#F0F3F0] pb-2.5 last:border-0">
            <dt className="text-[12px] font-medium text-[#777777]">{label}</dt>
            <dd className="text-right text-[12.5px] font-semibold text-[#111111]">{value}</dd>
          </div>
        ))}
      </dl>

      {account.verified && (
        <p className="mt-4 flex items-center gap-2 rounded-xl bg-[#EAF6EA] px-3.5 py-2.5 text-[12px] font-semibold text-[#2E7D32]">
          <BadgeCheck className="h-4 w-4" strokeWidth={2.2} />
          Verified Account
        </p>
      )}

      {editing && (
        <EditBankModal
          account={account}
          onClose={() => setEditing(false)}
          onSave={(next) => {
            setAccount(next);
            setEditing(false);
            onSaved();
          }}
        />
      )}
    </section>
  );
}

/* -------------------------------- Tip card --------------------------------- */

export function TipCard() {
  return (
    <section className="rounded-2xl border border-[#D8E4F0] bg-[#F3F8FD] p-5 sm:p-6">
      <span className="grid h-[42px] w-[42px] place-items-center rounded-2xl bg-[#DCEAF7] text-[#1D6FB8]">
        <Lightbulb className="h-[21px] w-[21px]" strokeWidth={2} />
      </span>
      <h2 className="mt-4 font-display text-[16px] font-semibold text-[#111111]">Tip</h2>
      <p className="mt-1.5 text-[12.5px] leading-relaxed text-[#3D4E63]">
        Sell more during high price periods to increase your earnings. Check{" "}
        <Link to="/dashboard/market-prices" className="inline-flex items-center gap-0.5 font-semibold text-[#2E7D32] transition-colors hover:text-[#155B32]">
          Market Prices
          <ArrowRight className="inline h-3.5 w-3.5" strokeWidth={2.4} />
        </Link>
      </p>
    </section>
  );
}
