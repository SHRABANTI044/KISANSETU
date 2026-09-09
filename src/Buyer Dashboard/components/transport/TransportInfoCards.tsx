import { Headphones, Link2, ShieldCheck, TrendingUp } from "lucide-react";

/** Bottom three information cards (reliability / tracking / support). */
export default function TransportInfoCards() {
  const cards = [
    {
      icon: ShieldCheck,
      iconCls: "bg-[#EAF6EA] text-[#2E7D32]",
      title: "Reliable & On-Time Delivery",
      desc: "Partner with verified and trusted transporters.",
      action: null as null | { label: string; href: string },
    },
    {
      icon: TrendingUp,
      iconCls: "bg-sky-100 text-sky-700",
      title: "Real-Time Tracking",
      desc: "Track your shipments at every step.",
      action: { label: "View Shipments", href: "/buyer/orders-tracking" },
    },
    {
      icon: Headphones,
      iconCls: "bg-violet-100 text-violet-700",
      title: "Need Help?",
      desc: "Contact our logistics support team.",
      action: { label: "Contact Support", href: "/buyer/help-support" },
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {cards.map((c) => (
        <div
          key={c.title}
          className="flex flex-col rounded-2xl border border-[#E4EDE4] bg-white p-5 shadow-[0_10px_24px_-16px_rgba(17,17,17,0.18)]"
        >
          <span className={`grid h-10 w-10 place-items-center rounded-xl ${c.iconCls}`}>
            <c.icon className="h-5 w-5" strokeWidth={2} />
          </span>
          <h4 className="mt-3 font-display text-[14.5px] font-bold text-[#111111]">{c.title}</h4>
          <p className="mt-1 flex-1 text-[12.5px] leading-relaxed text-[#666666]">{c.desc}</p>
          {c.action ? (
            <a
              href={c.action.href}
              className="mt-3 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-[#2E7D32] hover:underline"
            >
              {c.action.label}
              <Link2 className="h-3.5 w-3.5" strokeWidth={2.2} />
            </a>
          ) : (
            <a href="/buyer/help-support" className="mt-3 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-[#2E7D32] hover:underline">
              Learn more
              <Link2 className="h-3.5 w-3.5" strokeWidth={2.2} />
            </a>
          )}
        </div>
      ))}
    </div>
  );
}
