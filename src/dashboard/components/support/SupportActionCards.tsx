import { SUPPORT_ACTION_CARDS } from "../../data/support";
import { cn } from "../../../utils/cn";

export default function SupportActionCards({ onAction }: { onAction: (key: "chat" | "ticket" | "call" | "videos") => void }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {SUPPORT_ACTION_CARDS.map((card) => {
        const content =
          card.key === "call" ? (
            <a
              href="tel:18001235757"
              className={cn("mt-5 inline-flex h-[42px] w-full items-center justify-center rounded-xl text-[13px] font-semibold transition-colors", card.buttonClass)}
            >
              {card.cta}
            </a>
          ) : (
            <button
              type="button"
              onClick={() => onAction(card.key)}
              className={cn("mt-5 inline-flex h-[42px] w-full items-center justify-center rounded-xl text-[13px] font-semibold transition-colors", card.buttonClass)}
            >
              {card.cta}
            </button>
          );

        return (
          <article
            key={card.key}
            className={cn("flex flex-col rounded-2xl border p-5 transition-shadow duration-300 hover:shadow-[0_16px_40px_-20px_rgba(17,17,17,0.2)]", card.cardClass)}
          >
            <span className={cn("grid h-[46px] w-[46px] place-items-center rounded-2xl", card.iconClass)}>
              <card.icon className="h-[22px] w-[22px]" strokeWidth={2} />
            </span>
            <h3 className="mt-4 font-display text-[15px] font-semibold text-[#111111]">{card.title}</h3>
            <p className="mt-1 flex-1 text-[12px] text-[#666666]">{card.subtitle}</p>
            {content}
          </article>
        );
      })}
    </div>
  );
}
