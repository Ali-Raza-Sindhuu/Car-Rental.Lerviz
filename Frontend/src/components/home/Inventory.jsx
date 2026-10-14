import { ChevronDown, ChevronUp, ChevronsRight, Globe } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import SlantButton from "@/components/common/SlantButton";
import Avatars from "@/components/common/Avatars";
import SectionTag from "@/components/common/SectionTag";
import RevealHeading from "@/components/common/RevealHeading";
import { customers, inventory } from "@/data/home";
import { fadeUp, inView, stagger } from "@/lib/motion";

export default function Inventory() {
  const reduced = useReducedMotion();
  return (
    <section id="model" className="mesh-dark relative @container overflow-hidden rounded-[2rem] text-white md:rounded-[2.5rem]">
      <div className="grid gap-[max(2rem,4cqw)] p-[max(1.5rem,5cqw)] md:grid-cols-[38%_1fr]">
        {/* Left column */}
        <div className="flex flex-col justify-between">
          <div>
            <SectionTag className="text-white/70">{inventory.tag}</SectionTag>
            <RevealHeading className="mt-[max(1.25rem,2cqw)] text-[max(1.6rem,3.4cqw)] font-normal">{inventory.title}</RevealHeading>
            <motion.p variants={reduced ? undefined : fadeUp} initial={reduced ? false : "hidden"} whileInView="visible" viewport={inView} className="mt-5 max-w-[16rem] text-xs/relaxed text-white/80 uppercase">{inventory.text}</motion.p>
            <SlantButton className="mt-6" accent="red">
              Browse more
            </SlantButton>
          </div>

          <div className="mt-10 hidden space-y-2 md:block">
            <Globe className="size-10 text-white" strokeWidth={1.1} />
            <p className="text-xs text-white/80 uppercase">{customers.label}</p>
            <div className="flex items-center gap-2">
              <span className="font-display text-xl">{customers.count}</span>
              <Avatars initials={customers.initials} ring="ring-black" />
            </div>
          </div>
        </div>

        {/* Accordion list */}
        <motion.div variants={reduced ? undefined : stagger} initial={reduced ? false : "hidden"} whileInView="visible" viewport={inView} className="min-w-0">
        <Accordion type="single" collapsible defaultValue={inventory.defaultOpen}>
          {inventory.items.map((car) => (
            <AccordionItem key={car.id} value={car.id} className="border-b border-white/15 py-4 first:pt-0 last:border-0">
              <AccordionTrigger
                className="group/trigger"
                indicator={
                  <>
                    <ChevronDown className="size-5 shrink-0 group-data-[state=open]:hidden" strokeWidth={1.25} />
                    <ChevronUp className="hidden size-5 shrink-0 group-data-[state=open]:block" strokeWidth={1.25} />
                  </>
                }
              >
                <span className="flex min-w-0 flex-1 items-center gap-5">
                  <span className="size-[4.75rem] shrink-0 overflow-hidden rounded-lg group-data-[state=open]:hidden">
                    <img src={car.image} alt="" loading="lazy" className="size-full object-cover" />
                  </span>
                  <span className="font-display text-sm sm:text-base group-data-[state=open]:hidden">
                    {car.id} – {car.name}
                  </span>
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="relative mt-1 pl-0 sm:pl-6">
                  <span className="absolute top-0 left-0 z-10 hidden size-10 place-items-center rounded-full bg-white text-ink sm:grid">
                    <ChevronsRight className="size-4" />
                  </span>
                  <div className="ml-0 aspect-[371/190] overflow-hidden rounded-[1.5rem] rounded-tl-none sm:ml-6">
                    <img src={car.image} alt={car.name} loading="lazy" className="size-full object-cover object-[50%_60%]" />
                  </div>
                  <h3 className="mt-5 font-display text-base sm:ml-6">
                    {car.id} – {car.name}
                  </h3>
                  <p className="mt-3 max-w-xs text-xs/relaxed text-white/80 uppercase sm:ml-6">{car.text}</p>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
