import { useEffect, useRef } from 'react'
import gsap from 'gsap'

/**
 * Infinite horizontal marquee, GSAP-driven. Duplicates the track's
 * children once so the loop is seamless, then tweens x from 0 to
 * -50% forever.
 */
export function useMarquee(speed = 40) {
  const trackRef = useRef(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    if (prefersReducedMotion) return

    const width = track.scrollWidth / 2
    const duration = width / speed

    const tween = gsap.fromTo(
      track,
      { x: 0 },
      { x: -width, duration, ease: 'none', repeat: -1 }
    )

    return () => tween.kill()
  }, [speed])

  return trackRef
}
