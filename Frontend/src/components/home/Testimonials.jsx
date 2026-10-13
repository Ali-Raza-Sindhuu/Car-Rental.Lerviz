import { useRef } from "react";
import { Quote, Star } from "lucide-react";
import ArrowPair from "@/components/common/ArrowPair";
import SectionTag from "@/components/common/SectionTag";
import Heading from "@/components/common/Heading";
import { testimonials } from "@/data/home";
import { cn } from "@/lib/utils";

function Stars() {
  return (
    <span className="flex gap-0.5" aria-hidden>
      {[0, 1, 2, 3, 4].map((i) => (
        <Star key={i} className={cn("size-3", i < 4 ? "fill-yellow-300 text-yellow-300" : "fill-white text-white")} />
      ))}
    </span>
  );
}

export default function Testimonials() {
  const rail = useRef(null);
  const scroll = (dir) => {
    const el = rail.current;
    if (el) el.scrollBy({ left: dir * (el.firstElementChild?.clientWidth ?? 300), behavior: "smooth" });
  };

  return (
    <section className="mesh-dark overflow-hidden rounded-[2rem] p-6 text-white sm:p-10 lg:rounded-[2.5rem] lg:px-12 lg:py-14">
      <div className="flex items-start justify-between gap-6">
        <div>
          <SectionTag className="text-white/70">{testimonials.tag}</SectionTag>
          <Heading className="mt-6 text-[clamp(1.3rem,2.7vw,2.2rem)] font-normal">{testimonials.title}</Heading>
          <p className="mt-4 text-xs text-white/80 uppercase">{testimonials.text}</p>
        </div>
        <ArrowPair onPrev={() => scroll(-1)} onNext={() => scroll(1)} className="mt-2 shrink-0" />
      </div>

      <div ref={rail} className="-mr-6 mt-10 flex snap-x gap-5 overflow-x-auto pr-6 [scrollbar-width:none] sm:-mr-10 sm:pr-10 lg:-mr-12 lg:pr-12 [&::-webkit-scrollbar]:hidden">
        {testimonials.items.map((t) => (
          <article key={t.name} className="relative w-[82%] shrink-0 snap-start sm:w-[44%] lg:w-[41%]">
            <div className="h-14 pl-0.5">
              <p className="font-display text-sm">{t.name}</p>
              <p className="mt-1 text-[0.6rem] text-white/60 uppercase">{t.role}</p>
            </div>
            <div className="relative -mt-3 h-[20rem] overflow-hidden rounded-2xl bg-[#262626] sm:h-[18.5rem]">
              {t.image && <img src={t.image} alt="" className="absolute inset-0 size-full object-cover" />}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              <div className="absolute inset-x-5 bottom-5 sm:right-16">
                <p className="text-sm/snug uppercase">{t.text}</p>
                <p className="mt-4 flex items-center gap-2 text-xs">
                  <Stars /> {t.rating}
                </p>
              </div>
              <Quote className="absolute right-3 bottom-3 size-9 fill-white" strokeWidth={0} aria-hidden />
            </div>
          </article>
        ))}
      </div>

      <dl className="mt-14 grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
        {testimonials.stats.map((s, i) => (
          <div key={i}>
            <dt className="font-display text-[clamp(2rem,4vw,3.3rem)] leading-none font-normal">{s.value}</dt>
            <dd className="mt-3 text-[0.65rem] text-white/80 uppercase">{s.label}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
