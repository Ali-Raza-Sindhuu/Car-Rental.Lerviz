import { motion } from 'framer-motion'

/**
 * Fade + rise reveal on scroll-into-view. Mirrors the original site's
 * translateY(30px) -> 0 fade pattern.
 */
export function Reveal({ children, delay = 0, y = 24, className = '' }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

/**
 * Word-by-word blur-in reveal for headings — mirrors the original
 * per-word opacity/blur/translateY stagger.
 */
export function RevealWords({ text, className = '', as: Tag = 'h2', delay = 0 }) {
  const words = text.split(' ')
  return (
    <Tag className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ opacity: 0, y: 10, filter: 'blur(10px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5, delay: delay + i * 0.04, ease: 'easeOut' }}
        >
          {word}
          {i < words.length - 1 ? '\u00A0' : ''}
        </motion.span>
      ))}
    </Tag>
  )
}
