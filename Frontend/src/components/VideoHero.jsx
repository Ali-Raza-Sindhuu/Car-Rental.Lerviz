// components/VideoHero.jsx
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

// Word-stagger — plain fade+rise (no blur, for video overlay legibility)
const wordVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  },
};

function AnimatedHeading({ text }) {
  const words = text.split(" ");
  return (
    <motion.h2
      className="text-3xl sm:text-4xl md:text-5xl font-bold text-white text-center leading-tight max-w-2xl"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
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

const VideoHero = () => {
  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* BG Video */}
      <div className="absolute inset-0 w-full h-full">
        <video
          src="https://framerusercontent.com/assets/j7YOKdrFaHxjuuoW9KsUBzpsqN0.mp4"
          poster="https://framerusercontent.com/images/d5M4QubEydCYK9352w5qillv0MI.png?width=1200&height=800"
          loop
          muted
          playsInline
          autoPlay
          preload="auto"
          className="w-full h-full object-cover block bg-transparent"
        />
      </div>

      {/* Darkening overlay */}
      <div className="absolute inset-0 w-full h-full bg-black/55" />

      {/* Text overlay — fades in on scroll-into-view */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-6 text-center z-10">
        <AnimatedHeading text="The Road Begins Here" />

        {/* Subtitle — delayed after heading */}
        <motion.p
          className="text-[#d9d9d9] text-base md:text-lg max-w-md"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.55, ease: "easeOut", delay: 0.38 }}
        >
          Every journey deserves a car that matches your ambition.
        </motion.p>

        {/* CTA — slides up last */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.55 }}
        >
          <Link
            to="/inventory"
            className="inline-flex items-center justify-center rounded-md bg-[#db0404] px-8 py-[18px] text-white uppercase tracking-wide text-[15px] font-normal transition-colors hover:bg-[#c00303]"
          >
            Explore Fleet
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default VideoHero;