import { motion } from "framer-motion";

const features = [
  {
    title: "Wide Selection",
    description:
      "Curated inventory of the world's most prestigious automotive brands.",
    image:
      "https://framerusercontent.com/images/p2zVxW5GfLqiJQjAb4ceXzAV28.jpg",
    icon: (
      <svg viewBox="0 0 28 25" fill="none" className="w-6 h-6">
        <path
          d="M26.281 8.618 24.366 2.871C23.796 1.156 22.19-0.002 20.383 0H7.617C5.81-0.002 4.204 1.156 3.634 2.871L1.719 8.618C0.679 9.055 0.002 10.072 0 11.2v7c0 1.054.592 1.963 1.455 2.44-.019.093-.055.177-.055.273v2.887c0 .773.627 1.4 1.4 1.4h1.4c.773 0 1.4-.627 1.4-1.4V21h16.8v2.8c0 .773.627 1.4 1.4 1.4h1.4c.773 0 1.4-.627 1.4-1.4v-2.887c0-.096-.036-.182-.055-.273.894-.487 1.452-1.422 1.455-2.44v-7c0-1.161-.711-2.157-1.719-2.582ZM2.8 18.2v-7h22.4l.003 7H2.8ZM7.617 2.8h12.764c.604 0 1.138.384 1.329.958l1.548 4.642H4.742l1.547-4.642c.19-.572.726-.958 1.328-.958ZM4.2 14.7a2.1 2.1 0 1 1 4.2 0 2.1 2.1 0 0 1-4.2 0Zm15.4 0a2.1 2.1 0 1 1 4.2 0 2.1 2.1 0 0 1-4.2 0Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    title: "Certified Quality",
    description:
      "Every vehicle undergoes a rigorous 150-point technical inspection.",
    image:
      "https://framerusercontent.com/images/4OFvMIaRayQ0f2o7F9Rn8GFDNI.jpg",
    icon: (
      <svg viewBox="0 0 28 25" fill="none" className="w-6 h-6">
        <path
          d="M13.128 14.041c-.228-.571-.228-1.027-.114-1.484H2.283V3.995l6.849 4.567 6.85-4.567v1.941c.685-.342 1.255-.342 1.598-.342.114-.115.342-.229.571-.343V1.826C18.265.799 17.466 0 16.438 0H1.826C.799 0 0 .799 0 1.826v11.188C0 14.041.799 14.84 1.826 14.84h11.758c-.228-.228-.342-.456-.456-.799Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    title: "Extended Warranty",
    description:
      "Comprehensive coverage plans that give you peace of mind on every mile.",
    image:
      "https://framerusercontent.com/images/ETAkL6ocKle9hFoTeTN9seAxRZc.webp",
    icon: (
      <svg viewBox="0 0 28 25" fill="none" className="w-6 h-6">
        <path
          d="M18.516 9.578c.182-.223.267-.51.235-.797a1.11 1.11 0 0 0-.408-.724c-.477-.374-1.165-.299-1.551.169l-5.176 6.349-2.768-2.127c-.47-.383-1.16-.32-1.555.14-.187.219-.278.505-.251.792.026.287.168.552.392.733l3.628 2.83c.477.388 1.178.319 1.569-.156l5.88-7.225Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    title: "Flexible Financing",
    description:
      "Tailored financial solutions designed to fit your unique portfolio.",
    image:
      "https://framerusercontent.com/images/6J3wpAEtDoifWCoRoFkUas3sc.webp",
    icon: (
      <svg viewBox="0 0 28 25" fill="none" className="w-6 h-6">
        <path
          d="M19.759 0c-.165.004-.328.026-.488.066L2.344 4.524A2.083 2.083 0 0 0 0 7.552v14.323C0 23.589 1.411 25 3.125 25h18.75C23.588 25 25 23.589 25 21.875V8.333c0-1.713-1.412-3.124-3.125-3.124H7.943L19.791 2.084v2.083h2.084V2.084C21.875.912 20.878-.016 19.759 0ZM3.125 7.292h18.75c.589 0 1.041.452 1.041 1.041v13.542c0 .59-.452 1.042-1.041 1.042H3.125c-.59 0-1.042-.452-1.042-1.042V8.333c0-.589.452-1.041 1.042-1.041Zm16.146 6.25a1.562 1.562 0 1 0 0 3.125 1.562 1.562 0 0 0 0-3.125Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
];

const cardVariants = {
  hidden: {
    opacity: 0,
    filter: "blur(10px)",
    y: 40,
  },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

const wordVariants = {
  hidden: { opacity: 0, filter: "blur(6px)", y: 8 },
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
      className="font-display text-3xl md:text-5xl font-bold tracking-wide text-brand-white"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.6 }}
      variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={wordVariants}
          className="inline-block mr-[0.3em]"
        >
          {word}
        </motion.span>
      ))}
    </motion.h2>
  );
}

export default function WhyChooseUs() {
  return (
    <section className="bg-brand-black w-full py-24 px-5">
      <div className="max-w-[1380px] mx-auto flex flex-col lg:flex-row gap-16 items-start">
        {/* LEFT: sticky heading, stays fixed in place while user scrolls */}
        <div className="w-full lg:w-1/2 lg:sticky lg:top-32 flex flex-col gap-6">
          <AnimatedHeading text="What Sets Us Apart" />
          <motion.p
            className="text-brand-white text-lg md:text-2xl max-w-[480px]"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            We believe a car isn't just transportation. It's a statement of
            identity, ambition, and lifestyle.
          </motion.p>
        </div>

        {/* RIGHT: cards scroll upward past the sticky heading */}
        <div className="w-full lg:w-1/2 flex flex-col gap-6">
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="relative h-[447px] rounded-2xl overflow-hidden border-2 border-border-subtle bg-brand-black"
            >
              {/* Background image */}
              <img
                src={feature.image}
                alt={feature.title}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-card via-transparent" />

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col justify-end gap-8 p-8">
                <div className="w-14 h-14 rounded flex items-center justify-center bg-brand-accent/10 text-brand-white">
                  {feature.icon}
                </div>
                <div className="flex flex-col gap-3">
                  <h3 className="font-sans font-semibold text-xl text-brand-white">
                    {feature.title}
                  </h3>
                  <p className="font-sans text-base text-brand-gray max-w-[387px]">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}