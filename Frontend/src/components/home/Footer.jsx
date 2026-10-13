import { Link } from "react-router-dom";
import { Camera } from "lucide-react";
import SlantButton from "@/components/common/SlantButton";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

const socialGlyph = {
  instagram: <Camera className="size-3.5" />,
  facebook: <span className="text-xs font-bold">f</span>,
  linkedin: <span className="text-[0.65rem] font-bold">in</span>,
  x: <span className="text-xs font-bold">𝕏</span>,
};

export default function Footer() {
  return (
    <footer className="mesh-dark relative overflow-hidden rounded-[2rem] text-white lg:rounded-[2.5rem]">
      <div className="grid gap-12 p-6 sm:p-10 lg:grid-cols-[repeat(100,minmax(0,1fr))] lg:gap-0 lg:px-12 lg:pt-12 lg:pb-0">
        <div className="lg:col-span-28">
          <Link to="/" className="font-logo text-3xl leading-none font-semibold">
            {site.name}
          </Link>
          <p className="mt-6 max-w-[16rem] text-[0.7rem]/relaxed uppercase">
            Every week we share the latest arrivals, best deals, and exclusive offers.
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
          <hr className="mt-9 border-white/25" />
          <p className="mt-9 text-[0.7rem] uppercase">{site.copyright}</p>
        </div>

        <div className="lg:col-span-60 lg:col-start-41">
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

          <h3 className="mt-12 font-display text-base">Subscribe on Newsletter</h3>
          <p className="mt-4 max-w-xs text-[0.7rem]/relaxed uppercase">
            Get the latest AI insights, updates, and innovations delivered straight to your inbox.
          </p>
          <form onSubmit={(e) => e.preventDefault()} className="mt-6 flex max-w-md items-center justify-between rounded-xl border border-white/25 p-1 pl-4">
            <label htmlFor="newsletter" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter"
              type="email"
              required
              placeholder="TYPE E-MAIL HERE"
              className="min-w-0 flex-1 bg-transparent text-[0.65rem] text-white outline-none placeholder:text-white/40"
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

      <p aria-hidden className="pointer-events-none mt-6 translate-y-[18%] text-center font-display text-[clamp(3.5rem,15.5vw,13rem)] leading-none text-white/45 select-none">
        {site.wordmark}
      </p>
    </footer>
  );
}
