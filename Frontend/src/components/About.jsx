import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ScanHeart, CarTaxiFront, HeartHandshake } from "lucide-react";
import aboutImage from '../assets/images/about_image.avif';

/** Reusable rolling/swap-up text for the outline button, matching Hero's CTA style */
function RollingText({ text }) {
  return (
    <span className="relative inline-block overflow-hidden">
      <span className="block transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:-translate-y-full">
        {text}
      </span>
      <span
        aria-hidden="true"
        className="absolute left-0 top-0 block translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:translate-y-0"
      >
        {text}
      </span>
    </span>
  );
}

const FEATURES = [
  {
    icon: ScanHeart,
    title: "Precision Selection",
    description:
      "Every car is handpicked to meet high standards of quality, performance, and design.",
  },
  {
    icon: CarTaxiFront,
    title: "Seamless Experience",
    description:
      "From browsing to purchase, every step is smooth, clear, and stress-free.",
  },
  {
    icon: HeartHandshake,
    title: "Trusted Process",
    description:
      "We prioritize honesty, transparency, and long-term customer satisfaction.",
  },
];

// Blur+fade+rise word variants (matches Blog/Gallery style)
const wordVariants = {
  hidden: { opacity: 0.001, filter: "blur(10px)", y: 10 },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

function AnimatedHeading({ text }) {
  const words = text.split(" ");
  return (
    <motion.h3
      className="text-white text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-left"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      variants={{ visible: { transition: { staggerChildren: 0.055 } } }}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={wordVariants}
          className="inline-block mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </motion.h3>
  );
}

// Card entrance variant
const cardVariants = {
  hidden: { opacity: 0, y: 28, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] },
  },
};

function About() {
  return (
    <section className="relative w-full bg-black px-6 md:px-12 lg:px-16 py-20 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

          {/* Left: Text + CTA */}
          <div className="flex flex-col gap-6">
            <AnimatedHeading text="More Than a Showroom— A Destination for True Driving Enthusiasts" />

            {/* Description — fades up after heading */}
            <motion.p
              className="text-[#d9d9d9] text-base md:text-lg text-left max-w-lg"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.55, ease: "easeOut", delay: 0.3 }}
            >
              Levrix redefines the car buying experience through curated
              vehicles, refined presentation, and a commitment to excellence.
            </motion.p>

            {/* CTA — slides in last */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.48 }}
            >
              <Link
                to="/inventory"
                className="group relative inline-flex w-fit items-center justify-center overflow-hidden rounded-md border border-white/80 px-8 py-[18px] text-white shadow-[0_0.6px_0.6px_rgba(0,0,0,0.13),0_2.3px_2.3px_rgba(0,0,0,0.13),0_10px_10px_rgba(0,0,0,0.13)] backdrop-blur-sm transition-colors hover:bg-white/5"
              >
                <span className="font-sans text-[18px] font-normal uppercase tracking-[0.02em] leading-[1.2em]">
                  <RollingText text="Browse Inventory" />
                </span>
              </Link>
            </motion.div>
          </div>

          {/* Right: Image — clip-path reveal from left */}
          <motion.div
            className="relative w-full aspect-[3/2] overflow-hidden rounded-md border border-white/10"
            initial={{ opacity: 0, clipPath: "inset(0% 100% 0% 0%)" }}
            whileInView={{ opacity: 1, clipPath: "inset(0% 0% 0% 0%)" }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
          >
            <img
              src={aboutImage}
              alt="Red McLaren in luxury showroom"
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
              style={{ objectPosition: "50.6% 100%" }}
            />
          </motion.div>
        </div>

        {/* Feature cards — staggered fade+blur from below */}
        <motion.div
          className="mt-14 md:mt-20 grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.12 } },
          }}
        >
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <motion.div
              key={title}
              variants={cardVariants}
              className="flex flex-col gap-4 rounded-md border border-white/10 p-6 md:p-7"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-red-600">
                <Icon className="h-5 w-5 text-white" strokeWidth={2} />
              </div>
              <div className="flex flex-col gap-1.5">
                <p className="text-white text-base font-medium">{title}</p>
                <p className="text-[#d9d9d9] text-sm leading-relaxed">
                  {description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default About;