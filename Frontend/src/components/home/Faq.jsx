import { Link } from "react-router-dom";
import { Minus, Plus } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Avatars from "@/components/common/Avatars";
import SectionTag from "@/components/common/SectionTag";
import SlantButton from "@/components/common/SlantButton";
import RevealHeading from "@/components/common/RevealHeading";
import { faq } from "@/data/home";
import { site } from "@/data/site";
import { fadeUp, inView } from "@/lib/motion";

export default function Faq() {
  const reduced = useReducedMotion();
  return (
    <section id="test-drive" className="mx-auto w-full max-w-[40rem] @container text-center">
      <SectionTag>{faq.tag}</SectionTag>
      <RevealHeading className="mt-4 text-[max(1.5rem,4cqw)]">{faq.title}</RevealHeading>
      <p className="mt-3 text-xs text-muted-foreground uppercase">{faq.text}</p>

      <motion.div variants={reduced ? undefined : fadeUp} initial={reduced ? false : "hidden"} whileInView="visible" viewport={inView}>
      <Accordion type="single" collapsible defaultValue={faq.defaultOpen} className="mt-9 space-y-3 text-left">
        {faq.items.map((item, i) => (
          <AccordionItem
            key={item.q}
            value={`item-${i}`}
            className="rounded-2xl border bg-white px-5 py-4 transition-colors data-[state=open]:border-transparent data-[state=open]:bg-mist data-[state=open]:shadow-[0_2px_10px_rgba(0,0,0,0.05)]"
          >
            <AccordionTrigger
              indicator={
                <span className="grid size-8 shrink-0 place-items-center rounded-full border border-ink group-data-[state=open]:border-brand group-data-[state=open]:bg-brand group-data-[state=open]:text-white">
                  <Plus className="size-3.5 group-data-[state=open]:hidden" />
                  <Minus className="hidden size-3.5 group-data-[state=open]:block" />
                </span>
              }
            >
              <span className="font-display text-[0.7rem] uppercase sm:text-xs">{item.q}</span>
            </AccordionTrigger>
            <AccordionContent className="max-w-sm pt-4 text-[0.65rem]/relaxed uppercase">{item.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      </motion.div>

      <motion.div variants={reduced ? undefined : fadeUp} initial={reduced ? false : "hidden"} whileInView="visible" viewport={inView} className="relative mt-14 overflow-hidden rounded-2xl bg-mist p-5 pb-20 text-left sm:pb-5">
        <div className="flex items-center gap-3">
          <Avatars initials={["AK", "MR", "JS"]} size="size-8" ring="ring-mist" />
          <h3 className="font-display text-lg">{faq.help.title}</h3>
        </div>
        <p className="mt-5 max-w-[20rem] text-[0.65rem]/relaxed uppercase">{faq.help.text}</p>
        <a href={`mailto:${site.email}`} className="mt-7 block text-[0.65rem] font-medium text-brand uppercase">
          {site.email} —
        </a>
        <div className="absolute right-0 bottom-0 rounded-tl-2xl bg-white p-3 pr-0">
          <SlantButton as={Link} to="/#test-drive" look="outline-light" accent="dark" className="h-8 sm:h-9">
            Contact us
          </SlantButton>
        </div>
      </motion.div>
    </section>
  );
}
