// components/InventoryCard.jsx
// Parallax: blurred bg layer and centered card image move in opposite directions
// as the card scrolls through the viewport — direct scroll binding via
// useScroll + useTransform (no spring, no lag, no overshoot).
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChartNoAxesColumnIncreasingIcon, Logs, CalendarMinus2 } from "lucide-react";

const InventoryCard = ({ car }) => {
  const containerRef = useRef(null);

  // Track this card's own transit through the viewport
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Blurred background moves down as you scroll down (slow parallax)
  const bgY = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  // Center card image moves in the opposite direction for depth separation
  const cardY = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);

  return (
    <a
      href={`./inventory/${car.slug}`}
      ref={containerRef}
      className="group relative block w-full overflow-hidden"
    >
      <div className="relative w-full aspect-[16/11] md:aspect-[21/11] overflow-hidden">
        {/* Blurred Background — moves with scroll, opposite to center card */}
        <motion.div
          style={{ y: bgY }}
          className="absolute inset-[-20%] bg-cover bg-center bg-no-repeat"
          aria-hidden="true"
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${car.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "blur(4px)",
            }}
          />
        </motion.div>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Centered Card Image — moves opposite to bg for parallax depth */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            style={{ y: cardY }}
            className="relative rounded-2xl shadow-2xl overflow-hidden"
            aria-hidden="false"
          >
            <div
              className="bg-cover bg-center bg-no-repeat rounded-2xl"
              style={{
                backgroundImage: `url(${car.image})`,
                width: "726px",
                height: "497.33px",
              }}
            >
              <div className="absolute inset-0 bg-black/50 rounded-2xl" />

              <div className="absolute inset-0 flex items-center justify-center">
                <h2 className="text-4xl md:text-5xl font-bold text-white text-center">
                  {car.name}
                </h2>
              </div>

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex flex-nowrap items-center justify-center gap-8 text-white/90 mt-32 whitespace-nowrap">
                  <div className="flex flex-col items-center gap-2 shrink-0">
                    <ChartNoAxesColumnIncreasingIcon className="h-5 w-5 text-neutral-300" />
                    <p className="text-lg font-semibold">{car.topSpeed}</p>
                  </div>
                  <div className="flex flex-col items-center gap-2 shrink-0">
                    <Logs className="h-5 w-5 text-neutral-300" />
                    <p className="text-lg font-semibold">{car.transmission}</p>
                  </div>
                  <div className="flex flex-col items-center gap-2 shrink-0">
                    <CalendarMinus2 className="h-5 w-5 text-neutral-300" />
                    <p className="text-lg font-semibold">{car.year}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </a>
  );
};

export default InventoryCard;