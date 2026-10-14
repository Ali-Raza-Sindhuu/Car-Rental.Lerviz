import { motion, useReducedMotion } from "motion/react";
import Heading from "@/components/common/Heading";
import { maskedRise, inView } from "@/lib/motion";

export default function RevealHeading({ children, className, as = "h2" }) {
  const reduced = useReducedMotion();
  return (
    <Heading as={as} className={className}>
      {String(children).split("\n").map((line, index) => (
        <span key={`${line}-${index}`} className="block overflow-hidden">
          <motion.span className="block" variants={reduced ? undefined : maskedRise} initial={reduced ? false : "hidden"} whileInView="visible" viewport={inView}>
            {line}
          </motion.span>
        </span>
      ))}
    </Heading>
  );
}
