import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import gsap from 'gsap'

export default function Counter({ value, prefix = '', suffix = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const [display, setDisplay] = useState(0)
  const target = Number(value)

  useEffect(() => {
    if (!inView) return
    const obj = { val: 0 }
    gsap.to(obj, {
      val: target,
      duration: 1.4,
      ease: 'power2.out',
      onUpdate: () => setDisplay(Math.round(obj.val)),
    })
  }, [inView, target])

  return (
    <span
      ref={ref}
      className="font-display text-4xl md:text-5xl font-medium text-white"
    >
      {prefix}
      {display}
      <span className="text-accent">{suffix}</span>
    </span>
  )
}
