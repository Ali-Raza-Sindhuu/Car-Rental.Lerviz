import { motion } from "framer-motion";

const PARTNER_LOGOS = [
  { src: "https://framerusercontent.com/images/a42skenwaIi9JvFh5Wo6WaVe8c.svg", width: 197, height: 48 },
  { src: "https://framerusercontent.com/images/RBraaCCGtUvg7dHxMgtD2rZ2wzQ.svg", width: 177, height: 48 },
  { src: "https://framerusercontent.com/images/ORzHMcaFtxEiv9rdSUXZiR49IWA.svg", width: 202, height: 48 },
  { src: "https://framerusercontent.com/images/MWuFr5b0wTycJUT1rRtR9RByGFY.svg", width: 162, height: 48 },
  { src: "https://framerusercontent.com/images/NDzCqtEE4n50gawt2a8v5stTcM.svg", width: 197, height: 48 },
];

// Render twice so the track is continuous (seamless loop)
const TICKER_ITEMS = [...PARTNER_LOGOS, ...PARTNER_LOGOS];

function PartnersLogo() {
  return (
    // Section fades in as it enters the viewport
    <motion.section
      className="relative w-full overflow-hidden bg-brand-black py-10 md:py-14"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      {/* left fade */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 md:w-32 bg-gradient-to-r from-brand-black to-transparent" />
      {/* right fade */}
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 md:w-32 bg-gradient-to-l from-brand-black to-transparent" />

      {/* CSS-driven ticker — @keyframes ticker lives in index.css */}
      <ul className="flex w-max shrink-0 items-center gap-8 md:gap-12 animate-ticker will-change-transform">
        {TICKER_ITEMS.map((logo, i) => (
          <li key={i} className="shrink-0" aria-hidden={i >= PARTNER_LOGOS.length}>
            <img
              src={logo.src}
              width={logo.width}
              height={logo.height}
              alt=""
              loading="lazy"
              decoding="async"
              className="h-8 md:h-10 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity"
            />
          </li>
        ))}
      </ul>
    </motion.section>
  );
}

export default PartnersLogo;