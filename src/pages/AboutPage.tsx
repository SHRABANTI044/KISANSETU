import AboutSection from "../components/AboutSection";
import SectionHeading from "../components/SectionHeading";
import Reveal from "../components/Reveal";

export default function AboutPage() {
  return (
    <div>
      <section className="border-b border-ks-border/70 bg-ks-bg">
        <div className="ks-container pt-[150px] pb-14">
          <Reveal>
            <SectionHeading
              eyebrow="About KisanSetu"
              title="A Bridge Between the Farm and the Market"
              description="Why we exist, what we are building, and the principles behind the platform."
            />
          </Reveal>
        </div>
      </section>
      <AboutSection />
    </div>
  );
}
