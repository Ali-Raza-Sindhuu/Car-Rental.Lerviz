// components/InventorySection.jsx
import { useRef } from "react";
import { motion } from "framer-motion";
import InventoryCard from "./InventoryCard";

const inventoryData = [
  {
    id: 1,
    name: "Lamborghini Huracán",
    slug: "lamborghini-huracán",
    image: "https://framerusercontent.com/images/2qaOY29IxvV9sFJrKBsLiQXaSw.jpg",
    topSpeed: "325 km/h",
    transmission: "Automatic",
    year: "2023",
  },
  {
    id: 2,
    name: "Audi R8",
    slug: "audi-r8",
    image: "https://framerusercontent.com/images/iuCR1PM3FAVHTBueXbuukfuD7Y8.jpg",
    topSpeed: "330 km/h",
    transmission: "Automatic",
    year: "2022",
  },
  {
    id: 3,
    name: "BMW M4",
    slug: "bmw-m4",
    image: "https://framerusercontent.com/images/nniBMDKFMcgHgLnujuthibms05Y.jpg",
    topSpeed: "290 km/h",
    transmission: "Automatic",
    year: "2023",
  },
];

// Staggered card entrance — each inventory card fades+rises in
const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] },
  },
};

const InventorySection = () => {
  return (
    <section className="py-20 bg-neutral-950">
      <div className="w-full">
        {/* Staggered list — fires once when 20% of the section enters view */}
        <motion.div
          className="flex flex-col gap-0"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={listVariants}
        >
          {inventoryData.map((car) => (
            <motion.div key={car.id} variants={itemVariants}>
              <InventoryCard car={car} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default InventorySection;