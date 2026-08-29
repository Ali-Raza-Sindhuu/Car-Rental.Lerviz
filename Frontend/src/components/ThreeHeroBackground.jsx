import { useEffect, useRef } from 'react'
import * as THREE from 'three'

/**
 * Ambient particle-grid scene standing in for the original Framer
 * canvas shader. Slow-drifting points + a faint horizon glow, tuned
 * to sit quietly behind the hero copy rather than compete with it.
 */
export default function ThreeHeroBackground() {
  const mountRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    const width = mount.clientWidth
    const height = mount.clientHeight

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 100)
    camera.position.set(0, 0, 9)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(width, height)
    mount.appendChild(renderer.domElement)

    // Particle field
    const count = 900
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 22
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12
      positions[i * 3 + 2] = (Math.random() - 0.5) * 14
    }
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    const material = new THREE.PointsMaterial({
      color: 0xdb0404,
      size: 0.035,
      transparent: true,
      opacity: 0.55,
      sizeAttenuation: true,
    })
    const points = new THREE.Points(geometry, material)
    scene.add(points)

    // Faint secondary layer, white, slower
    const geometry2 = new THREE.BufferGeometry()
    const positions2 = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      positions2[i * 3] = (Math.random() - 0.5) * 26
      positions2[i * 3 + 1] = (Math.random() - 0.5) * 14
      positions2[i * 3 + 2] = (Math.random() - 0.5) * 18
    }
    geometry2.setAttribute('position', new THREE.BufferAttribute(positions2, 3))
    const material2 = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.02,
      transparent: true,
      opacity: 0.25,
    })
    const points2 = new THREE.Points(geometry2, material2)
    scene.add(points2)

    let frameId
    let mouseX = 0
    let mouseY = 0

    const handlePointerMove = (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('pointermove', handlePointerMove)

    const clock = new THREE.Clock()

    const animate = () => {
      const t = clock.getElapsedTime()

      if (!prefersReducedMotion) {
        points.rotation.y = t * 0.02
        points2.rotation.y = -t * 0.012
        points.rotation.x = Math.sin(t * 0.05) * 0.05

        camera.position.x += (mouseX * 0.6 - camera.position.x) * 0.02
        camera.position.y += (-mouseY * 0.3 - camera.position.y) * 0.02
        camera.lookAt(0, 0, 0)
      }

      renderer.render(scene, camera)
      frameId = requestAnimationFrame(animate)
    }
    animate()

    const handleResize = () => {
      const w = mount.clientWidth
      const h = mount.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('pointermove', handlePointerMove)
      geometry.dispose()
      material.dispose()
      geometry2.dispose()
      material2.dispose()
      renderer.dispose()
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement)
      }
    }
  }, [])

  return <div ref={mountRef} className="absolute inset-0 w-full h-full" />
}
