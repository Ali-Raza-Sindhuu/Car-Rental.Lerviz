import SlantButton from "@/components/common/SlantButton";
import Heading from "@/components/common/Heading";
import { cta, img } from "@/data/home";
import { site } from "@/data/site";

function SpinningBadge() {
  return (
    <svg viewBox="0 0 100 100" className="size-full motion-safe:animate-[spin-slow_24s_linear_infinite]" aria-hidden>
      <defs>
        <path id="circle" d="M50,50 m-36,0 a36,36 0 1,1 72,0 a36,36 0 1,1 -72,0" />
      </defs>
      <text className="fill-ink font-display" style={{ fontSize: 6.6 }} letterSpacing="2.2">
        <textPath href="#circle">{`${site.name} • Drive your dream today • `}</textPath>
      </text>
    </svg>
  );
}

export default function Cta() {
  return (
    <section id="cta" className="relative min-h-[34rem] overflow-hidden rounded-[2rem] bg-black text-white lg:h-[clamp(560px,55vw,800px)] lg:min-h-0 lg:rounded-[2.5rem]">
      <img src={img.cta} alt="A red sports car in a teal-lit garage" className="absolute inset-0 size-full object-cover object-[40%_80%]" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-black/10" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/50" />

      <Heading className="relative z-10 px-6 pt-10 text-[clamp(1.8rem,4.4vw,3.6rem)] font-normal sm:px-10 lg:absolute lg:top-[9%] lg:left-[7.5%] lg:p-0">
        {cta.title}
      </Heading>

      <div className="absolute inset-x-6 bottom-8 z-10 sm:inset-x-10 lg:inset-x-auto lg:right-[10%] lg:bottom-[24%] lg:w-[25rem]">
        <p className="max-w-sm text-xs/relaxed uppercase">{cta.text}</p>
        <SlantButton className="mt-6" accent="red">
          Gets started
        </SlantButton>
      </div>

      <div className="absolute top-0 right-0 hidden size-36 rounded-bl-[2.5rem] bg-white p-5 lg:block">
        <SpinningBadge />
      </div>
    </section>
  );
}
