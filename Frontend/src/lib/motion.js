export const ease = [0.16, 1, 0.3, 1];

export const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
};

export const maskedRise = {
  hidden: { opacity: 0, y: "110%" },
  visible: { opacity: 1, y: 0, transition: { duration: 0.85, ease } },
};

export const wipe = {
  hidden: { opacity: 0, clipPath: "inset(0 100% 0 0)" },
  visible: { opacity: 1, clipPath: "inset(0 0% 0 0)", transition: { duration: 0.9, ease } },
};

export const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export const slideEdge = {
  hidden: { opacity: 0, x: 32 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease } },
};

export const inView = { once: true, margin: "0px 0px -10% 0px" };
