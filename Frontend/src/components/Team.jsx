// components/Team.jsx
import { motion } from "framer-motion";

const team = [
  {
    name: "Michael Jordan",
    role: "Founder & CEO",
    image:
      "https://framerusercontent.com/images/25IeiD5d8e2c2Tdsev4DJAaE5G8.webp",
    alt: "a man standing in front of a fence",
  },
  {
    name: "Arden Smith",
    role: "Lead Service Advisor",
    image:
      "https://framerusercontent.com/images/NJIEA8mvpDfoKobJkggsLmraIM.webp",
    alt: "man in black crew neck long sleeve shirt standing beside gray metal cabinet",
  },
  {
    name: "David Kim",
    role: "Technical Director",
    image:
      "https://framerusercontent.com/images/bmwl2MvsHYHHp6GkgnKmPqwZ8.webp",
    alt: "a man standing in front of a fence",
  },
];

// Progressive blur: stacked layers, each blurred more and masked to a lower
// band of the image, so blur increases smoothly toward the bottom edge
// instead of one flat backdrop-blur band.
const BLUR_LAYERS = [
  { blur: 0.12, from: 0, to: 37.5 },
  { blur: 0.23, from: 12.5, to: 50 },
  { blur: 0.47, from: 25, to: 62.5 },
  { blur: 0.94, from: 37.5, to: 75 },
  { blur: 1.88, from: 50, to: 87.5 },
  { blur: 3.75, from: 62.5, to: 100 },
  { blur: 7.5, from: 75, to: 112.5 },
  { blur: 15, from: 87.5, to: 125 },
];

function ProgressiveBlur() {
  return (
    <div className="pointer-events-none absolute inset-0">
      {BLUR_LAYERS.map((layer, i) => {
        const mid1 = layer.from + (layer.to - layer.from) * 0.25;
        const mid2 = layer.from + (layer.to - layer.from) * 0.5;
        const mask = `linear-gradient(to bottom, rgba(0,0,0,0) ${layer.from}%, rgba(0,0,0,1) ${mid1}%, rgba(0,0,0,1) ${mid2}%, rgba(0,0,0,0) ${layer.to}%)`;
        return (
          <div
            key={i}
            className="absolute inset-0"
            style={{
              zIndex: i + 1,
              backdropFilter: `blur(${layer.blur}px)`,
              WebkitBackdropFilter: `blur(${layer.blur}px)`,
              maskImage: mask,
              WebkitMaskImage: mask,
            }}
          />
        );
      })}
    </div>
  );
}

// Word-stagger variants — blur+fade+rise
const wordVariants = {
  hidden: { opacity: 0.001, filter: "blur(10px)", y: 10 },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

// Card entrance — fades+rises from below with a subtle blur
const cardVariants = {
  hidden: { opacity: 0, y: 40, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.65, ease: [0.25, 0.1, 0.25, 1] },
  },
};

function AnimatedHeading({ text }) {
  const words = text.split(" ");
  return (
    <motion.h2
      className="mb-14 text-center text-3xl font-medium text-white md:text-4xl"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.6 }}
      variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
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

function TeamCard({ member }) {
  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl bg-black"
      style={{
        border: "2px solid rgba(255,255,255,0.1)",
        aspectRatio: "904 / 1200",
      }}
    >
      <img
        src={member.image}
        alt={member.alt}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />

      <ProgressiveBlur />

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgb(15,15,15) 77%)",
        }}
      />

      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-0.5 p-6">
        <p className="text-lg font-medium text-white">{member.name}</p>
        <p className="text-sm text-[rgb(217,217,217)]">{member.role}</p>
      </div>
    </div>
  );
}

export default function Team() {
  return (
    <section id="team" className="bg-[rgb(15,15,15)] px-6 py-24 md:px-12">
      <div className="mx-auto w-full max-w-[1380px]">
        <AnimatedHeading text="People Behind Us" />

        {/* Cards stagger in once 30% of the grid enters view */}
        <motion.div
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.14 } },
          }}
        >
          {team.map((member) => (
            <motion.div key={member.name} variants={cardVariants}>
              <TeamCard member={member} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}