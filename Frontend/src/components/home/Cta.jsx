import SlantButton from "@/components/common/SlantButton";
import RevealHeading from "@/components/common/RevealHeading";
import { motion, useReducedMotion } from "motion/react";
import { cta, img } from "@/data/home";
import { site } from "@/data/site";
import { fadeUp, inView, wipe } from "@/lib/motion";

function SpinningBadge() {
  return (
    <svg viewBox="0 0 100 100" className="size-full motion-safe:animate-[spin-slow_24s_linear_infinite]" aria-hidden>
      <defs>
        <path id="circle" d="M50,50 m-36,0 a36,36 0 1,1 72,0 a36,36 0 1,1 -72,0" />
      </defs>
      <text className="fill-ink font-display text-[6.6px]" letterSpacing="2.2">
        <textPath href="#circle">{`${site.name} • Drive your dream today • `}</textPath>
      </text>
    </svg>
  );
}

export default function Cta() {
  const reduced = useReducedMotion();
  return (
    <section id="cta" className="relative @container min-h-[34rem] overflow-hidden rounded-[2rem] bg-ink text-white md:aspect-[871/440] md:min-h-0 md:rounded-[2.5rem]">
      <motion.img variants={reduced ? undefined : wipe} initial={reduced ? false : "hidden"} whileInView="visible" viewport={inView} src={img.cta} alt="A sports car in a dark showroom" loading="lazy" className="absolute inset-0 size-full object-cover object-[40%_80%]" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-black/10" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/50" />

      <RevealHeading className="relative z-10 px-6 pt-10 text-[max(1.8rem,4.4cqw)] font-normal sm:px-10 md:absolute md:top-[9%] md:left-[7.5%] md:p-0">
        {cta.title}
      </RevealHeading>

      <motion.div variants={reduced ? undefined : fadeUp} initial={reduced ? false : "hidden"} whileInView="visible" viewport={inView} className="absolute inset-x-6 bottom-8 z-10 sm:inset-x-10 md:inset-x-auto md:right-[10%] md:bottom-[24%] md:w-[25rem]">
        <p className="max-w-sm text-xs/relaxed uppercase">{cta.text}</p>
        <SlantButton className="mt-6" accent="red">
          Gets started
        </SlantButton>
      </motion.div>

      <div className="absolute top-0 right-0 hidden size-36 rounded-bl-[2.5rem] bg-white p-5 lg:block">
        <SpinningBadge />
      </div>
    </section>
  );
}
