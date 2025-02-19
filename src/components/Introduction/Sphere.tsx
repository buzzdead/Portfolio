import { useCursor } from "@react-three/drei/web/useCursor"
import { useState } from "react"

// Add mouse interaction using drei's useCursor and hover events
const Sphere = () => {
    const [hovered, setHovered] = useState(false)
    return (
      <mesh
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry />
        <meshPhysicalMaterial
          color={hovered ? "hotpink" : "cyan"}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
    )
  }

  export default Sphere