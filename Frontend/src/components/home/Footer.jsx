import { Link } from "react-router-dom";
import { Camera } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import SlantButton from "@/components/common/SlantButton";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";
import { inView, maskedRise } from "@/lib/motion";

const socialGlyph = {
  instagram: <Camera className="size-3.5" />,
  facebook: <span className="text-xs font-bold">f</span>,
  linkedin: <span className="text-[0.65rem] font-bold">in</span>,
  x: <span className="text-xs font-bold">𝕏</span>,
};

export default function Footer() {
  const reduced = useReducedMotion();
  return (
    <footer className="mesh-dark relative @container overflow-hidden rounded-[2rem] text-white md:rounded-[2.5rem]">
      <div className="grid gap-12 p-[max(1.5rem,5cqw)] pb-0 md:grid-cols-[35%_1fr] md:gap-[5cqw]">
        <div>
          <Link to="/" className="font-logo text-3xl leading-none font-semibold">
            {site.name}
          </Link>
          <p className="mt-6 max-w-[16rem] text-[0.7rem]/relaxed uppercase">
            {site.footerIntro}
          </p>
          <div className="mt-6 flex items-center gap-4 text-[0.7rem] uppercase">
            Follow us on
            <ul className="flex gap-2">
              {site.socials.map((s, i) => (
                <li key={s}>
                  <a
                    href="#"
                    aria-label={s}
                    className={cn("grid size-6 place-items-center rounded", i === 0 ? "bg-white text-ink" : "border border-white/40")}
                  >
                    {socialGlyph[s]}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <Separator className="mt-9 bg-white/25" />
          <p className="mt-9 text-[0.7rem] uppercase">{site.copyright}</p>
        </div>

        <div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-8 text-[0.7rem] uppercase sm:grid-cols-3">
            {site.footerColumns.map((col, ci) => (
              <ul key={ci} className="space-y-4">
                {col.map((label, li) => (
                  <li key={label}>
                    <a href="#" className={cn("hover:text-white", ci === 1 && li === 0 ? "text-white" : "text-white/60")}>
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            ))}
          </div>

          <h3 className="mt-12 font-display text-base">{site.newsletterTitle}</h3>
          <p className="mt-4 max-w-xs text-[0.7rem]/relaxed uppercase">
            {site.newsletterText}
          </p>
          <form onSubmit={(e) => e.preventDefault()} className="mt-6 flex max-w-md items-center justify-between rounded-xl border border-white/25 p-1 pl-4">
            <label htmlFor="newsletter" className="sr-only">
              Email address
            </label>
            <Input
              id="newsletter"
              type="email"
              required
              placeholder="TYPE E-MAIL HERE"
              className="min-w-0 flex-1 border-0 bg-transparent text-[0.65rem] text-white placeholder:text-white/40"
            />
            <SlantButton type="submit" look="outline-dark" accent="white" className="h-8 sm:h-9">
              Subscribe
            </SlantButton>
          </form>

          <ul className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-[0.7rem] text-white/60 uppercase">
            {site.legal.map((l) => (
              <li key={l}>
                <a href="#" className="hover:text-white">
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div aria-hidden className="pointer-events-none mt-6 overflow-hidden text-center select-none">
        <motion.p variants={reduced ? undefined : maskedRise} initial={reduced ? false : "hidden"} whileInView="visible" viewport={inView} className="translate-y-[18%] font-display text-[max(3.1rem,14cqw)] leading-none text-white/45">{site.wordmark}</motion.p>
      </div>
    </footer>
  );
}
