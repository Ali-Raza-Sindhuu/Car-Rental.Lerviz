import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'
import { testimonials } from '../data/dummyData'

export default function Testimonials() {
  const [index, setIndex] = useState(0)
  const current = testimonials[index]

  const next = () => setIndex((i) => (i + 1) % testimonials.length)
  const prev = () =>
    setIndex((i) => (i - 1 + testimonials.length) % testimonials.length)

  return (
    <section className="relative py-28 px-5 overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://placehold.co/1600x900/0a0a0a/1a1a1a?text=%20"
          alt=""
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-ink/70" />
      </div>

      <div className="relative max-w-2xl mx-auto text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex justify-center gap-1 mb-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={22}
                  className={
                    i < current.rating
                      ? 'fill-amber-500 text-amber-500'
                      : 'fill-mist/30 text-mist/30'
                  }
                />
              ))}
            </div>

            <p className="font-medium text-lg md:text-2xl mb-8 leading-relaxed">
              "{current.quote}"
            </p>

            <div className="flex flex-col items-center gap-1">
              <img
                src={`https://placehold.co/64x64/141414/db0404?text=${current.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}`}
                alt={current.name}
                className="w-14 h-14 rounded-full mb-2"
              />
              <span className="font-medium">{current.name}</span>
              <span className="text-mist text-sm">{current.location}</span>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-center gap-4 mt-10">
          <button
            onClick={prev}
            aria-label="Previous testimonial"
            className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-ink transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={next}
            aria-label="Next testimonial"
            className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-ink transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  )
}
