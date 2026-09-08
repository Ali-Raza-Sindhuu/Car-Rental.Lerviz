// components/ContactHero.jsx
import { motion } from "framer-motion";

export default function ContactHero() {
  return (
    <section className="relative flex h-[420px] w-full items-center justify-center overflow-hidden md:h-[520px]">
      {/* BG */}
      <div className="absolute inset-0 h-full w-full overflow-hidden">
        <motion.img
          src="https://framerusercontent.com/images/Wo9crTEVc5eHihpsYq1wgtMydZQ.jpg?width=4600&height=3450"
          alt="red sports car on concrete flooring"
          className="h-full w-full object-cover object-center"
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        />
        {/* Overlay Color */}
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Branding + Texts */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <motion.h1
          className="text-4xl font-semibold text-white md:text-6xl"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
        >
          Get In Touch
        </motion.h1>
      </div>
    </section>
  );
}