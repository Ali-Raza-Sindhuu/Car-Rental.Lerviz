import { useEffect, useRef } from 'react'
import * as THREE from 'three'

/**
 * Tiny rotating icosahedron used as the nav logo mark — a stand-in
 * for the original canvas-based gradient icon.
 */
export default function ThreeLogoMark({ size = 40 }) {
  const mountRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 10)
    camera.position.z = 2.4

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(size, size)
    mount.appendChild(renderer.domElement)

    const geometry = new THREE.IcosahedronGeometry(1, 0)
    const material = new THREE.MeshBasicMaterial({
      color: 0xdb0404,
      wireframe: true,
    })
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    let frameId
    const animate = () => {
      mesh.rotation.x += 0.006
      mesh.rotation.y += 0.009
      renderer.render(scene, camera)
      frameId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(frameId)
      geometry.dispose()
      material.dispose()
      renderer.dispose()
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement)
      }
    }
  }, [size])

  return (
    <div
      ref={mountRef}
      style={{ width: size, height: size }}
      className="rounded-full overflow-hidden"
    />
  )
}
