import { useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    quote:
      '"Amazing experience from start to finish. The team was so patient and found us the perfect family car at an honest price."',
    name: "James Benjamin",
    location: "New York, NY",
    avatar:
      "https://framerusercontent.com/images/svhwVFQ0URrfMSfN16PGdhN9Ys.png",
  },
  {
    quote:
      '"Professional, transparent, and quick. I found my dream car without any of the usual dealership pressure."',
    name: "Sofia Martinez",
    location: "Los Angeles, CA",
    avatar:
      "https://framerusercontent.com/images/d4iEkxkDpEZbSduxqbKIbxMKJw.png",
  },
  {
    quote:
      '"Five-star service. They walked me through every detail of the inspection report before I even asked."',
    name: "David Chen",
    location: "Austin, TX",
    avatar:
      "https://framerusercontent.com/images/4agHmUnU4Ryihw1a86mNVAQt390.jpg",
  },
];

const backgroundImage =
  "https://framerusercontent.com/images/89D2Q5DxYUgeVRjhFyBHaCiEM.webp";

function StarRating() {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className="w-[30px] h-[30px]"
          fill="#ff9800"
          stroke="none"
        />
      ))}
    </div>
  );
}

const wordVariants = {
  hidden: { opacity: 0, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

function AnimatedQuote({ text, activeKey }) {
  const words = text.split(" ");
  return (
    <motion.p
      key={activeKey}
      className="font-sans text-xl md:text-3xl text-center text-brand-white max-w-[900px]"
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, filter: "blur(6px)", transition: { duration: 0.2 } }}
      variants={{ visible: { transition: { staggerChildren: 0.025 } } }}
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
    </motion.p>
  );
}

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Direct scroll-linked value, no spring — moves exactly with scroll,
  // never lags behind and never overshoots/rebounces after you stop.
  // Widened range (-25% to 25%) so it also reads as faster/more dramatic.
  const bgY = useTransform(scrollYProgress, [0, 1], ["-25%", "25%"]);

  const current = testimonials[active];

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden"
    >
      {/* Parallax background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div style={{ y: bgY }} className="absolute inset-0">
          <img
            src={backgroundImage}
            alt=""
            className="absolute top-1/2 left-1/2 w-full h-[150%] max-w-none -translate-x-1/2 -translate-y-1/2 object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 bg-brand-black/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-[700px] px-5 flex flex-col items-center gap-16">
        <div className="flex flex-col items-center gap-8">
          <StarRating />

          <AnimatePresence mode="wait">
            <AnimatedQuote text={current.quote} activeKey={active} />
          </AnimatePresence>

          <motion.div
            key={`meta-${active}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="flex flex-col items-center gap-1"
          >
            <p className="font-sans text-lg font-semibold text-brand-white">
              {current.name}
            </p>
            <p className="font-sans text-base text-brand-gray">
              {current.location}
            </p>
          </motion.div>
        </div>

        {/* Avatar selector */}
        <div className="flex items-center justify-center gap-6">
          {testimonials.map((t, i) => (
            <button
              key={t.name}
              onClick={() => setActive(i)}
              aria-label={`Show testimonial from ${t.name}`}
              className={`rounded-full overflow-hidden transition-all duration-300 ${
                i === active
                  ? "w-[64px] h-[64px] border-2 border-border-subtle"
                  : "w-[48px] h-[48px] opacity-60 hover:opacity-100"
              }`}
            >
              <img
                src={t.avatar}
                alt={t.name}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}