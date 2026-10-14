import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { Quote, Star } from "lucide-react";
import ArrowPair from "@/components/common/ArrowPair";
import SectionTag from "@/components/common/SectionTag";
import RevealHeading from "@/components/common/RevealHeading";
import { testimonials } from "@/data/home";
import { cn } from "@/lib/utils";
import { fadeUp, inView, stagger } from "@/lib/motion";

function CountUp({ value }) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, margin: "-10%" });
  const reduced = useReducedMotion();
  const [number, setNumber] = useState(reduced ? parseInt(value, 10) : 0);
  useEffect(() => {
    if (!seen) return;
    const target = parseInt(value, 10);
    if (reduced) { setNumber(target); return; }
    let frame;
    const start = performance.now();
    const tick = (time) => {
      const progress = Math.min((time - start) / 1000, 1);
      setNumber(Math.round(target * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [seen, value, reduced]);
  return <span ref={ref}>{number}{value.replace(/[\d,]/g, "")}</span>;
}

function Stars() {
  return (
    <span className="flex gap-0.5" aria-hidden>
      {[0, 1, 2, 3, 4].map((i) => (
        <Star key={i} className={cn("size-3", i < 4 ? "fill-star text-star" : "fill-white text-white")} />
      ))}
    </span>
  );
}

export default function Testimonials() {
  const rail = useRef(null);
  const reduced = useReducedMotion();
  const scroll = (dir) => {
    const el = rail.current;
    if (el) el.scrollBy({ left: dir * (el.firstElementChild?.clientWidth ?? 300), behavior: "smooth" });
  };

  return (
    <section className="mesh-dark @container overflow-hidden rounded-[2rem] p-[max(1.5rem,5cqw)] text-white md:rounded-[2.5rem]">
      <div className="flex items-start justify-between gap-6">
        <div>
          <SectionTag className="text-white/70">{testimonials.tag}</SectionTag>
          <RevealHeading className="mt-6 text-[max(1.3rem,2.8cqw)] font-normal">{testimonials.title}</RevealHeading>
          <p className="mt-4 text-xs text-white/80 uppercase">{testimonials.text}</p>
        </div>
        <ArrowPair onPrev={() => scroll(-1)} onNext={() => scroll(1)} className="mt-2 shrink-0" />
      </div>

      <motion.div ref={rail} onPan={(_, info) => { if (rail.current) rail.current.scrollLeft -= info.delta.x; }} variants={reduced ? undefined : stagger} initial={reduced ? false : "hidden"} whileInView="visible" viewport={inView} className="-mr-6 mt-10 flex snap-x touch-pan-y gap-5 overflow-x-auto pr-6 [scrollbar-width:none] sm:-mr-10 sm:pr-10 md:-mr-12 md:pr-12 [&::-webkit-scrollbar]:hidden">
        {testimonials.items.map((t) => (
          <motion.article variants={reduced ? undefined : fadeUp} key={t.name} className="relative w-[82%] shrink-0 snap-start sm:w-[44%] md:w-[41%]">
            <div className="h-14 pl-0.5">
              <p className="font-display text-sm">{t.name}</p>
              <p className="mt-1 text-[0.6rem] text-white/60 uppercase">{t.role}</p>
            </div>
            <div className="relative -mt-3 aspect-[1.35] overflow-hidden rounded-2xl bg-panel">
              {t.image && <img src={t.image} alt="" loading="lazy" className="absolute inset-0 size-full object-cover" />}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              <div className="absolute inset-x-5 bottom-5 sm:right-16">
                <p className="text-sm/snug uppercase">{t.text}</p>
                <p className="mt-4 flex items-center gap-2 text-xs">
                  <Stars /> {t.rating}
                </p>
              </div>
              <Quote className="absolute right-3 bottom-3 size-9 fill-white" strokeWidth={0} aria-hidden />
            </div>
          </motion.article>
        ))}
      </motion.div>

      <dl className="mt-14 grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
        {testimonials.stats.map((s, i) => (
          <div key={i}>
            <dt className="font-display text-[max(2rem,4cqw)] leading-none font-normal"><CountUp value={s.value} /></dt>
            <dd className="mt-3 text-[0.65rem] text-white/80 uppercase">{s.label}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
