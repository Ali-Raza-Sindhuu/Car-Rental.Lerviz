const PARTNER_LOGOS = [
  { src: "https://framerusercontent.com/images/a42skenwaIi9JvFh5Wo6WaVe8c.svg", width: 197, height: 48 },
  { src: "https://framerusercontent.com/images/RBraaCCGtUvg7dHxMgtD2rZ2wzQ.svg", width: 177, height: 48 },
  { src: "https://framerusercontent.com/images/ORzHMcaFtxEiv9rdSUXZiR49IWA.svg", width: 202, height: 48 },
  { src: "https://framerusercontent.com/images/MWuFr5b0wTycJUT1rRtR9RByGFY.svg", width: 162, height: 48 },
  { src: "https://framerusercontent.com/images/NDzCqtEE4n50gawt2a8v5stTcM.svg", width: 197, height: 48 },
];

// Render the array twice so the track is continuous — this becomes ONE list
const TICKER_ITEMS = [...PARTNER_LOGOS, ...PARTNER_LOGOS];

function PartnersLogo() {
  return (
    <section className="relative w-full overflow-hidden bg-brand-black py-10 md:py-14">
      <ul className="flex w-max shrink-0 items-center gap-8 md:gap-12 animate-ticker">
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
    </section>
  );
}

export default PartnersLogo;