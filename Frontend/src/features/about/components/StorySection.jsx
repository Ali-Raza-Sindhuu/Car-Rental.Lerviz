import { Globe } from "lucide-react";
import firstImage from "@/assets/about_01.png";
import secondImage from "@/assets/about_02.png";
import SectionHeading from "@/shared/SectionHeading";

const StorySection = () => (
  <section aria-labelledby="story-title" className="bg-neutral-50 px-4 py-16 md:px-12 md:py-24">
    <div className="mx-auto max-w-[1400px]">
      <SectionHeading id="story-title" eyebrow="Our story" lead={["A love of cars."]} muted={["A better way to find yours."]} body="A car is a personal choice. The experience of finding it should feel just as considered." className="max-w-2xl" />
      <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-[1fr_auto]">
        <div className="min-h-[240px] overflow-hidden rounded-2xl lg:min-h-[300px]"><img src={firstImage} alt="Grey sports car outside a modern building" loading="lazy" className="h-full w-full object-cover" /></div>
        <article className="flex min-h-[360px] flex-col justify-between gap-8 rounded-2xl bg-neutral-900 p-6 text-white lg:row-span-2">
          <div><p className="text-xs font-extrabold tracking-widest">REVEX</p><h3 className="mt-3 text-xl font-bold tracking-tight">The first mile matters.</h3></div>
          <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-widest text-white/70"><span>ESTD. 2012*</span><Globe aria-hidden="true" className="size-12 text-white/30" strokeWidth={1} /></div>
          <div><p className="text-sm leading-relaxed text-white/60">Our story starts with a simple ambition: bring the care of a specialist showroom to the search for your next car. From the first shortlist to the final handover, make the details clear and the conversation human.</p><p className="mt-4 text-[11px] text-white/60">*Founding date and story are draft placeholders awaiting company confirmation.</p></div>
        </article>
        <div className="min-h-[360px] overflow-hidden rounded-2xl md:col-span-2 lg:col-span-1 lg:row-span-2"><img src={secondImage} alt="Driver beside the open trunk of an SUV" loading="lazy" className="h-full w-full object-cover" /></div>
        <div className="flex min-h-[160px] flex-col justify-between gap-4 rounded-2xl bg-[#f05a1a] p-6 text-white"><p className="text-4xl font-bold tracking-tight md:text-5xl">14 years*</p><p className="text-xs text-white/80">Of putting the driver first.<br />*Illustrative figure, pending verification.</p></div>
      </div>
    </div>
  </section>
);
export default StorySection;

