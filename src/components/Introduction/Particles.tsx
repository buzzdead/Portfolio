import { Points } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useRef } from "react"

const Particles = () => {
    const particles = useRef<THREE.Points>(null!)
    useFrame((state, delta) => {
      particles.current.rotation.y += delta * 0.1
    })
    
    return (
      <Points limit={10000} ref={particles}>
        <pointsMaterial
          size={0.015}
          color="cyan"
          transparent
          opacity={0.8}
          sizeAttenuation
        />
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={10000}
            itemSize={3}
            array={new Float32Array(10000 * 3).map(() => 5 - Math.random() * 10)}
          />
        </bufferGeometry>
      </Points>
    )
  }

  export default Particles