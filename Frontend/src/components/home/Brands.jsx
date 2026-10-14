import { motion, useReducedMotion } from "motion/react";
import RevealHeading from "@/components/common/RevealHeading";
import { brands } from "@/data/home";
import { fadeUp, inView, stagger } from "@/lib/motion";

const marks = {
  Ferrari: "font-display text-[0.7rem] tracking-widest text-brand",
  BMW: "font-logo text-lg font-bold",
  Lamborghini: "font-display text-[0.55rem] tracking-wider text-ink",
  Audi: "font-logo text-lg font-bold",
  Ford: "font-logo text-xl font-bold text-ink italic",
};

export default function Brands() {
  const reduced = useReducedMotion();
  return (
    <section className="@container text-center">
      <RevealHeading className="mx-auto text-[max(1rem,2cqw)] font-normal">{brands.title}</RevealHeading>
      <motion.ul variants={reduced ? undefined : stagger} initial={reduced ? false : "hidden"} whileInView="visible" viewport={inView} className="mt-[max(2rem,5cqw)] flex flex-wrap items-center justify-center">
        {brands.items.map((b) => (
          <motion.li variants={reduced ? undefined : fadeUp} key={b} className="-ml-1 grid size-[max(5rem,11cqw)] place-items-center rounded-full border border-white bg-mist first:ml-0">
            <span className={marks[b]}>{b}</span>
          </motion.li>
        ))}
        <motion.li variants={reduced ? undefined : fadeUp} className="-ml-1 grid size-[max(5rem,11cqw)] place-items-center rounded-full border border-white bg-mist">
          <span>
            <span className="block font-display text-base">{brands.more.value}</span>
            <span className="block text-[0.6rem] text-muted-foreground uppercase">{brands.more.label}</span>
          </span>
        </motion.li>
      </motion.ul>
    </section>
  );
}
