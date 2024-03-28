import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { MutableRefObject, Suspense, useEffect, useRef, useState } from 'react'
import Loader from './Loader'
import { OrbitControls, Stars, useAnimations, useGLTF } from '@react-three/drei'
import { Group, LoopRepeat, Mesh, Object3DEventMap, Vector3 } from 'three'
import CelestialObject, { Planet } from './solarsystem/celestialobject'

const planets: Planet[] = [
  {
    name: 'Mercury',
    distanceFromSun: 4,
    daysAroundSun: 88
  },
  {
    name: 'Venus',
    distanceFromSun: 7.2,
    daysAroundSun: 225
  },
  {
    name: 'Earth',
    distanceFromSun: 10,
    daysAroundSun: 365,
    scale: 0.002,
    hasISS: true,
    description: {
      population: '6 billion',
      populationType: 'Human',
      technologicalAdvancement: 'Type 1',
      age: '4.5 billion'
    }
  },
  {
    name: 'Mars',
    distanceFromSun: 15,
    daysAroundSun: 687
  },
  {
    name: 'Jupiter',
    distanceFromSun: 52,
    daysAroundSun: 4380,
    scale: 0.4
  },
  {
    name: 'Saturn',
    distanceFromSun: 95,
    daysAroundSun: 10767,
    scale: 0.0008
  },
  {
    name: 'Uranus',
    distanceFromSun: 192,
    daysAroundSun: 30660,
    scale: 0.4
  },
  {
    name: 'Neptune',
    distanceFromSun: 301,
    daysAroundSun: 60152
  }
]

const Sun = () => {
  const { scene, animations } = useGLTF('/sun.glb')
  const planetRef = useRef<Mesh>(null)
  const { actions, names } = useAnimations(animations, planetRef)
  useEffect(() => {
    names.forEach(name => {
      const a = actions[name]
      if (a) {
        a.setEffectiveTimeScale(0.3)
        a.setLoop(LoopRepeat, Infinity).play()
      }
    })
  }, [actions, names])
  scene.scale.set(0.1, 0.1, 0.1)
  return (
    <mesh ref={planetRef}>
      <primitive object={scene} />
    </mesh>
  )
}

type Scene = Group<Object3DEventMap>

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

interface PlanetShifterProps {
  planetName: string
  celestialObjectRefs: MutableRefObject<any[]>
}

const getPositionOfPlanet = (
  planetName: string,
  celestialObjectRefs: MutableRefObject<any[]>
) => {
  const planetIndex = planets.findIndex(planet => planet.name === planetName)
  if (planetIndex === -1) {
    console.error(`Planet with name ${planetName} not found.`)
    return new Vector3(0, 0, 0)
  }
  const planetRef = celestialObjectRefs?.current[planetIndex]
  if (!planetRef) {
    console.error(`Ref for planet ${planetName} not found.`)
    return new Vector3(0, 0, 0)
  }

  const planetPosition = planetRef

  if (planetPosition) {
    if (planetPosition.children[0].matrixWorld.elements) {
      const mWorld =
        planetPosition.children[0]?.children[0]?.children[0]?.matrixWorld
          .elements
      const x = mWorld
        ? mWorld[12]
        : planetPosition.children[0].matrixWorld.elements[12]
      const z = mWorld
        ? mWorld[14]
        : planetPosition.children[0].matrixWorld.elements[14]
      return new Vector3(x, 0, z)
    }
  }

  return new Vector3(0, 0, 0)
}

const PlanetShifter = ({
  planetName,
  celestialObjectRefs
}: PlanetShifterProps) => {
  const { camera } = useThree()

  useEffect(() => {
    if (planetName !== '') {
      const position = getPositionOfPlanet(planetName, celestialObjectRefs)
      camera.position.x = position.x
      camera.position.z = position.z
      camera.position.y = 0
    }
  }, [planetName])
  return null
}

interface SpaceProps {
  rotationSpeed: number
  paused: boolean
  planetName: string
  grid: boolean
  showDescription: boolean
  lift: boolean
}

const Space = ({
  rotationSpeed,
  paused,
  planetName,
  grid,
  showDescription,
  lift
}: SpaceProps) => {
  const celestialObjectRefs = useRef<any[]>([])

  return (
    <Canvas
      className={`w-full h-full bg-transparent absolute`}
      camera={{ fov: 20, position: [0, 5, 50], near: 0.1, far: 1000 }}
    >
      <PlanetShifter
        planetName={planetName}
        celestialObjectRefs={celestialObjectRefs}
      />
      <Suspense fallback={<Loader />}>
        <ambientLight intensity={1} />
        <Stars
          radius={360}
          depth={30}
          count={200000}
          factor={7}
          saturation={1}
          fade={true}
        />
        <Sun />
        <Rocket
          destination={lift ? 'Mars' : ''}
          planetName={'Earth'}
          rotationSpeed={rotationSpeed}
          celestialObjectRefs={celestialObjectRefs}
        />
        {planets.map((planet, index) => (
          <CelestialObject
            key={index}
            planet={planet}
            showDescription={showDescription}
            rotationSpeed={paused ? 0 : rotationSpeed}
            ref={ref => (celestialObjectRefs.current[index] = ref)}
            grid={grid}
          />
        ))}
        <OrbitControls
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          zoomSpeed={0.6}
          panSpeed={
            planetName !== '' &&
            planets.find(p => p.name === planetName)?.distanceFromSun! > 387
              ? 0.025
              : 0.5
          }
          rotateSpeed={
            planetName !== '' &&
            planets.find(p => p.name === planetName)?.distanceFromSun! > 387
              ? 0.025
              : 0.4
          }
        />
        <directionalLight position={[1, 1, 2]} intensity={2} />
      </Suspense>
    </Canvas>
  )
}

export default Space
