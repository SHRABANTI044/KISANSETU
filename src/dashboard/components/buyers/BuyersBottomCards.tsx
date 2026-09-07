import { Link } from "react-router-dom";
import { FileText, Leaf, MessageCircle, Plus, ShieldCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface ActionCardDef {
  icon: LucideIcon;
  title: string;
  desc: string;
  iconBox: string;
}

const STATIC_CARDS: ActionCardDef[] = [
  {
    icon: MessageCircle,
    title: "Chat with Buyers",
    desc: "Discuss price, quantity, and delivery directly.",
    iconBox: "bg-[#DCEAF7] text-[#1D6FB8]",
  },
  {
    icon: FileText,
    title: "Compare Offers",
    desc: "Check multiple offers and choose the best deal.",
    iconBox: "bg-violet-100 text-violet-700",
  },
  {
    icon: ShieldCheck,
    title: "Verified & Trusted",
    desc: "All buyers are verified for safe and transparent trade.",
    iconBox: "bg-[#EAF6EA] text-[#2E7D32]",
  },
];

export default function BuyersBottomCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {STATIC_CARDS.map((card) => (
        <article
          key={card.title}
          className="rounded-2xl border border-[#E1E5E1] bg-white p-5 shadow-[0_10px_30px_-18px_rgba(17,17,17,0.12)] transition-shadow duration-300 hover:shadow-[0_16px_40px_-18px_rgba(17,17,17,0.18)]"
        >
          <span className={`grid h-[42px] w-[42px] place-items-center rounded-2xl ${card.iconBox}`}>
            <card.icon className="h-[21px] w-[21px]" strokeWidth={2} />
          </span>
          <h3 className="mt-4 font-display text-[15px] font-semibold text-[#111111]">{card.title}</h3>
          <p className="mt-1.5 text-[12px] leading-relaxed text-[#666666]">{card.desc}</p>
        </article>
      ))}

      {/* Highlighted "Get More Buyers" card */}
      <article className="rounded-2xl border border-[#BFE3C5] bg-[#F0FAF1] p-5 shadow-[0_10px_30px_-18px_rgba(46,125,50,0.25)]">
        <span className="grid h-[42px] w-[42px] place-items-center rounded-2xl bg-[#2E7D32] text-white">
          <Leaf className="h-[21px] w-[21px]" strokeWidth={2} />
        </span>
        <h3 className="mt-4 font-display text-[15px] font-semibold text-[#155B32]">Get More Buyers</h3>
        <p className="mt-1.5 text-[12px] leading-relaxed text-[#3E5B47]">
          Keep your crop lots updated with quality details to attract more buyers.
        </p>
        <Link
          to="/dashboard/crop-lots"
          className="mt-4 inline-flex h-[40px] w-full items-center justify-center gap-2 rounded-xl bg-[#2E7D32] text-[12.5px] font-semibold text-white shadow-[0_10px_22px_-10px_rgba(46,125,50,0.55)] transition-all duration-200 hover:bg-[#256628]"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          Add Crop Lot
        </Link>
      </article>
    </div>
  );
}
