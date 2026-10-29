import { motion, useReducedMotion } from "framer-motion";

export const EASE = [0.22, 1, 0.36, 1];

/*
 * Scroll animation rules for the whole home page. Everything plays once and
 * is skipped for reduced-motion users.
 *   headings -> <Wipe>            clip-path wipe, no movement (text stays crisp)
 *   copy     -> <Reveal>          fade only
 *   cards    -> <Reveal y={32}>   fade + small rise
 *
 * Don't put `transition-all` on a <Reveal> element: CSS would fight the
 * animation. Use transition-[translate,box-shadow] for hover effects instead.
 */

export const Reveal = ({ as = "div", delay = 0, y = 0, children, ...props }) => {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  return (
    <Tag
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: y ? 0.2 : 0.35 }}
      transition={{ duration: 0.8, ease: EASE, delay }}
      {...props}
    >
      {children}
    </Tag>
  );
};

export const Wipe = ({ as = "span", delay = 0, children, ...props }) => {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  return (
    <Tag
      initial={
        reduce ? false : { clipPath: "inset(-10% -2% 110% -2%)", opacity: 0 }
      }
      whileInView={{ clipPath: "inset(-10% -2% -10% -2%)", opacity: 1 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.9, ease: EASE, delay }}
      {...props}
    >
      {children}
    </Tag>
  );
};
