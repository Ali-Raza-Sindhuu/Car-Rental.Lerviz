import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/Hero_image.png";
import { EASE, Reveal } from "@/shared/motion";
import SectionHeading from "@/shared/SectionHeading";
import { btn } from "@/shared/styles";

const HeroSection = () => {
  const reduce = useReducedMotion();

  return (
    <section className="relative flex min-h-svh w-full flex-col overflow-hidden bg-neutral-900 md:min-h-[780px]">
      <motion.img
        src={heroImage}
        alt=""
        initial={reduce ? false : { scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.4, ease: EASE }}
        className="absolute inset-0 size-full object-cover"
      />
      <div className="absolute inset-0 bg-linear-to-r from-black/75 via-black/30 to-transparent" />
      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-black/20" />

      <div className="relative z-10 px-4 pb-10 pt-32 md:px-12 md:pt-44">
        <SectionHeading
          level="h1"
          size="hero"
          tone="dark"
          delay={0.1}
          eyebrow="Built for the next mile"
          eyebrowClassName="text-white/85"
          lead={["Made for", "an amazing", "adventure"]}
          body="Discover a new era of cars designed for performance, technology, and unique mobility."
          className="max-w-xl"
        />
      </div>

      <div className="relative z-10 mt-auto px-4 pb-8 md:px-12 md:pb-10">
        <motion.div
          aria-hidden="true"
          initial={reduce ? false : { scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.4, ease: EASE, delay: 0.9 }}
          className="h-px origin-left bg-white/25"
        />

        <Reveal
          delay={1.1}
          className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex flex-wrap items-center gap-3">
            <Link to="/inventory" className={`group ${btn.primary}`}>
              Browse inventory
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link to="/contact" className={btn.outline}>
              Book a test drive
            </Link>
          </div>

          <div
            aria-hidden="true"
            className="hidden items-center gap-3 text-xs font-medium text-white/70 sm:flex"
          >
            Scroll
            <span className="relative block h-px w-14 overflow-hidden bg-white/25">
              {!reduce && (
                <motion.span
                  className="absolute inset-y-0 left-0 w-1/2 bg-white"
                  animate={{ x: ["-100%", "220%"] }}
                  transition={{
                    duration: 1.8,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatDelay: 0.4,
                  }}
                />
              )}
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default HeroSection;
