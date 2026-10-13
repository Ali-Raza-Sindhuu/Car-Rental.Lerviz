// components/CtaSection.jsx
import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import ctaImage from '../assets/images/cta_image.webp';

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
    <motion.h2
      className="text-3xl md:text-5xl font-semibold text-white text-center leading-tight"
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
    </motion.h2>
  );
}

const CtaSection = () => {
  const sectionRef = useRef(null);

  // Track this section's own scroll transit through the viewport —
  // same scoped-progress pattern used for Testimonials/Special Offers.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Direct scroll-linked value, no spring — background drifts opposite
  // the scroll direction, which is what produces the parallax "lag"
  // look (and the motion-blur ghosting you get when scrolling fast).
  const bgY = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-[600px] md:h-[700px] flex items-center justify-center overflow-hidden bg-black"
    >
      {/* BG — oversized + parallaxed so it never exposes an edge while translating */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <motion.div style={{ y: bgY }} className="absolute inset-0">
          <img
            src={ctaImage}
            alt=""
            className="absolute top-1/2 left-1/2 w-full h-[130%] max-w-none -translate-x-1/2 -translate-y-1/2 object-cover"
          />
        </motion.div>

        {/* Overlay Color */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            background:
              "linear-gradient(0deg, rgba(38,38,38,0) 27%, rgba(31,31,31,0.5) 50%, rgb(0,0,0) 86%)",
          }}
        />
      </div>

      {/* Texts */}
      <div className="relative z-10 flex flex-col items-center gap-6 px-6 text-center max-w-2xl">
        <AnimatedHeading text="Ready to Find Your Perfect Car?" />

        <motion.p
          className="text-base md:text-lg text-neutral-300"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.55, ease: "easeOut", delay: 0.32 }}
        >
          Premium vehicles, exceptional service, unbeatable deals. Experience
          automotive excellence crafted for the discerning driver.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.5 }}
        >
          <Link
            to="/inventory"
            className="mt-2 px-8 py-[18px] rounded-md bg-[rgb(219,4,4)] text-white uppercase tracking-wide text-[18px] font-normal shadow-[0_0.6px_0.6px_rgba(0,0,0,0.13),0_2.3px_2.3px_rgba(0,0,0,0.13),0_10px_10px_rgba(0,0,0,0.13)] transition-colors hover:bg-[#c00303]"
          >
            Browse Cars
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CtaSection;