import { useFrame } from '@react-three/fiber'
import { MutableRefObject, useEffect, useRef, useState } from 'react'
import { useGLTF } from '@react-three/drei'
import { Mesh, Quaternion, Vector3 } from 'three'
import {
  getGeometryOfPlanet,
  getPositionOfPlanet,
  getRefOfPlanet,
  Scene
} from '../space'
import { planets, useSolarSystem } from '../solarsystemprovider'
import { Planet } from './celestialobject'

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
  const { scene } = useGLTF('/rocket.glb')
  const [liftOff, setLiftOff] = useState(false)
  const currentDestination = useRef<Vector3>()
  const [reachedDestination, setReachedDestination] = useState(false)
  const { setState, state } = useSolarSystem() 
  const rocketRef = useRef<Mesh>(null)
  scene.scale.set(0.04, 0.04, 0.04)
  const f = 20 + rotationSpeed * 2000
  
  const currentPlanet = useRef<Planet>()
  const currentPlanetRef = useRef<any>()
  const currentPlanetRadius = useRef<number>(1)
  const currentPlanetBoundingBox = useRef<any>()

  const destinationPlanet = useRef<Planet>()
  const destinationPlanetRef = useRef<any>()
  const destinationPlanetRadius = useRef<number>(1)
  const destinationPlanetBoundingBox = useRef<any>()

  useEffect(() => {
    if(planetName === '') return
    currentPlanet.current = planets.find(p => p.name === planetName)
    currentPlanetRef.current = getRefOfPlanet(planetName, celestialObjectRefs)
    currentPlanetRadius.current =  getGeometryOfPlanet(currentPlanetRef.current)?.boundingSphere.radius || 0
    currentPlanetBoundingBox.current = getGeometryOfPlanet(currentPlanetRef.current)?.boundingBox
  }, [planetName])

  useEffect(() => {
    if(destination === '') return
    destinationPlanet.current = planets.find(p => p.name === destination)
    destinationPlanetRef.current = getRefOfPlanet(destination, celestialObjectRefs)
    destinationPlanetRadius.current = getGeometryOfPlanet(destinationPlanetRef.current)?.boundingSphere.radius || 0
    destinationPlanetBoundingBox.current = getGeometryOfPlanet(destinationPlanetRef.current)?.boundingBox
  }, [destination])


  const lift = (scene: Scene, oldPos: Vector3, factor: number) => {
    const destinationPos = currentDestination.current
    if (!destinationPos) return

    scene.position.y += factor / 25000
    scene.position.x = oldPos.x
    scene.position.z = oldPos.z
    if(destinationPos.x > currentPlanet?.current?.distanceFromSun!)
    scene.rotation.z -= factor / 3000
    else
    scene.rotation.z += factor / 3000
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
    else if (state.liftOff) 
    {
      setState({...state, planetName: state.destinationName, liftOff: false })
      setReachedDestination(false)
    }
    
    scene.position.x = destinationPos.x + destinationPlanetBoundingBox?.current?.max?.x / destinationPlanet?.current?.rocketAdjustment.xFactor! || 4
    scene.position.z = destinationPos.z + (destinationPlanetBoundingBox?.current?.min?.z > 0
      ? destinationPlanetBoundingBox?.current?.min?.z / destinationPlanet?.current?.rocketAdjustment?.zFactor! || 4
      : destinationPlanetBoundingBox?.current?.max?.z / destinationPlanet?.current?.rocketAdjustment?.zFactor! || 4)
  }

  const travel = (scene: Scene, factor: number) => {
    const destinationPos = getPositionOfPlanet(destination, celestialObjectRefs)
    if (!destinationPos) return
    destinationPos.y += 0.2 + destinationPlanetRadius?.current / destinationPlanet?.current?.rocketAdjustment?.radiusFactor! || 2.15 - 0.02
    destinationPos.x += destinationPlanetBoundingBox?.current?.max?.x / destinationPlanet?.current?.rocketAdjustment.xFactor! || 4
    destinationPos.z += (destinationPlanetBoundingBox?.current?.min?.z > 0
      ? destinationPlanetBoundingBox?.current?.min?.z / destinationPlanet?.current?.rocketAdjustment?.zFactor! || 4
      : destinationPlanetBoundingBox?.current?.max?.z / destinationPlanet?.current?.rocketAdjustment?.zFactor! || 4)

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
      scene.position.set(
        planetPosition.x + currentPlanetBoundingBox?.current?.max?.x / currentPlanet?.current?.rocketAdjustment.xFactor! || 4,
        planetPosition.y + currentPlanetRadius?.current / currentPlanet?.current?.rocketAdjustment?.radiusFactor! || 2.15 - 0.02,
        planetPosition.z +
          (currentPlanetBoundingBox?.current?.min?.z > 0
            ? currentPlanetBoundingBox?.current?.min?.z / currentPlanet?.current?.rocketAdjustment?.zFactor! || 4
            : currentPlanetBoundingBox?.current?.max?.z / currentPlanet?.current?.rocketAdjustment?.zFactor! || 4)
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
