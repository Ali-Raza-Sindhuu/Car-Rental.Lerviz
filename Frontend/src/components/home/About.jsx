import { useRef } from "react";
import { Globe, Play } from "lucide-react";
import SectionTag from "@/components/common/SectionTag";
import Heading from "@/components/common/Heading";
import ArrowPair from "@/components/common/ArrowPair";
import { about, img } from "@/data/home";
import { cn } from "@/lib/utils";

export default function About() {
  const rail = useRef(null);
  const scroll = (dir) => rail.current?.scrollBy({ left: dir * 280, behavior: "smooth" });

  return (
    <section id="features" className="grid gap-y-12 lg:grid-cols-[repeat(100,minmax(0,1fr))] lg:gap-y-16">
      {/* Reel card */}
      <div className="lg:col-span-32">
        <div className="relative max-w-sm pr-9 lg:max-w-none">
          <div className="aspect-[244/132] overflow-hidden rounded-2xl rounded-br-none">
            <img src={img.reel} alt="A white sports car on an open road" className="size-full object-cover object-[50%_65%]" />
          </div>
          <button
            type="button"
            aria-label="Play reel"
            className="absolute right-0 bottom-0 grid size-9 translate-y-1/2 place-items-center rounded-xl bg-neutral-400/70 text-white backdrop-blur"
          >
            <Play className="size-4 fill-white" />
          </button>
        </div>
        <p className="mt-2 text-xs font-medium uppercase">{about.reelCaption}</p>
      </div>

      {/* Heading */}
      <div className="lg:col-span-49 lg:col-start-52">
        <SectionTag className="text-brand">{about.tag}</SectionTag>
        <Heading className="mt-3 text-[clamp(1.4rem,2.6vw,2.1rem)]">{about.title}</Heading>
        <p className="mt-4 max-w-md text-xs/relaxed text-muted-foreground uppercase">{about.text}</p>
      </div>

      {/* Sourcing */}
      <div className="self-center lg:col-span-32">
        <Globe className="size-11 text-brand" strokeWidth={1.25} />
        <Heading as="h3" className="mt-5 text-[clamp(1rem,1.7vw,1.35rem)]">{about.sourcing.title}</Heading>
        <p className="mt-3 max-w-xs text-xs/relaxed text-muted-foreground uppercase">{about.sourcing.text}</p>
      </div>

      {/* Spec cards */}
      <div className="lg:col-span-49 lg:col-start-52">
        <ArrowPair tone="light" className="mb-4 justify-end" onPrev={() => scroll(-1)} onNext={() => scroll(1)} />
        <div ref={rail} className="-mr-4 flex snap-x gap-3.5 overflow-x-auto pr-4 pb-2 [scrollbar-width:none] md:-mr-8 md:pr-8 lg:mr-0 lg:pr-0 [&::-webkit-scrollbar]:hidden">
          {about.specs.map((s) => (
            <article
              key={s.label}
              className={cn("flex h-52 w-36 shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-border text-center sm:w-[8.4rem] lg:w-[31%]", s.tone)}
            >
              <p className="pt-3 text-[0.6rem] uppercase">{s.label}</p>
              <p className="font-display text-sm">{s.value}</p>
              <div className="mt-auto h-[58%] overflow-hidden rounded-t-xl">
                <img src={s.image} alt="" className="size-full object-cover" />
              </div>
            </article>
          ))}
          <div className="mt-auto h-28 w-36 shrink-0 snap-start overflow-hidden rounded-2xl sm:w-[8.5rem] lg:w-[32%]">
            <img src={img.motion} alt="A car in motion with light streaks" className="size-full object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}
