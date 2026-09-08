// components/Gallery.jsx
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const images = [
  {
    src: "https://framerusercontent.com/images/HK9iMrgR3syhVy3Uj3wnWOHY7dE.webp",
    alt: "Black muscle car with glowing red headlights at night.",
    aspect: "1920 / 1280",
    offset: "up",
  },
  {
    src: "https://framerusercontent.com/images/KM4P03czdioTouqOxr3XvMPCwM.png",
    alt: "Rear view of a black supercar",
    aspect: "1200 / 800",
    offset: "down",
  },
  {
    src: "https://framerusercontent.com/images/bxL09Ot6e4y1tLYW78s8RZQH1Q.webp",
    alt: "Front view, black car in a dark garage",
    aspect: "3519 / 5281",
    offset: "up",
  },
  {
    src: "https://framerusercontent.com/images/cpqrEgtHUxNySLD95lGZ0CK4wKM.jpg",
    alt: "",
    aspect: "906 / 1200",
    offset: "down",
  },
  {
    src: "https://framerusercontent.com/images/DgoYDoHye1nH4IJXBwpmwaIBia8.webp",
    alt: "Silhouette of a car with glowing red headlights",
    aspect: "1920 / 2400",
    offset: "up",
  },
  {
    src: "https://framerusercontent.com/images/qS96IukbfLpucFjxeSB10YzD2k.png",
    alt: "Rear view of a silver performance car with neon red",
    aspect: "2376 / 1756",
    offset: "down2",
  },
];

const OFFSET_Y = {
  up: 24,
  down: -4,
  down2: -16,
};

const wordVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

function AnimatedHeading({ text }) {
  const words = text.split(" ");
  return (
    <motion.h2
      className="text-3xl font-medium text-white md:text-4xl"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.6 }}
      variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={wordVariants}
          className="mr-[0.25em] inline-block"
        >
          {word}
        </motion.span>
      ))}
    </motion.h2>
  );
}

function GalleryCard({ image }) {
  return (
    <div
      className="relative h-[380px] shrink-0 overflow-hidden rounded-2xl bg-black md:h-[440px]"
      style={{
        border: "2px solid rgba(255,255,255,0.1)",
        aspectRatio: image.aspect,
        transform: `translateY(${OFFSET_Y[image.offset]}px)`,
      }}
    >
      <img
        src={image.src}
        alt={image.alt}
        loading="lazy"
        className="h-full w-full object-cover object-center"
        style={{
          maskImage:
            "linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 25%)",
          WebkitMaskImage:
            "linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 25%)",
        }}
      />
    </div>
  );
}

export default function Gallery() {
  const scrollRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"],
  });

  const x = useTransform(scrollYProgress, [0, 1], ["2%", "-72%"]);

  return (
    <section id="gallery" className="bg-[rgb(15,15,15)]">
      {/* Everything — heading AND the card track — lives inside this
          scroll-space wrapper now, so the heading stays pinned in view
          for the whole horizontal pass instead of scrolling away first. */}
      <div ref={scrollRef} className="relative h-[300vh]">
        <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
          <div className="mx-auto mb-10 w-full max-w-[1380px] px-6 md:px-12">
            <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
              <AnimatedHeading text="Future on Display" />
              <motion.p
                className="max-w-[420px] text-base text-[rgb(217,217,217)]"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 }}
              >
                A curated glimpse into the next generation of automotive
                performance.
              </motion.p>
            </div>
          </div>

          <motion.div style={{ x }} className="flex gap-6 pl-6 md:pl-12">
            {images.map((image, i) => (
              <GalleryCard key={i} image={image} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}