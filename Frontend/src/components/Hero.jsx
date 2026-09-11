import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import video from "../assets/videos/hero.mp4";
import poster from "../assets/images/poster.avif";

// Shared word-stagger variants (plain fade+rise — no blur on hero heading
// so the text stays crisp over the video background)
const wordVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] },
  },
};

function AnimatedHeading({ text }) {
  const words = text.split(" ");
  return (
    <motion.h2
      className="text-white text-left text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold leading-tight max-w-xl md:max-w-2xl"
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.08, delayChildren: 0.3 } } }}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={wordVariants}
          className="inline-block mr-[0.2em]"
        >
          {word}
        </motion.span>
      ))}
    </motion.h2>
  );
}

function Hero() {
  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-black flex items-end">
      {/* BG */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0">
          <video
            src={video}
            poster={poster}
            loop
            autoPlay
            muted
            playsInline
            preload="none"
            className="w-full h-full object-cover block"
          />
        </div>

        {/* Overlay Color - blurred/dark everywhere except a soft spotlight over the car */}
        <div
          className="absolute inset-0 bg-black/85 backdrop-blur-[3px] mix-blend-multiply"
          style={{
            WebkitMaskImage:
              "radial-gradient(ellipse 60% 55% at 50% 62%, transparent 0%, transparent 35%, black 85%, black 100%)",
            maskImage:
              "radial-gradient(ellipse 60% 55% at 50% 62%, transparent 0%, transparent 35%, black 85%, black 100%)",
          }}
        />

        {/* Bottom fade so the copy block always sits on solid black */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black via-black/70 to-transparent" />
      </div>

      {/* Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-0 pt-36 sm:pt-48 md:pt-60 pb-4 sm:pb-6 md:pb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-10 sm:gap-14 md:gap-24 lg:gap-32">

          {/* Heading — word-by-word fade+rise, fires on page load (animate, not whileInView) */}
          <AnimatedHeading text="Find Your Dream Car Today" />

          <div className="flex flex-col justify-end gap-5 sm:gap-6 w-full md:max-w-xs lg:max-w-sm shrink-0">
            {/* Description — fades up after heading settles */}
            <motion.p
              className="text-[#d9d9d9] text-sm sm:text-base leading-relaxed"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: 0.65 }}
            >
              Beyond the showroom. Levrix provides a seamless acquisition
              experience for the most discerning automotive enthusiasts.
            </motion.p>

            {/* CTA Button — slides up last */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1], delay: 0.85 }}
            >
              <Link
                to="/contact"
                className="group relative inline-flex w-fit items-center justify-center overflow-hidden rounded-md bg-[#db0404] px-7 sm:px-8 py-3.5 sm:py-[18px] text-white shadow-[0_0.6px_0.6px_rgba(0,0,0,0.13),0_2.3px_2.3px_rgba(0,0,0,0.13),0_10px_10px_rgba(0,0,0,0.13)] transition-colors hover:bg-[#c00303]"
              >
                <span className="font-manrope text-xs sm:text-sm font-normal uppercase tracking-[0.08em] leading-[1.2em]">
                  Book a Test Drive
                </span>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Watermark — edge-to-edge (4px gutters only), sits behind the nav/copy, scales and fades in softly */}
      <motion.div
        className="absolute inset-x-0 top-[10%] sm:top-[11%] md:top-[12%] lg:top-[12%] xl:top-[13%] z-0 px-1 pointer-events-none select-none overflow-hidden"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1], delay: 0.1 }}
      >
        <h1
          className="w-full font-['Orbitron',_sans-serif] font-bold bg-gradient-to-b from-white from-0% via-[#d9d9d9] via-35% via-[#8a8a8a]/40 via-65% to-transparent to-90% bg-clip-text text-transparent text-center leading-[0.85] whitespace-nowrap"
          style={{
            // Scales purely off viewport width so "Levrix" always spans
            // the full 100vw minus the 4px (px-1) gutters on each side,
            // regardless of breakpoint.
            fontSize: "26vw",
            letterSpacing: "-0.045em",
          }}
        >
          Levrix
        </h1>
      </motion.div>
    </section>
  );
}

export default Hero;