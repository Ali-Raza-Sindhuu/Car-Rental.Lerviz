import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import ThreeHeroBackground from './ThreeHeroBackground'
import video from '../assets/videos/hero_video.mp4'

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
}

const word = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
}

export default function Hero() {
  const headline = 'Find Your Dream Car Today'.split(' ')

  return (
    <section className="relative h-screen min-h-[700px] w-full overflow-hidden bg-ink">
      {/* Background video — drop your file at public/videos/hero-bg.mp4 */}
      <div className="absolute inset-0">
        <video
          className="w-full h-full object-cover opacity-60"
          src={video}
          poster="https://placehold.co/1600x1000/0a0a0a/1a1a1a?text=%20"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        />
      </div>

      {/* Three.js ambient particle field */}
      <ThreeHeroBackground />

      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/70" />

      <div className="relative z-10 h-full flex flex-col items-center justify-center px-5 text-center">
        <motion.h2
          variants={container}
          initial="hidden"
          animate="show"
          className="font-display text-3xl md:text-5xl font-semibold tracking-wide2 max-w-3xl mb-5"
        >
          {headline.map((w, i) => (
            <motion.span key={i} variants={word} className="inline-block mr-3">
              {w}
            </motion.span>
          ))}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-mist max-w-xl mb-8 text-base md:text-lg"
        >
          Beyond the showroom. Levrix provides a seamless acquisition
          experience for the most discerning automotive enthusiasts.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.85 }}
        >
          <Link to="/inventory" className="btn-primary">
            Book a Test Drive
          </Link>
        </motion.div>
      </div>

      {/* Oversized watermark wordmark */}
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.2 }}
        className="pointer-events-none select-none absolute bottom-[-4%] left-1/2 -translate-x-1/2 font-display font-bold text-mist/20 whitespace-nowrap"
        style={{ fontSize: 'min(24vw, 300px)' }}
      >
        Levrix
      </motion.h1>
    </section>
  )
}