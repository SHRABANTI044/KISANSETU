import { ArrowRight, Sprout, Store } from "lucide-react";
import { cn } from "../utils/cn";

type Role = "farmer" | "buyer";

const ROLE_CONFIG: Record<
  Role,
  {
    icon: typeof Sprout;
    title: string;
    desc: string;
    button: string;
    circleClass: string;
    buttonClass: string;
  }
> = {
  farmer: {
    icon: Sprout,
    title: "Login as Farmer",
    desc: "Access your farmer dashboard,\nadd produce, check prices,\nand manage your sales.",
    button: "Farmer Login",
    circleClass: "bg-[#EAF6EA] text-[#2E7D32]",
    buttonClass: "bg-[#2E7D32] hover:bg-[#256628] shadow-[0_12px_24px_-10px_rgba(46,125,50,0.55)]",
  },
  buyer: {
    icon: Store,
    title: "Login as Buyer",
    desc: "Post requirements, find quality\nproduce, connect with farmers,\nand manage orders.",
    button: "Buyer Login",
    circleClass: "bg-[#E8F1FC] text-[#1976D2]",
    buttonClass: "bg-[#1976D2] hover:bg-[#1560AE] shadow-[0_12px_24px_-10px_rgba(25,118,210,0.5)]",
  },
};

/**
 * Role selection card (Farmer = green / Buyer = blue, as in the reference).
 * Selecting a role opens the matching login form on the same page.
 */
export default function LoginRoleCard({ role, onSelect }: { role: Role; onSelect: () => void }) {
  const cfg = ROLE_CONFIG[role];

  return (
    <article className="flex flex-col items-center rounded-[22px] border border-[#E1E5E1] bg-white p-6 text-center shadow-[0_12px_34px_-16px_rgba(17,17,17,0.14)] transition-shadow duration-300 hover:shadow-[0_18px_44px_-16px_rgba(17,17,17,0.18)] sm:p-7">
      <span className={cn("grid h-[68px] w-[68px] place-items-center rounded-full", cfg.circleClass)}>
        <cfg.icon className="h-[30px] w-[30px]" strokeWidth={1.9} />
      </span>

      <h3 className="mt-5 font-display text-[17.5px] font-semibold text-[#111111]">{cfg.title}</h3>
      <p className="mt-2 flex-1 whitespace-pre-line text-[13px] leading-relaxed text-[#666666]">
        {cfg.desc}
      </p>

      <button
        type="button"
        onClick={onSelect}
        className={cn(
          "mt-6 inline-flex h-[46px] w-full items-center justify-center gap-2 rounded-xl text-[14.5px] font-semibold text-white transition-all duration-200 active:scale-[0.99]",
          cfg.buttonClass
        )}
      >
        {cfg.button}
        <ArrowRight className="h-[17px] w-[17px]" strokeWidth={2.4} />
      </button>
    </article>
  );
}
