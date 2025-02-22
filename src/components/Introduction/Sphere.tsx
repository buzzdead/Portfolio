import { useCursor } from '@react-three/drei'
import { useState, useEffect } from 'react'
import HolographicMaterial from './HolographicMaterial'
import { MathUtils } from 'three'

const Sphere = () => {
  const [hovered, setHovered] = useState(false)
  useCursor(hovered)



  return (
    <mesh
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <sphereGeometry args={[1.5, 64, 64]} />
      <HolographicMaterial /> {/* Use the shader here */}
    </mesh>
  )
}

export default Sphere
