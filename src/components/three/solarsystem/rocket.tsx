import { useFrame } from '@react-three/fiber'
import { MutableRefObject, useEffect, useRef, useState } from 'react'
import { useGLTF } from '@react-three/drei'
import { Mesh, Vector3 } from 'three'
import { getPositionOfPlanet, Scene } from '../space'

interface RocketProps {
    planetName: string
    destination: string
    rotationSpeed: number
    celestialObjectRefs: MutableRefObject<any[]>
  }
const Rocket = ({
    planetName,
    celestialObjectRefs,
    rotationSpeed,
    destination
  }: RocketProps) => {
    const { scene, animations } = useGLTF('/rocket.glb')
    const [liftOff, setLiftOff] = useState(false)
    const currentDestination = useRef<Vector3>()
    const [reachedDestination, setReachedDestination] = useState(false)
    const rocketRef = useRef<Mesh>(null)
    scene.scale.set(0.04, 0.04, 0.04)
    const f = 20 + rotationSpeed * 2000
  
    const lift = (scene: Scene, oldPos: Vector3, factor: number) => {
      const destinationPos = currentDestination.current
      if(!destinationPos) return
      const angle = scene.position.angleTo(destinationPos)
      scene.rotation.x = -angle
      scene.position.y += factor / 25000
      scene.position.x = oldPos.x
      scene.position.z = oldPos.z
      scene.rotation.z -= factor / 3000
      if (Math.abs(scene.rotation.z) > 1.4) setLiftOff(false)
    }
    const land = (scene: Scene, factor: number) => {
      if(Math.abs(scene.rotation.z) > 0.05){
      if (scene.rotation.z < 0) scene.rotation.z += factor / 6500
      else if (scene.rotation.z > 0) scene.rotation.z -= factor / 6500
      
      
    }
      if (scene.position.y > 0.175) scene.position.y -= factor / 50000
      const destinationPos = getPositionOfPlanet(destination, celestialObjectRefs)
      scene.position.x = destinationPos.x
      scene.position.z = destinationPos.z
    }
    const travel = (scene: Scene, factor: number) => {
      const destinationPos = getPositionOfPlanet(destination, celestialObjectRefs)
      if (!destinationPos) return
      const distanceX = Math.abs(scene.position.x - destinationPos.x)
      const distanceZ = Math.abs(scene.position.z - destinationPos.z)
      const xLongest = distanceX > distanceZ
      const factor2 = (distanceX < 1.1 || distanceZ < 1.1) ? 2 : xLongest ? (distanceX / distanceZ) : (distanceZ / distanceX)
      
      if (scene.position.x > destinationPos.x) scene.position.x -= factor / (xLongest ? 5000 / factor2 : 5000)
      else if (scene.position.x < destinationPos.x)
        scene.position.x += factor / (xLongest ? 5000 / factor2 : 5000)
      if (scene.position.z > destinationPos.z) scene.position.z -= factor / (!xLongest ? 5000 / factor2 : 5000)
      else if (scene.position.z < destinationPos.z)
        scene.position.z += factor / (!xLongest ? 5000 / factor2 : 5000)
  
      if (
        Math.abs(scene.position.x - destinationPos.x) +
          Math.abs(scene.position.z - destinationPos.z) <
        0.05
      )
        setReachedDestination(true)
    }
  
    useFrame(({ clock }) => {
      if (liftOff) {
        const oldPos = getPositionOfPlanet(planetName, celestialObjectRefs)
        lift(scene, oldPos, f)
      } else if (currentDestination.current) {
        if (reachedDestination) {
          land(scene, f)
        } else {
          travel(scene, f)
        }
      } else {
        const position = getPositionOfPlanet(planetName, celestialObjectRefs)
        scene?.position.set(position.x + 0.1, position.y + 0.2, position.z)
      }
    })
  
    useEffect(() => {
      if (destination === '') return
      scene.position.set(10.1, 0.2, 0)
      const destinationPos = getPositionOfPlanet(destination, celestialObjectRefs)
      currentDestination.current = destinationPos
      setLiftOff(true)
    }, [destination])
    return (
      <mesh ref={rocketRef}>
        <primitive object={scene} />
      </mesh>
    )
  }
  
  export default Rocket