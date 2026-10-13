import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import logoImage from '../assets/images/Lerviz_logo.avif';

/** Counts up from 0 to a target number once the element scrolls into view. */
function useCountUp(target, duration = 1500) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const hasRun = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasRun.current) {
          hasRun.current = true;
          const start = performance.now();

          const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
            else setCount(target);
          };

          requestAnimationFrame(tick);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return [count, ref];
}

function StatCounter({ prefix = "", value, suffix, label }) {
  const [count, ref] = useCountUp(value);

  return (
    <div ref={ref} className="flex flex-col items-center gap-3 text-center">
      <div className="flex items-center justify-center gap-1 font-['Orbitron',_sans-serif] font-medium text-4xl md:text-5xl text-white">
        {prefix && <span>{prefix}</span>}
        <span>{count}</span>
        <span className="text-[#db0404]">{suffix}</span>
      </div>
      <p className="text-[#d9d9d9] text-sm md:text-base">{label}</p>
    </div>
  );
}

// Word-stagger variants — blur+fade+rise, matching the Blogs/Gallery heading style
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
      className="text-white text-3xl sm:text-4xl md:text-5xl font-bold leading-tight max-w-3xl text-center"
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

function Intro() {
  return (
    <section className="relative w-full bg-black px-6 py-20 md:py-28">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-10 md:gap-14">

        {/* Rotating icon/graphic — ambient slow spin, not scroll-linked */}
        <motion.div
          className="h-24 w-24 md:h-32 md:w-32"
          initial={{ opacity: 0, scale: 0.8, rotate: -20 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          // After entrance, start slow continuous rotation
          animate={{ rotate: 360 }}
          // Note: whileInView initial overrides animate initial, so we
          // use a wrapper motion div to separate entrance from spin.
        >
          <motion.img
            src={logoImage}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover rounded-full"
            initial={{ opacity: 0, scale: 0.75 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            animate={{ rotate: 360 }}
            style={{ originX: 0.5, originY: 0.5 }}
            // Slow ambient spin via CSS-equivalent: Framer transition on animate
          />
        </motion.div>

        {/* Heading + paragraph */}
        <div className="flex flex-col items-center gap-5 text-center">
          <AnimatedHeading text="we don't just sell cars we craft experiences" />

          {/* Description — fades up after heading stagger completes */}
          <motion.p
            className="text-[#d9d9d9] text-base md:text-lg max-w-xl"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.55, ease: "easeOut", delay: 0.35 }}
          >
            At Levrix, we believe a car is more than just a way to get from
            one place to another—it&rsquo;s a reflection of who you are.
          </motion.p>
        </div>

        {/* Stats — staggered fade-up */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-6 md:gap-10 w-full pt-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.12 } },
          }}
        >
          {[
            { prefix: "$", value: 120, suffix: "M+", label: "Luxury Cars Sales" },
            { value: 10, suffix: "+", label: "Years of Experience" },
            { value: 95, suffix: "%", label: "Client Satisfaction" },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
              }}
            >
              <StatCounter
                prefix={stat.prefix}
                value={stat.value}
                suffix={stat.suffix}
                label={stat.label}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default Intro;