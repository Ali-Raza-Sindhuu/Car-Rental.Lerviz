// components/SpecialOffers.jsx
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const offers = [
  {
    id: "summer-sale",
    eyebrow: "Limited time",
    title: "Summer Sale",
    text: "Up to $15,000 off on selected performance models.",
    cta: "Browse inventory",
    href: "./inventory",
    variant: "light",
    image:
      "https://framerusercontent.com/images/ROjnZ8VDrIOIhjHodcx9yt6i0w.webp",
  },
  {
    id: "apr-financing",
    eyebrow: "Financing",
    title: "0% APR Financing",
    text: "Available on all certified pre-owned SUV models through the end of the month.",
    cta: "Pre-qualify now",
    href: "./contact",
    variant: "dark",
  },
];

function RollingButton({ text, href, variant }) {
  const isDark = variant === "dark";

  return (
    <a
      href={href}
      className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-white px-7 py-[15px] text-[13px] font-medium uppercase tracking-[0.08em] shadow-[0_8px_20px_-6px_rgba(0,0,0,0.4)] transition-shadow duration-300 hover:shadow-[0_10px_24px_-6px_rgba(0,0,0,0.5)]"
    >
      <span className="relative block h-[1.2em] overflow-hidden">
        <span className="block leading-[1.2em] text-neutral-950 transition-transform duration-300 ease-out group-hover:-translate-y-[1.2em]">
          {text}
        </span>
        <span className="absolute left-0 top-[1.2em] block leading-[1.2em] text-neutral-950 transition-transform duration-300 ease-out group-hover:-translate-y-[1.2em]">
          {text}
        </span>
      </span>
      <svg
        className="relative h-3.5 w-3.5 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
      >
        <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </a>
  );
}

function SummerSaleCard({ offer }) {
  const cardRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });

  const carY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  return (
    <div
      ref={cardRef}
      className="relative flex min-h-[300px] flex-col justify-between overflow-hidden rounded-[20px] p-10 md:p-12"
      style={{ backgroundColor: "#7a0e0e" }}
    >
      {/* Car image, scroll-parallaxed only — no hover reaction */}
      <div className="pointer-events-none absolute inset-y-0 right-[-2%] w-[58%] overflow-hidden">
        <motion.div style={{ y: carY }} className="h-full w-full">
          <img
            src={offer.image}
            alt=""
            className="h-full w-full object-contain object-center opacity-90"
          />
        </motion.div>
      </div>

      {/* Legibility gradient behind text */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.12) 42%, rgba(0,0,0,0) 60%)",
        }}
      />

      <div className="relative z-10 flex max-w-[52%] flex-col gap-4">
        <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/60">
          {offer.eyebrow}
        </span>
        <h3 className="text-[26px] font-medium leading-tight text-white md:text-[30px]">
          {offer.title}
        </h3>
        <p className="text-[14px] leading-relaxed text-white/75 md:text-[15px]">
          {offer.text}
        </p>
      </div>

      <div className="relative z-10 mt-8">
        <RollingButton text={offer.cta} href={offer.href} variant="light" />
      </div>
    </div>
  );
}

function AprFinancingCard({ offer }) {
  return (
    <div className="relative flex min-h-[300px] flex-col justify-between overflow-hidden rounded-[20px] border border-white/[0.08] bg-neutral-950 p-10 md:p-12">
      <svg
        className="pointer-events-none absolute bottom-10 right-10 h-14 w-20 text-white/25"
        viewBox="0 0 184 133"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M4 96 L48 40 L84 76 L120 20 L156 60 L180 8"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <div className="relative z-10 flex max-w-[68%] flex-col gap-4">
        <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/40">
          {offer.eyebrow}
        </span>
        <h3 className="text-[26px] font-medium leading-tight text-white md:text-[30px]">
          {offer.title}
        </h3>
        <p className="text-[14px] leading-relaxed text-white/55 md:text-[15px]">
          {offer.text}
        </p>
      </div>

      <div className="relative z-10 mt-8">
        <RollingButton text={offer.cta} href={offer.href} variant="dark" />
      </div>
    </div>
  );
}

// Card entrance variant (used by both offer cards below)
const offerCardVariants = {
  hidden: { opacity: 0, y: 36, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.65, ease: [0.25, 0.1, 0.25, 1] },
  },
};

export default function SpecialOffers() {
  return (
    <section className="bg-neutral-950 px-6 py-24 md:px-12">
      {/* Stagger the two cards in as they scroll into view */}
      <motion.div
        className="mx-auto grid w-full max-w-[1200px] grid-cols-1 gap-5 md:grid-cols-2"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.14 } },
        }}
      >
        <motion.div variants={offerCardVariants}>
          <SummerSaleCard offer={offers[0]} />
        </motion.div>
        <motion.div variants={offerCardVariants}>
          <AprFinancingCard offer={offers[1]} />
        </motion.div>
      </motion.div>
    </section>
  );
}