import { useState } from "react";
import { Link } from "react-router-dom";
import { Globe, Menu, MoveDown, X } from "lucide-react";
import SlantButton from "@/components/common/SlantButton";
import Avatars from "@/components/common/Avatars";
import Heading from "@/components/common/Heading";
import { site } from "@/data/site";
import { customers, heroStats, img } from "@/data/home";

export default function Hero() {
  const [open, setOpen] = useState(false);

  return (
    <section id="home" className="relative pt-12">
      {/* Navigation sits on the white strip above the card */}
      <nav className="absolute inset-x-0 top-0 z-30 flex h-12 items-center justify-between lg:right-1/2 lg:pr-6">
        <div className="flex items-center gap-8">
          <Link to="/" className="font-logo text-2xl leading-none font-semibold tracking-tight">
            {site.name}
          </Link>
          <ul className="hidden items-center gap-6 text-[0.7rem] uppercase tracking-wide md:flex">
            {site.nav.map((item, i) => (
              <li key={item.label}>
                <Link to={item.href} className={i === 0 ? "text-ink" : "text-muted-foreground hover:text-ink"}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <button
          type="button"
          className="grid size-9 place-items-center md:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      {open && (
        <ul className="absolute inset-x-0 top-12 z-40 space-y-1 rounded-2xl bg-white p-4 text-sm uppercase shadow-lg md:hidden">
          {site.nav.map((item) => (
            <li key={item.label}>
              <Link to={item.href} onClick={() => setOpen(false)} className="block py-2">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      )}

      {/* Raised tab on the top-right of the card */}
      <div aria-hidden className="absolute top-0 right-0 left-1/2 hidden h-20 rounded-tl-[1.25rem] rounded-tr-[2.5rem] bg-black lg:block" />
      <div
        aria-hidden
        className="fillet hidden lg:block"
        style={{
          "--r": "1.5rem",
          top: "1.5rem",
          left: "calc(50% - 1.5rem)",
          background: "radial-gradient(circle at 0 0, transparent 1.5rem, #000 calc(1.5rem + 0.5px))",
        }}
      />

      <div className="relative min-h-[640px] overflow-hidden rounded-[2rem] bg-black text-white lg:h-[clamp(560px,55vw,800px)] lg:min-h-0 lg:rounded-[2.5rem] lg:rounded-tr-none">
        <img
          src={img.hero}
          alt="A sports car parked in a dark showroom"
          className="absolute inset-0 size-full object-cover object-[50%_75%] grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/30 to-black/60" />

        <SlantButton look="outline-dark" accent="white" className="absolute top-5 right-5 z-10 sm:right-8 lg:right-6">
          Stay with us
        </SlantButton>

        <div className="relative z-10 px-6 pt-24 sm:px-10 lg:absolute lg:top-[16%] lg:left-[7.5%] lg:p-0">
          <Heading as="h1" className="text-[clamp(2rem,4.8vw,4rem)] font-normal">
            {"Drive your\ndream today"}
          </Heading>
          <SlantButton as={Link} to="/app" className="mt-7" accent="red">
            Browse cars
          </SlantButton>
        </div>

        <dl className="relative z-10 mt-10 flex gap-10 px-6 sm:px-10 lg:absolute lg:top-[16%] lg:right-[15%] lg:mt-0 lg:flex-col lg:gap-8 lg:p-0">
          {heroStats.map((s) => (
            <div key={s.label}>
              <dd className="font-display text-xl lg:text-[clamp(1.2rem,2.4vw,2rem)]">{s.value}</dd>
              <dt className="mt-1 text-xs text-white/60">{s.label}</dt>
            </div>
          ))}
        </dl>

        {/* Scroll indicator tab (right edge) */}
        <a
          href="#about"
          className="absolute top-[19%] right-0 hidden h-[36%] w-9 flex-col items-center justify-between rounded-l-[1.75rem] bg-white py-6 text-ink lg:flex"
        >
          <span className="text-[0.6rem] tracking-wide uppercase [writing-mode:vertical-rl]">Scroll down</span>
          <MoveDown className="size-5 text-brand" strokeWidth={1.25} />
        </a>

        {/* Customers panel (bottom-right) */}
        <div className="absolute right-0 bottom-0 z-10 hidden h-[24%] w-[38%] items-center gap-5 bg-white pr-6 pl-4 text-ink [clip-path:polygon(7%_0,100%_0,100%_100%,0_100%)] md:flex">
          <div className="h-[84%] w-[52%] self-end overflow-hidden rounded-tl-2xl [clip-path:polygon(15%_0,100%_0,100%_100%,0_100%)]">
            <img src={img.heroThumb} alt="" className="size-full object-cover" />
          </div>
          <div className="space-y-2">
            <Globe className="size-8 text-brand" strokeWidth={1.25} />
            <p className="text-[0.65rem] uppercase">{customers.label}</p>
            <div className="flex items-center gap-2">
              <span className="font-display text-xl">{customers.count}</span>
              <Avatars initials={customers.initials} size="size-6" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
