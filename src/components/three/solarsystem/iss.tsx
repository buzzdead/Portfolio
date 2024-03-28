import { useFrame } from '@react-three/fiber'
import { MutableRefObject, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { Mesh } from 'three'

interface Props {
  planetRef: MutableRefObject<any>
}

const ISS = ({ planetRef }: Props) => {
  const { scene } = useGLTF('/isstation.glb')
  const issRef = useRef<Mesh>(null)
  scene.scale.set(0.025, 0.025, 0.025)
  scene.position.set(9.75, -0.15, -0.5)

  // Update the position of ISS relative to Earth
  useFrame(({ clock }) => {
    if (issRef.current && planetRef.current) {
      // Determine the radius of the orbit
      const orbitRadius = 0.6 // Adjust this value as needed

      // Calculate the angle based on the elapsed time
      const elapsedTime = clock.getElapsedTime()
      const angle = elapsedTime * 0.6 // Adjust rotation speed as needed

      // Calculate the position of the ISS relative to Earth's position
      const x = Math.cos(angle) * orbitRadius + planetRef.current.position.x
      const z = Math.sin(angle) * orbitRadius + planetRef.current.position.z

      // Set the position of the ISS
      issRef.current.position.set(x, 0, z)
    }
  })

  return (
    <mesh ref={issRef}>
      <primitive object={scene} />
    </mesh>
  )
}

export default ISS
