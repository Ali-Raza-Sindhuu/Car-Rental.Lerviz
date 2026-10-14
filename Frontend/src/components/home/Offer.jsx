import { CreditCard, Headset, ReceiptText, ShieldCheck } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import SectionTag from "@/components/common/SectionTag";
import RevealHeading from "@/components/common/RevealHeading";
import { Card } from "@/components/ui/card";
import { img, offer } from "@/data/home";
import { cn } from "@/lib/utils";
import { fadeUp, inView, stagger, wipe } from "@/lib/motion";

const icons = { receipt: ReceiptText, shield: ShieldCheck, headset: Headset, card: CreditCard };

function FeatureCard({ feature, className }) {
  const Icon = icons[feature.icon];
  return (
    <Card className={cn("relative flex min-h-[max(12rem,21cqw)] flex-col justify-between p-[max(1rem,2cqw)] pt-[max(1.5rem,3cqw)]", className)}>
      <span className="absolute -top-2 -left-2 grid size-[max(3rem,6cqw)] place-items-center rounded-full bg-ink text-white ring-[max(.4rem,1cqw)] ring-mist">
        <Icon className="size-5" strokeWidth={1.5} />
      </span>
      <h3 className="ml-auto max-w-[8.5rem] font-display text-xs leading-snug">{feature.title}</h3>
      <p className="max-w-[12rem] text-[0.65rem]/relaxed uppercase">{feature.text}</p>
    </Card>
  );
}

export default function Offer() {
  const reduced = useReducedMotion();
  const [a, b, c, d] = offer.features;
  return (
    <section className="grid @container gap-[max(2rem,5cqw)] md:grid-cols-[52%_1fr]">
      {/* Feature cards: two staggered columns on a soft panel */}
      <motion.div variants={reduced ? undefined : stagger} initial={reduced ? false : "hidden"} whileInView="visible" viewport={inView}>
        <div className="grid gap-4 rounded-[var(--radius-xl)] bg-mist p-[max(1rem,2cqw)] pt-[max(1.5rem,3cqw)] sm:grid-cols-2">
          <div className="space-y-4 sm:space-y-6">
            <motion.div variants={reduced ? undefined : fadeUp}><FeatureCard feature={a} /></motion.div>
            <motion.div variants={reduced ? undefined : fadeUp}><FeatureCard feature={c} /></motion.div>
          </div>
          <div className="space-y-4 sm:mt-24 sm:space-y-6">
            <motion.div variants={reduced ? undefined : fadeUp}><FeatureCard feature={b} /></motion.div>
            <motion.div variants={reduced ? undefined : fadeUp}><FeatureCard feature={d} /></motion.div>
          </div>
        </div>
      </motion.div>

      {/* Copy and car with call-outs */}
      <div className="min-w-0">
        <SectionTag>{offer.tag}</SectionTag>
        <RevealHeading className="mt-[max(1rem,2cqw)] text-[max(1.4rem,2.8cqw)]">{offer.title}</RevealHeading>
        <p className="mt-4 max-w-sm text-xs/relaxed text-muted-foreground uppercase">{offer.text}</p>

        <motion.div variants={reduced ? undefined : wipe} initial={reduced ? false : "hidden"} whileInView="visible" viewport={inView} className="relative mx-auto mt-10 aspect-[3/4] max-w-[22rem] md:max-w-none">
          <div className="absolute inset-x-[16%] inset-y-0 overflow-hidden rounded-[2rem]">
            <img src={img.offerCar} alt="White supercar" loading="lazy" className="size-full object-cover object-[60%_85%]" />
          </div>
          {offer.callouts.map((c) => (
            <div key={c.label} className={cn("absolute z-10 rounded-xl bg-card px-4 py-2 shadow-lg", c.pos)}>
              <p className={cn("font-display text-sm", c.red && "text-brand")}>{c.value}</p>
              <p className="text-[0.65rem] text-muted-foreground">{c.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
