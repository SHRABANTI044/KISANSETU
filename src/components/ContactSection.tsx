import { useState } from "react";
import type { FormEvent } from "react";
import { CircleCheck, Mail, MapPin, Phone, Send } from "lucide-react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

/** Placeholder contact details until real ones are configured. */
const CONTACT_ITEMS = [
  { icon: Mail, label: "Email", value: "support@kisansetu.example" },
  { icon: Phone, label: "Phone", value: "+91 XXXXX XXXXX" },
  { icon: MapPin, label: "Location", value: "India" },
];

const inputClasses =
  "h-[50px] w-full rounded-xl border border-ks-border bg-ks-bg px-4 text-[14.5px] text-ks-text transition-colors outline-none placeholder:text-ks-muted/60 focus:border-ks-green focus:bg-white";

export default function ContactSection() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.currentTarget.reset();
    setSent(true);
  };

  return (
    <section id="contact" aria-label="Contact KisanSetu" className="bg-ks-bg py-20 sm:py-24">
      <div className="ks-container grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        {/* Info */}
        <Reveal>
          <SectionHeading
            align="left"
            eyebrow="Contact"
            title="Get in Touch"
            description="Have a question about KisanSetu? We'd love to hear from you."
          />

          <ul className="mt-8 flex flex-col gap-4">
            {CONTACT_ITEMS.map((item) => (
              <li key={item.label} className="flex items-center gap-4">
                <span className="grid h-[48px] w-[48px] shrink-0 place-items-center rounded-full bg-white text-ks-green ring-1 ring-ks-border">
                  <item.icon className="h-[20px] w-[20px]" strokeWidth={2} />
                </span>
                <div>
                  <p className="text-[12px] font-medium text-ks-muted">{item.label}</p>
                  <p className="text-[15px] font-semibold text-ks-dark">{item.value}</p>
                </div>
              </li>
            ))}
          </ul>

          <p className="mt-7 inline-flex rounded-xl border border-dashed border-ks-green/35 bg-ks-light/60 px-4 py-2.5 text-[12px] leading-relaxed text-ks-dark/75">
            Placeholder details — real contact information will be configured soon.
          </p>
        </Reveal>

        {/* Form (frontend only) */}
        <Reveal delay={130}>
          <form
            onSubmit={handleSubmit}
            className="rounded-[26px] border border-ks-border bg-white p-6 shadow-card sm:p-8"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="contact-name" className="mb-1.5 block text-[13px] font-semibold text-ks-text">
                  Name
                </label>
                <input id="contact-name" name="name" type="text" required placeholder="Your full name" className={inputClasses} />
              </div>
              <div>
                <label htmlFor="contact-email" className="mb-1.5 block text-[13px] font-semibold text-ks-text">
                  Email
                </label>
                <input id="contact-email" name="email" type="email" required placeholder="you@example.com" className={inputClasses} />
              </div>
            </div>

            <div className="mt-5">
              <label htmlFor="contact-message" className="mb-1.5 block text-[13px] font-semibold text-ks-text">
                Message
              </label>
              <textarea
                id="contact-message"
                name="message"
                required
                rows={5}
                placeholder="How can we help you?"
                className="w-full resize-none rounded-xl border border-ks-border bg-ks-bg px-4 py-3.5 text-[14.5px] text-ks-text transition-colors outline-none placeholder:text-ks-muted/60 focus:border-ks-green focus:bg-white"
              />
            </div>

            <button
              type="submit"
              className="group mt-6 inline-flex h-[52px] items-center justify-center gap-2.5 rounded-full bg-ks-green px-9 text-[15px] font-semibold text-white shadow-[0_12px_26px_-12px_rgba(22,128,60,0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-ks-dark active:translate-y-0"
            >
              Send Message
              <Send className="h-[16px] w-[16px] transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5" strokeWidth={2.3} />
            </button>

            {sent && (
              <p
                role="status"
                className="animate-pop-in mt-4 flex items-center gap-2.5 rounded-xl border border-ks-green/30 bg-ks-light px-4 py-3 text-[13.5px] font-medium text-ks-dark"
              >
                <CircleCheck className="h-[18px] w-[18px] shrink-0 text-ks-green" strokeWidth={2.2} />
                Thank you! Your message has been received.
              </p>
            )}

            <p className="mt-4 text-[11.5px] text-ks-muted/75">
              Frontend demo — messages are not stored or emailed yet.
            </p>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
