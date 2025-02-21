import { useCursor } from '@react-three/drei'
import { useState, useEffect } from 'react'
import HolographicMaterial from './HolographicMaterial'
import { MathUtils } from 'three'

const Sphere = ({ sphereRef }: { sphereRef: React.RefObject<THREE.Mesh> }) => {
  const [hovered, setHovered] = useState(false)
  useCursor(hovered)

  useEffect(() => {
    if (sphereRef.current) {
      const yPos = sphereRef.current.position.y
      const distanceScale = MathUtils.lerp(1, 1.1, Math.abs(yPos) * 0.05)
      sphereRef.current.scale.setScalar(distanceScale)
    }
  }, [])

  return (
    <mesh
      ref={sphereRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <sphereGeometry args={[1, 64, 64]} />
      <HolographicMaterial /> {/* Use the shader here */}
    </mesh>
  )
}

export default Sphere
