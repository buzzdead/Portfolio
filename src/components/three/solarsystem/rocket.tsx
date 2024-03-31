import { useFrame } from '@react-three/fiber'
import { MutableRefObject, useEffect, useRef, useState } from 'react'
import { useGLTF } from '@react-three/drei'
import { Euler, Matrix4, Mesh, Object3D, Quaternion, Vector3 } from 'three'
import {
  getGeometryOfPlanet,
  getPositionOfPlanet,
  getRefOfPlanet,
  Scene
} from '../space'
import { planets, useSolarSystem } from '../solarsystemprovider'

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
  const { setState, state } = useSolarSystem() 
  const rocketRef = useRef<Mesh>(null)
  scene.scale.set(0.04, 0.04, 0.04)
  const f = 20 + rotationSpeed * 2000
  const theRef = getRefOfPlanet(planetName, celestialObjectRefs)
  const geometry = getGeometryOfPlanet(theRef)

  const lift = (scene: Scene, oldPos: Vector3, factor: number) => {
    const destinationPos = currentDestination.current
    if (!destinationPos) return

    scene.position.y += factor / 25000
    scene.position.x = oldPos.x
    scene.position.z = oldPos.z
    scene.rotation.z -= factor / 3000
    const direction = new Vector3()
      .subVectors(destinationPos, scene.position)
      .normalize()

    if (Math.abs(scene.rotation.z) > 1.55) {
      setLiftOff(false)
    }
  }
  const land = (scene: Scene, factor: number) => {
    if (
      Math.abs(scene.rotation.z) > 0.05 ||
      Math.abs(scene.rotation.x) > 0.05
    ) {
      if (scene.rotation.z < 0) scene.rotation.z += factor / 6500
      else if (scene.rotation.z > 0) scene.rotation.z -= factor / 6500
      if (scene.rotation.x < 0) scene.rotation.x += factor / 6500
      else if (scene.rotation.x > 0) scene.rotation.x -= factor / 6500
    }
    const destinationPos = getPositionOfPlanet(destination, celestialObjectRefs)
    if (scene.position.y > destinationPos.y + 0.2)
      scene.position.y -= factor / 50000
    else if (state.liftOff) setState({...state, planetName: state.destinationName })
    scene.position.x = destinationPos.x + 0.1
    scene.position.z = destinationPos.z
  }

  const travel = (scene: Scene, factor: number) => {
    const destinationPos = getPositionOfPlanet(destination, celestialObjectRefs)
    if (!destinationPos) return
    destinationPos.y += 0.4

    // Direction towards the planet
    const direction = new Vector3()
      .subVectors(destinationPos, scene.position)
      .normalize()

    // Look rotation - align rocket forward with direction
    const targetQuaternion = new Quaternion().setFromUnitVectors(
      new Vector3(0, 1, 0),
      direction
    )

    // Apply rotation smoothly (slerp for smooth interpolation)
    scene.quaternion.slerp(targetQuaternion, 0.1)

    // Calculate distance (for smooth speed adjustments)
    const distance = scene.position.distanceTo(destinationPos)

    // Movement - adjust speed based on distance
    const speedFactor = Math.max(5) // Adjust 5 for distance sensitivity
    scene.position.add(direction.multiplyScalar((factor * speedFactor) / 5000))

    // Check if destination reached
    if (distance < 0.05) setReachedDestination(true)
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
      const planetPosition = getPositionOfPlanet(
        planetName,
        celestialObjectRefs
      )
      const thePlanet = planets.find(p => p.name === planetName)

      const theRef = getRefOfPlanet(planetName, celestialObjectRefs)
      const radius = getGeometryOfPlanet(theRef).boundingSphere.radius || 0
      const boundingSphere = getGeometryOfPlanet(theRef).boundingSphere
      const boundingBox = getGeometryOfPlanet(theRef)?.boundingBox
      scene.position.set(
        planetPosition.x + boundingBox.max.x / thePlanet?.rocketAdjustment.xFactor! || 4,
        planetPosition.y + radius / thePlanet?.rocketAdjustment.radiusFactor! || 2.15 - 0.02,
        planetPosition.z +
          (boundingBox.min.z > 0
            ? boundingBox.min.z / thePlanet?.rocketAdjustment.zFactor! || 4
            : boundingBox.max.z / thePlanet?.rocketAdjustment.zFactor! || 4)
      )
    }
  })

  useEffect(() => {
    if (destination === '') {
      setLiftOff(false)
      setReachedDestination(false)
      currentDestination.current = undefined
      return
    }
    scene.position.set(10.16, 0.2, 0.16)
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
