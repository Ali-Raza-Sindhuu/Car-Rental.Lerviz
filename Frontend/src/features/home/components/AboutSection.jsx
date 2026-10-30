import { Globe } from "lucide-react";
import firstImage from "@/assets/about_01.png";
import secondImage from "@/assets/about_02.png";
import { Reveal } from "@/shared/motion";
import SectionHeading from "@/shared/SectionHeading";

const AboutSection = () => (
  <section
    id="about"
    aria-labelledby="about-title"
    className="bg-neutral-50 px-4 py-16 md:px-12 md:py-24"
  >
    <div className="mx-auto max-w-[1400px]">
      <SectionHeading
        id="about-title"
        align="center"
        eyebrow="About Revex"
        lead={["We build more than cars."]}
        muted={["We build the way forward."]}
        body="At Revex, we believe a great automobile should do more than take you from one place to another. It should make every journey feel purposeful, connected, and unforgettable."
        className="max-w-2xl"
      />

      {/* Bento grid */}
      <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-[1fr_auto]">
        <Reveal
          y={32}
          className="min-h-[240px] overflow-hidden rounded-2xl lg:min-h-[300px]"
        >
          <img
            src={firstImage}
            alt="Grey sports car parked outside a modern building"
            className="size-full object-cover"
          />
        </Reveal>

        <Reveal
          y={32}
          delay={0.1}
          className="flex min-h-[360px] flex-col justify-between rounded-2xl bg-neutral-900 p-6 text-white lg:row-span-2"
        >
          <div className="text-center">
            <p className="text-xs font-extrabold tracking-widest">REVEX</p>
            <h3 className="mt-3 text-xl font-bold tracking-tight">
              Built around the drive
            </h3>
          </div>

          <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-widest text-white/70">
            <span>Estd.</span>
            <Globe className="size-12 text-white/30" strokeWidth={1} />
            <span>2012 - 14</span>
          </div>

          <p className="text-xs leading-relaxed text-white/60">
            At Revex, we think a great car should do more than transport you; it
            should make every journey feel purposeful, connected, and
            unforgettable.
          </p>
        </Reveal>

        <Reveal
          y={32}
          delay={0.2}
          className="relative min-h-[360px] overflow-hidden rounded-2xl md:col-span-2 lg:col-span-1 lg:row-span-2"
        >
          <img
            src={secondImage}
            alt="Driver at the open trunk of an SUV"
            className="absolute inset-0 size-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />
          <p className="absolute bottom-6 left-6 max-w-[180px] text-xl font-bold leading-snug tracking-tight text-white">
            It&apos;s all about the vibe, you know?
          </p>
        </Reveal>

        <Reveal
          y={32}
          delay={0.3}
          className="flex min-h-[160px] flex-col justify-between rounded-2xl bg-[#f05a1a] p-6 text-white"
        >
          <div>
            <p className="text-4xl font-bold tracking-tight md:text-5xl">48K+</p>
            <p className="mt-1 text-xs text-white/80">
              Various Vehicles on the Busy Road
            </p>
          </div>
          <a
            href="mailto:info@revex.com"
            className="mt-6 text-sm font-semibold hover:underline"
          >
            info@revex.com
          </a>
        </Reveal>
      </div>
    </div>
  </section>
);

export default AboutSection;
